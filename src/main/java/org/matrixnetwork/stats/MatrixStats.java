package org.matrixnetwork.stats;

import com.sun.net.httpserver.HttpServer;
import net.milkbowl.vault.economy.Economy;
import net.skinsrestorer.api.SkinsRestorerAPI;
import net.skinsrestorer.bukkit.SkinsRestorer;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.plugin.java.annotation.dependency.Dependency;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion.Target;
import org.bukkit.plugin.java.annotation.plugin.Description;
import org.bukkit.plugin.java.annotation.plugin.Plugin;
import org.bukkit.plugin.java.annotation.plugin.author.Author;
import org.bukkit.scheduler.BukkitRunnable;
import org.bukkit.scheduler.BukkitTask;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.matrixnetwork.stats.handler.StatsHandler;
import org.matrixnetwork.stats.rest.AuthResource;
import org.matrixnetwork.stats.rest.SkinResource;
import org.matrixnetwork.stats.rest.StatsResource;
import org.matrixnetwork.stats.rest.filter.CorsFilter;

import java.net.URI;

@Plugin(name = "MatrixStats", version = "1.0.0")
@Description(value = "This Plugin handles the stats system on Matrix")
@Author(value = "S1mple133")
@ApiVersion(Target.v1_13)
@Dependency(value = "SkinsRestorer")
@Dependency(value = "Vault")
public class MatrixStats extends JavaPlugin{
	
	private static MatrixStats plugin;
	private static SkinsRestorerAPI skinsRestorerAPI;
	private HttpServer server;
	private static Economy econ;

	public static Economy getEcon() {
		return econ;
	}

	public static SkinsRestorerAPI getSkinsRestorerAPI() {
		return skinsRestorerAPI;
	}

	@Override
	public void onLoad() {
		plugin = this;
	}
	
	@Override
	public void onEnable() {
		if (!setupEconomy() ) {
			getLogger().severe(String.format("[%s] - Disabled due to no Vault dependency found!", getDescription().getName()));
			getServer().getPluginManager().disablePlugin(this);
			return;
		}

		BukkitTask r = new BukkitRunnable() {
			@Override
			public void run() {
				skinsRestorerAPI = ((SkinsRestorer) getServer().getPluginManager().getPlugin("SkinsRestorer")).getSkinsRestorerAPI();
			}
		}.runTask(this);

		StatsHandler.init();

		ResourceConfig rc = new ResourceConfig();
		rc.packages("org.matrixnetwork.stats.rest");
		rc.register(StatsResource.class);
		rc.register(SkinResource.class);
		rc.register(AuthResource.class);
		rc.register(CorsFilter.class);
		server = JdkHttpServerFactory.createHttpServer(
				URI.create( "http://localhost:8080/api" ), rc );

		getLogger().info("Listening on http://localhost:8080/api !");
	}

	private boolean setupEconomy() {
		if (getServer().getPluginManager().getPlugin("Vault") == null) {
			return false;
		}
		RegisteredServiceProvider<Economy> rsp = getServer().getServicesManager().getRegistration(Economy.class);
		if (rsp == null) {
			return false;
		}
		econ = rsp.getProvider();
		return econ != null;
	}

	@Override
	public void onDisable() {
		if(server != null)
			server.stop( 0 );
		getLogger().info("Disabled");
	}
	
	public static org.bukkit.plugin.Plugin getPlugin() {
		return plugin;
	}
}