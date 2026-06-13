package org.matrixnetwork.stats;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;
import org.matrixnetwork.stats.api.ApiServer;
import org.matrixnetwork.stats.api.KeystoreHelper;
import org.matrixnetwork.stats.api.SecretHelper;

import java.io.File;
import java.io.IOException;
import java.util.logging.Level;

public class MatrixStats extends JavaPlugin {

    private ApiServer apiServer;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        if (getServer().getPluginManager().getPlugin("AuthMe") == null) {
            getLogger().severe("AuthMe plugin not found. MatrixStats requires AuthMe to be installed.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }

        try {
            startApi();
        } catch (Exception ex) {
            getLogger().log(Level.SEVERE, "Failed to start MatrixStats API, disabling plugin", ex);
            getServer().getPluginManager().disablePlugin(this);
        }
    }

    @Override
    public void onDisable() {
        if (apiServer != null) {
            apiServer.stop();
            apiServer = null;
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
                restartApi(sender);
                return true;
            case "regen-secret":
                getConfig().set("api.shared-secret", "");
                saveConfig();
                restartApi(sender);
                sender.sendMessage("§aShared secret regenerated. Check console for the new value.");
                return true;
            case "regen-cert":
                File dataFolder = getDataFolder();
                FileConfiguration cfg = getConfig();
                File ks = new File(dataFolder, cfg.getString("api.keystore-file", "api-keystore.p12"));
                File cert = new File(dataFolder, cfg.getString("api.cert-export-file", "api-cert.pem"));
                if (ks.exists() && !ks.delete()) {
                    sender.sendMessage("§cCould not delete keystore: " + ks.getAbsolutePath());
                    return true;
                }
                if (cert.exists() && !cert.delete()) {
                    sender.sendMessage("§cCould not delete cert: " + cert.getAbsolutePath());
                    return true;
                }
                cfg.set("api.keystore-password", "");
                saveConfig();
                restartApi(sender);
                sender.sendMessage("§aCertificate regenerated.");
                return true;
            default:
                sender.sendMessage("§eUsage: /matrixstats reload | regen-secret | regen-cert");
                return true;
        }
    }

    private void restartApi(CommandSender sender) {
        if (apiServer != null) {
            apiServer.stop();
            apiServer = null;
        }
        try {
            startApi();
            sender.sendMessage("§aMatrixStats API restarted.");
        } catch (Exception ex) {
            getLogger().log(Level.SEVERE, "Failed to restart MatrixStats API", ex);
            sender.sendMessage("§cMatrixStats API failed to restart: " + ex.getMessage());
        }
    }

    private void startApi() throws IOException, GeneralExceptionWrapper {
        FileConfiguration cfg = getConfig();
        if (!cfg.getBoolean("api.enabled", true)) {
            getLogger().info("API disabled by config (api.enabled=false). Skipping.");
            return;
        }

        File dataFolder = getDataFolder();
        if (!dataFolder.exists() && !dataFolder.mkdirs()) {
            throw new IOException("Could not create data folder: " + dataFolder.getAbsolutePath());
        }

        String secret = cfg.getString("api.shared-secret", "");
        if (secret == null || secret.isBlank()) {
            secret = SecretHelper.generate(48);
            cfg.set("api.shared-secret", secret);
            saveConfig();
            getLogger().info("Generated new shared secret for MatrixStats API (saved to config.yml).");
        }

        String ksPassword = cfg.getString("api.keystore-password", "");
        if (ksPassword == null || ksPassword.isBlank()) {
            ksPassword = SecretHelper.generate(32);
            cfg.set("api.keystore-password", ksPassword);
            saveConfig();
        }

        File keystoreFile = new File(dataFolder, cfg.getString("api.keystore-file", "api-keystore.p12"));
        File certFile = new File(dataFolder, cfg.getString("api.cert-export-file", "api-cert.pem"));
        String commonName = cfg.getString("api.cert-common-name", "localhost");
        int validityDays = cfg.getInt("api.cert-validity-days", 3650);

        try {
            KeystoreHelper.ensureKeystore(keystoreFile, ksPassword, commonName, validityDays, getLogger());
            KeystoreHelper.exportCertificate(keystoreFile, ksPassword, certFile, getLogger());
        } catch (Exception ex) {
            throw new GeneralExceptionWrapper("Failed to prepare TLS keystore: " + ex.getMessage(), ex);
        }

        String bindAddress = cfg.getString("api.bind-address", "127.0.0.1");
        int port = cfg.getInt("api.port", 8081);
        long timeoutMs = cfg.getLong("api.main-thread-timeout-ms", 5000L);

        try {
            apiServer = new ApiServer(this, bindAddress, port, keystoreFile, ksPassword, secret, timeoutMs);
            apiServer.start();
        } catch (Exception ex) {
            throw new GeneralExceptionWrapper("Failed to start HTTPS server: " + ex.getMessage(), ex);
        }

        getLogger().info("MatrixStats API listening on https://" + bindAddress + ":" + port + "/");
        getLogger().info(
                "Endpoints: GET /health, POST /verify, POST /change-password, GET /skin/{name}, GET /stats/{name}");
        getLogger().info(
                "Clients should send the api shared secret in the X-Matrix-Api-Secret header and trust the cert at: "
                        + certFile.getAbsolutePath());
    }

    public static class GeneralExceptionWrapper extends RuntimeException {
        public GeneralExceptionWrapper(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
