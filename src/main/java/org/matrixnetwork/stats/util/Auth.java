package org.matrixnetwork.stats.util;

import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.MatrixPlayer;
import org.matrixnetwork.stats.entity.Token;
import org.matrixnetwork.stats.manager.DataManager;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

public class Auth {
    private static Auth instance;
    private HashMap<String, Token> tokenList;
    private BukkitTask tokenInvalidator;

    private long INVALIDATOR_CHECK_DELAY = 20*60; // in ticks
    public long TOKEN_EXPIRATION_TIME = 10*60; // in seconds

    private Auth() {
        tokenList = new HashMap<>();

        tokenInvalidator = new BukkitRunnable() {
            @Override
            public void run() {
                LocalDateTime expiredTokensDate = LocalDateTime.now().minusSeconds(TOKEN_EXPIRATION_TIME);
                HashMap<String, Token> tlClone = (HashMap<String, Token>) tokenList.clone();

                for(String token : tlClone.keySet()) {
                    if(tokenList.get(token).getLastUsed().compareTo(expiredTokensDate) < 1) {
                        tokenList.remove(token);
                    }
                }
            }
        }.runTaskTimerAsynchronously(MatrixStats.getPlugin(), INVALIDATOR_CHECK_DELAY, INVALIDATOR_CHECK_DELAY);
    }

    public static Auth getInstance() {
        if (instance == null) {
            instance = new Auth();
        }

        return instance;
    }

    /**
     * Returns token needed for authentication
     * @param username username
     * @return token
     */
    public String generateToken(String username) {
        MatrixPlayer matrixPlayer = DataManager.getInstance().getMatrixPlayerByProperty("username", username);

        if(matrixPlayer == null)
            return null;

        String uuid = UUID.randomUUID().toString();
        tokenList.put(uuid, new Token(LocalDateTime.now(), matrixPlayer));
        return uuid;
    }

    public Token getToken(String token) {
        return tokenList.get(token);
    }




}
