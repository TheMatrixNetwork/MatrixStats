package org.matrixnetwork.stats.handler;

import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.CurrencyData;
import org.matrixnetwork.stats.entity.MatrixPlayer;
import org.matrixnetwork.stats.manager.DataManager;

import java.time.LocalDateTime;

public class CurrencyHandler {
    private BukkitTask runnable;

    private static CurrencyHandler instance;

    private CurrencyHandler() {
    }

    public static CurrencyHandler getInstance() {
        if(instance == null)
            init();

        return instance;
    }

    public static void init() {
        instance = new CurrencyHandler();

        instance.runnable = new BukkitRunnable() {
            @Override
            public void run() {
                try (Session session = DataManager.getInstance().getSession()) {
                    Transaction t = session.beginTransaction();

                    for(Player p : MatrixStats.getPlugin().getServer().getOnlinePlayers()) {
                        MatrixPlayer player = session.find(MatrixPlayer.class, p.getUniqueId());
                        double balance = MatrixStats.getEcon().getBalance(p);
                        if(player.getTransactions().get(player.getTransactions().size()-1).getAmount() != balance) {
                            CurrencyData data = new CurrencyData(balance, LocalDateTime.now(), player);
                            session.merge(data);
                        }
                    }

                    t.commit();

                }
            }
        }.runTaskTimer(MatrixStats.getPlugin(), 20*60*60, 20*60*60);
    }
}
