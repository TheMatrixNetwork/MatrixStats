package org.matrixnetwork.stats;

import com.sun.net.httpserver.HttpServer;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.plugin.java.annotation.command.Command;
import org.bukkit.plugin.java.annotation.command.Commands;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion.Target;
import org.bukkit.plugin.java.annotation.plugin.Description;
import org.bukkit.plugin.java.annotation.plugin.Plugin;
import org.bukkit.plugin.java.annotation.plugin.author.Author;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.matrixnetwork.stats.rest.StatsResource;

import javax.swing.*;
import java.net.URI;

@Plugin(name = "MatrixStats", version = "1.0.0")
@Description(value = "This Plugin handles the stats system on Matrix")
@Author(value = "S1mple133")
@Commands( @Command(name = "stats", desc = "Basic usage"))
@ApiVersion(Target.v1_13)
public class MatrixStats extends JavaPlugin{
	
	private static MatrixStats plugin;
	private HttpServer server;
	
	@Override
	public void onLoad() {
		// initialize the plugin
		plugin = this;
		
		getLogger().info("Loaded");
	}
	
	@Override
	public void onEnable() {
		// enable plugin
		ResourceConfig rc = new ResourceConfig();
		rc.packages("org.matrixnetwork.stats.rest");
		rc.register(StatsResource.class);
		server = JdkHttpServerFactory.createHttpServer(
				URI.create( "http://localhost:8080/api" ), rc );

		getLogger().info("Listening on http://localhost:8080/api !");
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