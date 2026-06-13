package org.matrixnetwork.stats.api;

import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpHandler;
import net.skinsrestorer.api.SkinsRestorerAPI;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.logging.Level;

import static org.matrixnetwork.stats.api.ApiSupport.lastPathSegment;
import static org.matrixnetwork.stats.api.ApiSupport.sendJson;
import static org.matrixnetwork.stats.api.ApiSupport.sendStatus;

/**
 * GET /skin/{username}
 *
 * Returns the SkinsRestorer skin name (custom skin) for the given player,
 * or {@code null} if no custom skin is set / SkinsRestorer is not installed.
 */
public final class SkinHandler {

    private final JavaPlugin plugin;
    private final ApiSupport support;

    public SkinHandler(JavaPlugin plugin, ApiSupport support) {
        this.plugin = plugin;
        this.support = support;
    }

    public HttpHandler skin() {
        return exchange -> {
            try {
                if (!support.requireMethod(exchange, "GET")) return;
                if (!support.checkSecret(exchange)) return;

                String username = lastPathSegment(exchange);
                if (username.isBlank()) {
                    sendStatus(exchange, 400, "{\"error\":\"username required\"}");
                    return;
                }

                JsonObject body = new JsonObject();
                body.addProperty("username", username);

                if (plugin.getServer().getPluginManager().getPlugin("SkinsRestorer") == null) {
                    body.add("skin", null);
                    body.addProperty("available", false);
                    sendJson(exchange, 200, body);
                    return;
                }

                String skinName = support.runOnMain(() -> {
                    try {
                        SkinsRestorerAPI api = SkinsRestorerAPI.getApi();
                        return api == null ? null : api.getSkinName(username);
                    } catch (Throwable t) {
                        plugin.getLogger().log(Level.WARNING, "SkinsRestorer lookup failed", t);
                        return null;
                    }
                });

                if (skinName == null) {
                    body.add("skin", null);
                } else {
                    body.addProperty("skin", skinName);
                }
                body.addProperty("available", true);
                sendJson(exchange, 200, body);
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "/skin failed", ex);
                sendStatus(exchange, 500, "{\"error\":\"internal error\"}");
            } finally {
                exchange.close();
            }
        };
    }
}
