package org.matrixnetwork.stats.auth;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import fr.xephi.authme.api.v3.AuthMeApi;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;

/**
 * HTTP handlers for the auth shim. All handlers require a matching
 * X-Auth-Shim-Secret header. AuthMe API calls are dispatched onto the
 * Bukkit main thread because AuthMe's API is not thread-safe.
 */
public final class AuthHandler {

    private final JavaPlugin plugin;
    private final String sharedSecret;
    private final long authmeCallTimeoutMs;

    public AuthHandler(JavaPlugin plugin, String sharedSecret, long authmeCallTimeoutMs) {
        this.plugin = plugin;
        this.sharedSecret = sharedSecret;
        this.authmeCallTimeoutMs = authmeCallTimeoutMs;
    }

    public HttpHandler health() {
        return exchange -> {
            try {
                if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                    sendStatus(exchange, 405, "{\"error\":\"method not allowed\"}");
                    return;
                }
                if (!checkSecret(exchange)) return;
                sendStatus(exchange, 200, "{\"ok\":true}");
            } finally {
                exchange.close();
            }
        };
    }

    public HttpHandler verify() {
        return exchange -> {
            try {
                if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                    sendStatus(exchange, 405, "{\"error\":\"method not allowed\"}");
                    return;
                }
                if (!checkSecret(exchange)) return;

                JsonObject body = readJsonBody(exchange);
                String username = optString(body, "username");
                String password = optString(body, "password");
                if (username == null || username.isBlank() || password == null) {
                    sendStatus(exchange, 400, "{\"error\":\"username and password are required\"}");
                    return;
                }

                Boolean ok = runOnMain(() -> {
                    AuthMeApi api = AuthMeApi.getInstance();
                    if (!api.isRegistered(username)) {
                        return Boolean.FALSE;
                    }
                    return api.checkPassword(username, password);
                });

                if (ok == null) {
                    sendStatus(exchange, 504, "{\"error\":\"authme call timed out\"}");
                    return;
                }
                sendStatus(exchange, 200, ok ? "{\"ok\":true}" : "{\"ok\":false}");
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "verify failed", ex);
                sendStatus(exchange, 500, "{\"error\":\"internal error\"}");
            } finally {
                exchange.close();
            }
        };
    }

    public HttpHandler changePassword() {
        return exchange -> {
            try {
                if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                    sendStatus(exchange, 405, "{\"error\":\"method not allowed\"}");
                    return;
                }
                if (!checkSecret(exchange)) return;

                JsonObject body = readJsonBody(exchange);
                String username = optString(body, "username");
                String currentPassword = optString(body, "currentPassword");
                String newPassword = optString(body, "newPassword");
                if (username == null || username.isBlank()
                        || currentPassword == null
                        || newPassword == null || newPassword.isBlank()) {
                    sendStatus(exchange, 400,
                            "{\"error\":\"username, currentPassword, newPassword are required\"}");
                    return;
                }

                String result = runOnMain(() -> {
                    AuthMeApi api = AuthMeApi.getInstance();
                    if (!api.isRegistered(username)) {
                        return "not_registered";
                    }
                    if (!api.checkPassword(username, currentPassword)) {
                        return "bad_current_password";
                    }
                    api.changePassword(username, newPassword);
                    return "ok";
                });

                if (result == null) {
                    sendStatus(exchange, 504, "{\"error\":\"authme call timed out\"}");
                    return;
                }
                switch (result) {
                    case "ok":
                        sendStatus(exchange, 200, "{\"ok\":true}");
                        return;
                    case "not_registered":
                        sendStatus(exchange, 404, "{\"ok\":false,\"error\":\"not_registered\"}");
                        return;
                    case "bad_current_password":
                        sendStatus(exchange, 401, "{\"ok\":false,\"error\":\"bad_current_password\"}");
                        return;
                    default:
                        sendStatus(exchange, 500, "{\"ok\":false,\"error\":\"" + result + "\"}");
                }
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "change-password failed", ex);
                sendStatus(exchange, 500, "{\"error\":\"internal error\"}");
            } finally {
                exchange.close();
            }
        };
    }

    private boolean checkSecret(HttpExchange exchange) throws IOException {
        String header = exchange.getRequestHeaders().getFirst("X-Auth-Shim-Secret");
        if (header == null || !constantTimeEquals(header, sharedSecret)) {
            sendStatus(exchange, 401, "{\"error\":\"unauthorized\"}");
            return false;
        }
        return true;
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        byte[] ab = a.getBytes(StandardCharsets.UTF_8);
        byte[] bb = b.getBytes(StandardCharsets.UTF_8);
        if (ab.length != bb.length) return false;
        int diff = 0;
        for (int i = 0; i < ab.length; i++) {
            diff |= ab[i] ^ bb[i];
        }
        return diff == 0;
    }

    private static JsonObject readJsonBody(HttpExchange exchange) throws IOException {
        byte[] bytes = exchange.getRequestBody().readAllBytes();
        if (bytes.length == 0) {
            return new JsonObject();
        }
        String raw = new String(bytes, StandardCharsets.UTF_8);
        try {
            return JsonParser.parseString(raw).getAsJsonObject();
        } catch (Exception ex) {
            throw new IOException("Invalid JSON body", ex);
        }
    }

    private static String optString(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) return null;
        return obj.get(key).getAsString();
    }

    private static void sendStatus(HttpExchange exchange, int status, String body) throws IOException {
        byte[] payload = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, payload.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(payload);
        }
    }

    private <T> T runOnMain(java.util.concurrent.Callable<T> task) {
        Future<T> future = Bukkit.getScheduler().callSyncMethod(plugin, task);
        try {
            return future.get(authmeCallTimeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException timeout) {
            future.cancel(true);
            plugin.getLogger().warning("AuthMe call timed out after " + authmeCallTimeoutMs + "ms");
            return null;
        } catch (Exception ex) {
            plugin.getLogger().log(Level.WARNING, "AuthMe call failed", ex);
            return null;
        }
    }
}
