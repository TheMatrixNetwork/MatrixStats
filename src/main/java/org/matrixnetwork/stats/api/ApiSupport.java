package org.matrixnetwork.stats.api;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;

/**
 * Shared helpers for the HTTP handlers: shared-secret check, JSON I/O,
 * and running cross-plugin calls on the Bukkit main thread.
 */
public final class ApiSupport {

    public static final String SECRET_HEADER = "X-Matrix-Api-Secret";

    private final JavaPlugin plugin;
    private final String sharedSecret;
    private final long mainThreadTimeoutMs;

    public ApiSupport(JavaPlugin plugin, String sharedSecret, long mainThreadTimeoutMs) {
        this.plugin = plugin;
        this.sharedSecret = sharedSecret;
        this.mainThreadTimeoutMs = mainThreadTimeoutMs;
    }

    public boolean checkSecret(HttpExchange exchange) throws IOException {
        String header = exchange.getRequestHeaders().getFirst(SECRET_HEADER);
        if (header == null || !constantTimeEquals(header, sharedSecret)) {
            sendStatus(exchange, 401, "{\"error\":\"unauthorized\"}");
            return false;
        }
        return true;
    }

    public boolean requireMethod(HttpExchange exchange, String method) throws IOException {
        if (!exchange.getRequestMethod().equalsIgnoreCase(method)) {
            sendStatus(exchange, 405, "{\"error\":\"method not allowed\"}");
            return false;
        }
        return true;
    }

    public static JsonObject readJsonBody(HttpExchange exchange) throws IOException {
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

    public static String optString(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) return null;
        return obj.get(key).getAsString();
    }

    public static void sendStatus(HttpExchange exchange, int status, String body) throws IOException {
        byte[] payload = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, payload.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(payload);
        }
    }

    public static void sendJson(HttpExchange exchange, int status, JsonObject obj) throws IOException {
        sendStatus(exchange, status, obj.toString());
    }

    /** Last path segment of the request URI, URL-decoded. */
    public static String lastPathSegment(HttpExchange exchange) {
        String path = exchange.getRequestURI().getPath();
        int slash = path.lastIndexOf('/');
        if (slash < 0 || slash == path.length() - 1) return "";
        return java.net.URLDecoder.decode(path.substring(slash + 1), StandardCharsets.UTF_8);
    }

    /**
     * Dispatch a task to the Bukkit main thread and wait for the result,
     * subject to {@link #mainThreadTimeoutMs}. Returns null on timeout/error.
     */
    public <T> T runOnMain(Callable<T> task) {
        Future<T> future = Bukkit.getScheduler().callSyncMethod(plugin, task);
        try {
            return future.get(mainThreadTimeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException timeout) {
            future.cancel(true);
            plugin.getLogger().warning("Main-thread task timed out after " + mainThreadTimeoutMs + "ms");
            return null;
        } catch (Exception ex) {
            plugin.getLogger().log(Level.WARNING, "Main-thread task failed", ex);
            return null;
        }
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
}
