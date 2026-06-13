package org.matrixnetwork.stats.auth;

import java.security.SecureRandom;
import java.util.Base64;

public final class SecretHelper {

    private static final SecureRandom RANDOM = new SecureRandom();

    private SecretHelper() {
    }

    public static String generate(int bytes) {
        byte[] buf = new byte[bytes];
        RANDOM.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }
}
