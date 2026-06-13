package org.matrixnetwork.stats.api;

import com.gmail.nossr50.api.ExperienceAPI;
import com.gmail.nossr50.datatypes.skills.PrimarySkillType;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpHandler;
import io.github.thebusybiscuit.slimefun4.api.player.PlayerProfile;
import io.github.thebusybiscuit.slimefun4.implementation.Slimefun;
import net.milkbowl.vault.economy.Economy;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.entity.Player;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.List;
import java.util.logging.Level;

import static org.matrixnetwork.stats.api.ApiSupport.lastPathSegment;
import static org.matrixnetwork.stats.api.ApiSupport.sendJson;
import static org.matrixnetwork.stats.api.ApiSupport.sendStatus;

/**
 * GET /stats/{username}
 *
 * Live snapshot of the player's vanilla stats plus optional cross-plugin
 * data. Player must be online; returns 404 otherwise. Each cross-plugin
 * field is wrapped so a missing or incompatible plugin only nulls out
 * that one field instead of failing the whole response.
 */
public final class StatsHandler {

    private final JavaPlugin plugin;
    private final ApiSupport support;

    private volatile Economy economy;
    private volatile boolean economyLookupTried;

    public StatsHandler(JavaPlugin plugin, ApiSupport support) {
        this.plugin = plugin;
        this.support = support;
    }

