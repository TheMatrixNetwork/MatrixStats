package org.matrixnetwork.stats.api;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * Generates and exports a self-signed PKCS12 keystore using the JDK's
 * bundled {@code keytool} executable. We shell out instead of pulling in a
 * crypto library because keytool ships with every JDK and gives us a
 * known-good cert format the API client can trust via PEM.
 */
public final class KeystoreHelper {

    private static final String ALIAS = "matrixstats-api";

    private KeystoreHelper() {
    }

    public static void ensureKeystore(File keystoreFile, String password,
                                      String commonName, int validityDays,
                                      Logger logger) throws IOException, InterruptedException {
        if (keystoreFile.exists()) {
            return;
        }
        File parent = keystoreFile.getParentFile();
        if (parent != null && !parent.exists() && !parent.mkdirs()) {
            throw new IOException("Could not create parent directory: " + parent.getAbsolutePath());
        }

        String keytool = resolveKeytool();
        List<String> cmd = new ArrayList<>();
        cmd.add(keytool);
        cmd.add("-genkeypair");
        cmd.add("-alias"); cmd.add(ALIAS);
        cmd.add("-keyalg"); cmd.add("RSA");
        cmd.add("-keysize"); cmd.add("2048");
        cmd.add("-validity"); cmd.add(Integer.toString(validityDays));
        cmd.add("-storetype"); cmd.add("PKCS12");
        cmd.add("-keystore"); cmd.add(keystoreFile.getAbsolutePath());
        cmd.add("-storepass"); cmd.add(password);
        cmd.add("-keypass"); cmd.add(password);
        cmd.add("-dname"); cmd.add("CN=" + sanitizeDn(commonName) + ", OU=MatrixStats, O=MatrixNetwork");
        cmd.add("-ext"); cmd.add("SAN=dns:" + sanitizeDn(commonName) + ",dns:localhost,ip:127.0.0.1");

        runKeytool(cmd, logger, "generate keystore");
    }

    public static void exportCertificate(File keystoreFile, String password,
                                         File certFile, Logger logger) throws IOException, InterruptedException {
        if (certFile.exists()) {
            return;
        }
        String keytool = resolveKeytool();
        File tmp = File.createTempFile("matrixstats-cert", ".pem");
        try {
            List<String> cmd = new ArrayList<>();
            cmd.add(keytool);
            cmd.add("-exportcert");
            cmd.add("-alias"); cmd.add(ALIAS);
            cmd.add("-keystore"); cmd.add(keystoreFile.getAbsolutePath());
            cmd.add("-storepass"); cmd.add(password);
            cmd.add("-rfc");
            cmd.add("-file"); cmd.add(tmp.getAbsolutePath());

            runKeytool(cmd, logger, "export certificate");
            Files.move(tmp.toPath(), certFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } finally {
            if (tmp.exists()) {
                //noinspection ResultOfMethodCallIgnored
                tmp.delete();
            }
        }
    }

    private static String resolveKeytool() {
        String javaHome = System.getProperty("java.home");
        if (javaHome != null && !javaHome.isBlank()) {
            File candidate = new File(javaHome, isWindows() ? "bin\\keytool.exe" : "bin/keytool");
            if (candidate.canExecute()) {
                return candidate.getAbsolutePath();
            }
        }
        return isWindows() ? "keytool.exe" : "keytool";
    }

    private static boolean isWindows() {
        String os = System.getProperty("os.name", "").toLowerCase();
        return os.contains("win");
    }

    private static String sanitizeDn(String value) {
        if (value == null) return "localhost";
        return value.replaceAll("[,=+<>#;\"\\\\]", "");
    }

    private static void runKeytool(List<String> cmd, Logger logger, String action)
            throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(cmd);
        pb.redirectErrorStream(true);
        Process process = pb.start();
        byte[] output = process.getInputStream().readAllBytes();
        int exit = process.waitFor();
        if (exit != 0) {
            String text = new String(output, StandardCharsets.UTF_8);
            logger.severe("keytool failed (" + action + "):\n" + text);
            throw new IOException("keytool exited with code " + exit + " while trying to " + action);
        }
    }
}
