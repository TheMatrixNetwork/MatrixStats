package org.matrixnetwork.stats.api;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpHandler;
import net.skinsrestorer.api.SkinsRestorerAPI;
import net.skinsrestorer.api.property.IProperty;
import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.profile.PlayerProfile;
import org.bukkit.profile.PlayerTextures;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;
import java.util.logging.Level;

import static org.matrixnetwork.stats.api.ApiSupport.lastPathSegment;
import static org.matrixnetwork.stats.api.ApiSupport.sendJson;
import static org.matrixnetwork.stats.api.ApiSupport.sendStatus;

/**
 * GET /skin/{username}
 *
 * Returns the player's UUID, SkinsRestorer skin name (if any), and the
 * resolved texture URL + model so a 3D viewer (skinview3d, etc.) can
 * render it directly.
 *
 * <p>
 * Resolution order for the texture URL:
 * <ol>
 * <li>SkinsRestorer override (if installed and the player has one set)</li>
 * <li>Bukkit's cached PlayerProfile (the Mojang skin for the account)</li>
 * </ol>
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

                JsonObject body = support.runOnMain(() -> collect(username));
                if (body == null) {
                    sendStatus(exchange, 504, "{\"error\":\"skin lookup timed out\"}");
                    return;
                }
                sendJson(exchange, 200, body);
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "/skin failed", ex);
                sendStatus(exchange, 500, "{\"error\":\"internal error\"}");
            } finally {
                exchange.close();
            }
        };
    }

    private JsonObject collect(String username) {
        JsonObject body = new JsonObject();
        body.addProperty("username", username);

        OfflinePlayer offline = Bukkit.getOfflinePlayer(username);
        UUID uuid = offline.getUniqueId();
        if (uuid != null)
            body.addProperty("uuid", uuid.toString());

        String skinName = null;
        String textureUrl = null;
        String model = "default";

        // 1) SkinsRestorer override
        if (plugin.getServer().getPluginManager().getPlugin("SkinsRestorer") != null) {
            try {
                SkinsRestorerAPI api = SkinsRestorerAPI.getApi();
                if (api != null) {
                    skinName = api.getSkinName(username);
                    if (skinName != null) {
                        IProperty prop = api.getSkinData(skinName);
                        if (prop != null) {
                            String[] parsed = parseTextureProperty(prop.getValue());
                            if (parsed[0] != null)
                                textureUrl = parsed[0];
                            if (parsed[1] != null)
                                model = parsed[1];
                        }
                    }
                }
            } catch (Throwable t) {
                plugin.getLogger().log(Level.FINE, "SkinsRestorer skin data lookup failed", t);
            }
        }

        // 2) Fall back to Bukkit's cached profile (Mojang account skin)
        if (textureUrl == null) {
            try {
                PlayerProfile profile = offline.getPlayerProfile();
                if (profile != null) {
                    PlayerTextures textures = profile.getTextures();
                    URL url = textures == null ? null : textures.getSkin();
                    if (url != null)
                        textureUrl = url.toString();
                    if (textures != null && textures.getSkinModel() == PlayerTextures.SkinModel.SLIM) {
                        model = "slim";
                    }
                }
            } catch (Throwable t) {
                plugin.getLogger().log(Level.FINE, "Bukkit profile texture lookup failed", t);
            }
        }

        if (skinName == null)
            body.add("skin", null);
        else
            body.addProperty("skin", skinName);
        if (textureUrl == null)
            body.add("textureUrl", null);
        else
            body.addProperty("textureUrl", textureUrl);
        body.addProperty("model", model);
        body.addProperty("available", textureUrl != null);
        return body;
    }

    /**
     * Decodes a Mojang/SR texture property (base64-encoded JSON) into a
     * {@code [url, model]} pair. Returns nulls on any parse failure.
     */
    private static String[] parseTextureProperty(String base64Value) {
        try {
            String decoded = new String(Base64.getDecoder().decode(base64Value), StandardCharsets.UTF_8);
            JsonObject root = JsonParser.parseString(decoded).getAsJsonObject();
            JsonObject textures = root.getAsJsonObject("textures");
            JsonObject skin = textures == null ? null : textures.getAsJsonObject("SKIN");
            if (skin == null)
                return new String[] { null, null };
            String url = skin.has("url") ? skin.get("url").getAsString() : null;
            String model = "default";
            JsonObject metadata = skin.has("metadata") ? skin.getAsJsonObject("metadata") : null;
            if (metadata != null && metadata.has("model")
                    && "slim".equalsIgnoreCase(metadata.get("model").getAsString())) {
                model = "slim";
            }
            return new String[] { url, model };
        } catch (Throwable t) {
            return new String[] { null, null };
        }
    }
}
