package org.matrixnetwork.stats;

import com.sun.net.httpserver.HttpServer;
import net.milkbowl.vault.economy.Economy;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.plugin.java.annotation.command.Command;
import org.bukkit.plugin.java.annotation.command.Commands;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion.Target;
import org.bukkit.plugin.java.annotation.plugin.Description;
import org.bukkit.plugin.java.annotation.plugin.Plugin;
import org.bukkit.plugin.java.annotation.plugin.author.Author;
import org.bukkit.scheduler.BukkitRunnable;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.matrixnetwork.stats.handler.CurrencyHandler;
import org.matrixnetwork.stats.rest.AuthResource;
import org.matrixnetwork.stats.rest.StatsResource;

import java.net.URI;

@Plugin(name = "MatrixStats", version = "1.0.0")
@Description(value = "This Plugin handles the stats system on Matrix")
@Author(value = "S1mple133")
@ApiVersion(Target.v1_13)
public class MatrixStats extends JavaPlugin{
	
	private static MatrixStats plugin;
	private HttpServer server;
	private static Economy econ = null;

	public static Economy getEcon() {
		return econ;
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

		CurrencyHandler.init();

		ResourceConfig rc = new ResourceConfig();
		rc.packages("org.matrixnetwork.stats.rest");
		rc.register(StatsResource.class);
		rc.register(AuthResource.class);
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
		server.stop( 0 );
		getLogger().info("Disabled");
	}
	
	public static org.bukkit.plugin.Plugin getPlugin() {
		return plugin;
	}
}