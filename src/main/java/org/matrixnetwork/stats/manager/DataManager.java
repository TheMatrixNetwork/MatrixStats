package org.matrixnetwork.stats.manager;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.service.ServiceRegistry;
import org.matrixnetwork.stats.entity.MatrixPlayer;
import org.matrixnetwork.stats.entity.PlayerStats;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.Properties;
import java.util.logging.Level;

public class DataManager {
    private static DataManager instance;
    private SessionFactory sessionFactory;

    private DataManager() {
        try {
            Configuration configuration = new Configuration();

            // Hibernate settings equivalent to hibernate.cfg.xml's properties
            Properties settings = new Properties();
            settings.put(Environment.DRIVER, "com.mysql.cj.jdbc.Driver");
            settings.put(Environment.URL, "jdbc:mysql://db:3306/matrixstats?useSSL=false");
            settings.put(Environment.USER, "root");
            settings.put(Environment.PASS, "root");
            settings.put(Environment.DIALECT, "org.hibernate.dialect.MySQL5Dialect");

            settings.put(Environment.SHOW_SQL, "false");

            settings.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");
            java.util.logging.Logger.getLogger("org.hibernate").setLevel(Level.WARNING);

            settings.put(Environment.HBM2DDL_AUTO, "update");

            configuration.setProperties(settings);

            configuration.addAnnotatedClass(MatrixPlayer.class);
            configuration.addAnnotatedClass(PlayerStats.class);

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties()).build();

            sessionFactory = configuration.buildSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static DataManager getInstance() {
        if(instance == null)
            instance = new DataManager();

        return instance;
    }

    public Session getSession() {
        return sessionFactory.openSession();
    }

    public MatrixPlayer getMatrixPlayerByProperty(String propertyName, Object propertyValue) {
        try(Session session = DataManager.getInstance().getSession()) {
            CriteriaQuery<MatrixPlayer> criteria = DataManager.getInstance().getSession()
                    .getCriteriaBuilder()
                    .createQuery(MatrixPlayer.class);

            Root<MatrixPlayer> root = criteria.from(MatrixPlayer.class);

            MatrixPlayer player = session.createQuery(criteria.select(root)
                    .where(
                            session.getCriteriaBuilder()
                                    .equal(root.get(propertyName), propertyValue)
                    )).uniqueResult();

            return player;
        }
    }
}
