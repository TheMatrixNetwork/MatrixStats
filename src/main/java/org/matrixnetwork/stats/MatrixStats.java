package org.matrixnetwork.stats;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;
import org.matrixnetwork.stats.auth.AuthShimServer;
import org.matrixnetwork.stats.auth.KeystoreHelper;
import org.matrixnetwork.stats.auth.SecretHelper;

import java.io.File;
import java.io.IOException;
import java.util.logging.Level;

public class MatrixStats extends JavaPlugin {

    private AuthShimServer authShimServer;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        if (getServer().getPluginManager().getPlugin("AuthMe") == null) {
            getLogger().severe("AuthMe plugin not found. MatrixStats requires AuthMe to be installed.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }

        try {
            startAuthShim();
        } catch (Exception ex) {
            getLogger().log(Level.SEVERE, "Failed to start auth shim, disabling plugin", ex);
            getServer().getPluginManager().disablePlugin(this);
        }
    }

    @Override
    public void onDisable() {
        if (authShimServer != null) {
            authShimServer.stop();
            authShimServer = null;
        }
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!command.getName().equalsIgnoreCase("matrixstats")) {
            return false;
        }
        if (!sender.hasPermission("matrixstats.admin")) {
            sender.sendMessage("§cNo permission.");
            return true;
        }
        if (args.length == 0) {
            sender.sendMessage("§eUsage: /matrixstats reload | regen-secret | regen-cert");
            return true;
        }
        switch (args[0].toLowerCase()) {
            case "reload":
                reloadConfig();
                restartAuthShim(sender);
                return true;
            case "regen-secret":
                getConfig().set("auth-shim.shared-secret", "");
                saveConfig();
                restartAuthShim(sender);
                sender.sendMessage("§aShared secret regenerated. Check console for the new value.");
                return true;
            case "regen-cert":
                File dataFolder = getDataFolder();
                FileConfiguration cfg = getConfig();
                File ks = new File(dataFolder, cfg.getString("auth-shim.keystore-file", "auth-shim-keystore.p12"));
                File cert = new File(dataFolder, cfg.getString("auth-shim.cert-export-file", "auth-shim-cert.pem"));
                if (ks.exists() && !ks.delete()) {
                    sender.sendMessage("§cCould not delete keystore: " + ks.getAbsolutePath());
                    return true;
                }
                if (cert.exists() && !cert.delete()) {
                    sender.sendMessage("§cCould not delete cert: " + cert.getAbsolutePath());
                    return true;
                }
                cfg.set("auth-shim.keystore-password", "");
                saveConfig();
                restartAuthShim(sender);
                sender.sendMessage("§aCertificate regenerated.");
                return true;
            default:
                sender.sendMessage("§eUsage: /matrixstats reload | regen-secret | regen-cert");
                return true;
        }
    }

    private void restartAuthShim(CommandSender sender) {
        if (authShimServer != null) {
            authShimServer.stop();
            authShimServer = null;
        }
        try {
            startAuthShim();
            sender.sendMessage("§aAuth shim restarted.");
        } catch (Exception ex) {
            getLogger().log(Level.SEVERE, "Failed to restart auth shim", ex);
            sender.sendMessage("§cAuth shim failed to restart: " + ex.getMessage());
        }
    }

    private void startAuthShim() throws IOException, GeneralExceptionWrapper {
        FileConfiguration cfg = getConfig();
        if (!cfg.getBoolean("auth-shim.enabled", true)) {
            getLogger().info("Auth shim disabled by config (auth-shim.enabled=false). Skipping.");
            return;
        }

        File dataFolder = getDataFolder();
        if (!dataFolder.exists() && !dataFolder.mkdirs()) {
            throw new IOException("Could not create data folder: " + dataFolder.getAbsolutePath());
        }

        String secret = cfg.getString("auth-shim.shared-secret", "");
        if (secret == null || secret.isBlank()) {
            secret = SecretHelper.generate(48);
            cfg.set("auth-shim.shared-secret", secret);
            saveConfig();
            getLogger().info("Generated new shared secret for auth shim (saved to config.yml).");
        }

        String ksPassword = cfg.getString("auth-shim.keystore-password", "");
        if (ksPassword == null || ksPassword.isBlank()) {
            ksPassword = SecretHelper.generate(32);
            cfg.set("auth-shim.keystore-password", ksPassword);
            saveConfig();
        }

        File keystoreFile = new File(dataFolder, cfg.getString("auth-shim.keystore-file", "auth-shim-keystore.p12"));
        File certFile = new File(dataFolder, cfg.getString("auth-shim.cert-export-file", "auth-shim-cert.pem"));
        String commonName = cfg.getString("auth-shim.cert-common-name", "localhost");
        int validityDays = cfg.getInt("auth-shim.cert-validity-days", 3650);

        try {
            KeystoreHelper.ensureKeystore(keystoreFile, ksPassword, commonName, validityDays, getLogger());
            KeystoreHelper.exportCertificate(keystoreFile, ksPassword, certFile, getLogger());
        } catch (Exception ex) {
            throw new GeneralExceptionWrapper("Failed to prepare TLS keystore: " + ex.getMessage(), ex);
        }

        String bindAddress = cfg.getString("auth-shim.bind-address", "127.0.0.1");
        int port = cfg.getInt("auth-shim.port", 8081);
        long timeoutMs = cfg.getLong("auth-shim.authme-call-timeout-ms", 5000L);

        try {
            authShimServer = new AuthShimServer(this, bindAddress, port, keystoreFile, ksPassword, secret, timeoutMs);
            authShimServer.start();
        } catch (Exception ex) {
            throw new GeneralExceptionWrapper("Failed to start HTTPS server: " + ex.getMessage(), ex);
        }

        getLogger().info("Auth shim listening on https://" + bindAddress + ":" + port + "/");
        getLogger().info("Node backend should set AUTHME_SHIM_CA_PATH to: " + certFile.getAbsolutePath());
    }

    public static class GeneralExceptionWrapper extends RuntimeException {
        public GeneralExceptionWrapper(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
