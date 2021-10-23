package org.matrixnetwork.stats.handler;

import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.CurrencyData;
import org.matrixnetwork.stats.entity.MatrixPlayer;
import org.matrixnetwork.stats.manager.DataManager;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
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
                        MatrixPlayer player = DataManager.getInstance().getMatrixPlayerByProperty("uuid", p.getUniqueId().toString());

                        if(player == null) {
                            Session s = DataManager.getInstance().getSession();
                            Transaction tra = s.beginTransaction();

                            player = (MatrixPlayer) s.merge(new MatrixPlayer(p.getUniqueId().toString(), p.getName()));
                            tra.commit();
                        }

                        double balance = MatrixStats.getEcon().getBalance(p);
                        if(player.getTransactions() == null|| player.getTransactions().size() == 0 || player.getTransactions().get(player.getTransactions().size()-1).getAmount() != balance) {
                            CurrencyData data = new CurrencyData(balance, LocalDateTime.now(), player);
                            session.merge(data);
                        }
                    }

                    t.commit();

                }
            }
        }.runTaskTimer(MatrixStats.getPlugin(), 20*60, 20*60);
    }
}
