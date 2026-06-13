package org.matrixnetwork.stats.api;

import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsServer;
import org.bukkit.plugin.java.JavaPlugin;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.security.KeyStore;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Owns the HTTPS server and routes requests to the AuthMe, Skin, and Stats
 * handlers. Every endpoint requires the {@code X-Matrix-Api-Secret} header.
 */
public final class ApiServer {

    private final JavaPlugin plugin;
    private final String bindAddress;
    private final int port;
    private final File keystoreFile;
    private final String keystorePassword;
    private final ApiSupport support;

    private HttpsServer server;

    public ApiServer(JavaPlugin plugin, String bindAddress, int port,
            File keystoreFile, String keystorePassword,
            String sharedSecret, long mainThreadTimeoutMs) {
        this.plugin = plugin;
        this.bindAddress = bindAddress;
        this.port = port;
        this.keystoreFile = keystoreFile;
        this.keystorePassword = keystorePassword;
        this.support = new ApiSupport(plugin, sharedSecret, mainThreadTimeoutMs);
    }

    public void start() throws Exception {
        SSLContext sslContext = buildSslContext();

        server = HttpsServer.create(new InetSocketAddress(bindAddress, port), 0);
        server.setHttpsConfigurator(new HttpsConfigurator(sslContext));

        AuthHandler authHandler = new AuthHandler(plugin, support);
        SkinHandler skinHandler = new SkinHandler(plugin, support);
        StatsHandler statsHandler = new StatsHandler(plugin, support);

        server.createContext("/health", authHandler.health());
        server.createContext("/verify", authHandler.verify());
        server.createContext("/change-password", authHandler.changePassword());
        server.createContext("/skin/", skinHandler.skin());
        server.createContext("/stats/", statsHandler.stats());

        server.setExecutor(Executors.newFixedThreadPool(4, namedDaemonThreads("matrixstats-api")));
        server.start();
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
            server = null;
        }
    }

    private SSLContext buildSslContext() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        try (FileInputStream in = new FileInputStream(keystoreFile)) {
            keyStore.load(in, keystorePassword.toCharArray());
        } catch (IOException ex) {
            throw new IOException("Could not load keystore " + keystoreFile.getAbsolutePath()
                    + " (wrong password? regenerate with /matrixstats regen-cert)", ex);
        }
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        kmf.init(keyStore, keystorePassword.toCharArray());

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(kmf.getKeyManagers(), null, null);
        return sslContext;
    }

    private static ThreadFactory namedDaemonThreads(String prefix) {
        AtomicInteger counter = new AtomicInteger();
        return runnable -> {
            Thread thread = new Thread(runnable, prefix + "-" + counter.incrementAndGet());
            thread.setDaemon(true);
            return thread;
        };
    }
}
