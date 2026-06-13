package org.matrixnetwork.stats.auth;

import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsServer;
import org.bukkit.plugin.java.JavaPlugin;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.security.KeyStore;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

public final class AuthShimServer {

    private final JavaPlugin plugin;
    private final String bindAddress;
    private final int port;
    private final java.io.File keystoreFile;
    private final String keystorePassword;
    private final String sharedSecret;
    private final long authmeCallTimeoutMs;

    private HttpsServer server;

    public AuthShimServer(JavaPlugin plugin, String bindAddress, int port,
                          java.io.File keystoreFile, String keystorePassword,
                          String sharedSecret, long authmeCallTimeoutMs) {
        this.plugin = plugin;
        this.bindAddress = bindAddress;
        this.port = port;
        this.keystoreFile = keystoreFile;
        this.keystorePassword = keystorePassword;
        this.sharedSecret = sharedSecret;
        this.authmeCallTimeoutMs = authmeCallTimeoutMs;
    }

    public void start() throws Exception {
        SSLContext sslContext = buildSslContext();

        server = HttpsServer.create(new InetSocketAddress(bindAddress, port), 0);
        server.setHttpsConfigurator(new HttpsConfigurator(sslContext));

        AuthHandler handler = new AuthHandler(plugin, sharedSecret, authmeCallTimeoutMs);
        server.createContext("/health", handler.health());
        server.createContext("/verify", handler.verify());
        server.createContext("/change-password", handler.changePassword());

        server.setExecutor(Executors.newFixedThreadPool(4, namedDaemonThreads("matrixstats-shim")));
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
