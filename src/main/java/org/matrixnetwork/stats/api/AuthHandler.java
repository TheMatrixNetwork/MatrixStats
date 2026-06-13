package org.matrixnetwork.stats.api;

import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpHandler;
import fr.xephi.authme.api.v3.AuthMeApi;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.logging.Level;

import static org.matrixnetwork.stats.api.ApiSupport.optString;
import static org.matrixnetwork.stats.api.ApiSupport.readJsonBody;
import static org.matrixnetwork.stats.api.ApiSupport.sendStatus;

/**
 * AuthMe-backed handlers. AuthMe API calls are dispatched onto the Bukkit
 * main thread because the API is not thread-safe.
 */
public final class AuthHandler {

    private final JavaPlugin plugin;
    private final ApiSupport support;

    public AuthHandler(JavaPlugin plugin, ApiSupport support) {
        this.plugin = plugin;
        this.support = support;
    }

    public HttpHandler health() {
        return exchange -> {
            try {
                if (!support.requireMethod(exchange, "GET"))
                    return;
                if (!support.checkSecret(exchange))
                    return;
                sendStatus(exchange, 200, "{\"ok\":true}");
            } finally {
                exchange.close();
            }
        };
    }

    public HttpHandler verify() {
        return exchange -> {
            try {
                if (!support.requireMethod(exchange, "POST"))
                    return;
                if (!support.checkSecret(exchange))
                    return;

                JsonObject body = readJsonBody(exchange);
                String username = optString(body, "username");
                String password = optString(body, "password");
                if (username == null || username.isBlank() || password == null) {
                    sendStatus(exchange, 400, "{\"error\":\"username and password are required\"}");
                    return;
                }

                Boolean ok = support.runOnMain(() -> {
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
                if (!support.requireMethod(exchange, "POST"))
                    return;
                if (!support.checkSecret(exchange))
                    return;

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

                String result = support.runOnMain(() -> {
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
}