    public HttpHandler stats() {
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
                    sendStatus(exchange, 504, "{\"error\":\"stats lookup timed out\"}");
                    return;
                }
                if (!body.has("online") || !body.get("online").getAsBoolean()) {
                    sendStatus(exchange, 404, body.toString());
                    return;
                }
                sendJson(exchange, 200, body);
            } catch (Exception ex) {
                plugin.getLogger().log(Level.WARNING, "/stats failed", ex);
                sendStatus(exchange, 500, "{\"error\":\"internal error\"}");
            } finally {
                exchange.close();
            }
        };
    }

    private JsonObject collect(String username) {
        JsonObject root = new JsonObject();
        Player player = Bukkit.getPlayerExact(username);
        if (player == null) {
            root.addProperty("username", username);
            root.addProperty("online", false);
            return root;
        }
        root.addProperty("username", player.getName());
        root.addProperty("uuid", player.getUniqueId().toString());
        root.addProperty("online", true);

        // ---------- vanilla ----------
        JsonObject vanilla = new JsonObject();
        vanilla.addProperty("exp", player.getExp());
        vanilla.addProperty("expLevel", player.getLevel());
        vanilla.addProperty("foodLevel", player.getFoodLevel());
        vanilla.addProperty("health", player.getHealth());
        vanilla.addProperty("maxHealth", player.getMaxHealth());
        vanilla.addProperty("remainingAir", player.getRemainingAir());
        vanilla.addProperty("gameMode", player.getGameMode().name());
        vanilla.addProperty("lastDamageCause",
                player.getLastDamageCause() == null ? null
                        : player.getLastDamageCause().getCause().name());

        Location loc = player.getLocation();
        JsonObject location = new JsonObject();
        location.addProperty("world", loc.getWorld() == null ? null : loc.getWorld().getName());
        location.addProperty("x", loc.getX());
        location.addProperty("y", loc.getY());
        location.addProperty("z", loc.getZ());
        location.addProperty("yaw", loc.getYaw());
        location.addProperty("pitch", loc.getPitch());
        vanilla.add("location", location);
        root.add("vanilla", vanilla);

        // ---------- vault balance ----------
        root.add("vault", collectVault(player));

        // ---------- slimefun ----------
        root.add("slimefun", collectSlimefun(player));

        // ---------- mcmmo ----------
        root.add("mcmmo", collectMcmmo(player));

        // ---------- projectkorra (TODO: re-enable once we have a stable ProjectKorra Maven artifact) ----------
        // root.add("projectkorra", collectProjectKorra(player));

        return root;
    }

    private JsonObject collectVault(Player player) {
        JsonObject out = new JsonObject();
        try {
            if (plugin.getServer().getPluginManager().getPlugin("Vault") == null) {
                out.addProperty("available", false);
                return out;
            }
            Economy econ = getEconomy();
            if (econ == null) {
                out.addProperty("available", false);
                return out;
            }
            out.addProperty("available", true);
            out.addProperty("balance", econ.getBalance(player));
            out.addProperty("currency", econ.currencyNamePlural());
        } catch (Throwable t) {
            plugin.getLogger().log(Level.FINE, "Vault collect failed", t);
            out.addProperty("available", false);
        }
        return out;
    }

    private JsonObject collectSlimefun(Player player) {
        JsonObject out = new JsonObject();
        try {
            if (plugin.getServer().getPluginManager().getPlugin("Slimefun") == null) {
                out.addProperty("available", false);
                return out;
            }
            PlayerProfile profile = Slimefun.getRegistry().getPlayerProfiles().get(player.getUniqueId());
            if (profile == null) {
                out.addProperty("available", true);
                out.addProperty("researchesUnlocked", 0);
                return out;
            }
            int unlocked = profile.getResearches().size();
            int total = Slimefun.getRegistry().getResearches().size();
            out.addProperty("available", true);
            out.addProperty("researchesUnlocked", unlocked);
            out.addProperty("researchesTotal", total);

            List<String> titles = Slimefun.getRegistry().getResearchRanks();
            if (total > 0 && titles != null && !titles.isEmpty()) {
                float fraction = (float) unlocked / total;
                int rankIndex = (int) (fraction * (titles.size() - 1));
                out.addProperty("rankIndex", rankIndex);
                out.addProperty("rankTitle", titles.get(rankIndex));
            }
        } catch (Throwable t) {
            plugin.getLogger().log(Level.FINE, "Slimefun collect failed", t);
            out.addProperty("available", false);
        }
        return out;
    }

    private JsonObject collectMcmmo(Player player) {
        JsonObject out = new JsonObject();
        try {
            if (plugin.getServer().getPluginManager().getPlugin("mcMMO") == null) {
                out.addProperty("available", false);
                return out;
            }
            JsonObject skills = new JsonObject();
            int powerLevel = 0;
            for (PrimarySkillType skill : PrimarySkillType.values()) {
                try {
                    int level = ExperienceAPI.getLevel(player, skill.name());
                    skills.addProperty(skill.name(), level);
                    powerLevel += level;
                } catch (Throwable ignored) {
                    // some custom skills may not be enabled; skip silently
                }
            }
            out.addProperty("available", true);
            out.addProperty("powerLevel", powerLevel);
            out.add("skills", skills);
        } catch (Throwable t) {
            plugin.getLogger().log(Level.FINE, "mcMMO collect failed", t);
            out.addProperty("available", false);
        }
        return out;
    }

    // TODO: re-enable ProjectKorra integration when a stable Maven artifact is
    // available (repo.projectkorra.com was unreachable at last check). Add
    // com.projectkorra:projectkorra as a provided dep and uncomment below.
    // private JsonObject collectProjectKorra(Player player) {
    //     JsonObject out = new JsonObject();
    //     try {
    //         if (plugin.getServer().getPluginManager().getPlugin("ProjectKorra") == null) {
    //             out.addProperty("available", false);
    //             return out;
    //         }
    //         BendingPlayer bender = BendingPlayer.getBendingPlayer(player);
    //         JsonArray elements = new JsonArray();
    //         if (bender != null && bender.getElements() != null) {
    //             for (Element element : bender.getElements()) {
    //                 if (element != null) elements.add(element.getName());
    //             }
    //         }
    //         out.addProperty("available", true);
    //         out.add("elements", elements);
    //         if (bender != null) {
    //             out.addProperty("chiBlocked", bender.isChiBlocked());
    //         }
    //     } catch (Throwable t) {
    //         plugin.getLogger().log(Level.FINE, "ProjectKorra collect failed", t);
    //         out.addProperty("available", false);
    //     }
    //     return out;
    // }

    private Economy getEconomy() {
        if (economyLookupTried) return economy;
        synchronized (this) {
            if (economyLookupTried) return economy;
            RegisteredServiceProvider<Economy> rsp = plugin.getServer()
                    .getServicesManager()
                    .getRegistration(Economy.class);
            economy = rsp == null ? null : rsp.getProvider();
            economyLookupTried = true;
            return economy;
        }
    }
}
