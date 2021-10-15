package org.matrixnetwork.stats;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.plugin.java.annotation.command.Command;
import org.bukkit.plugin.java.annotation.command.Commands;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion;
import org.bukkit.plugin.java.annotation.plugin.ApiVersion.Target;
import org.bukkit.plugin.java.annotation.plugin.Description;
import org.bukkit.plugin.java.annotation.plugin.Plugin;
import org.bukkit.plugin.java.annotation.plugin.author.Author;

@Plugin(name = "MatrixStats", version = "1.0.0")
@Description(value = "This Plugin handles the stats system on Matrix")
@Author(value = "S1mple133")
@Commands( @Command(name = "stats", desc = "Basic usage"))
@ApiVersion(Target.v1_13)
public class MatrixStats extends JavaPlugin{
	
	private static MatrixStats plugin;
	
	@Override
	public void onLoad() {
		// initialize the plugin
		plugin = this;
		
		getLogger().info("Loaded");
	}
	
	@Override
	public void onEnable() {
		// enable plugin
	}
	
	@Override
	public void onDisable() {
		
		
		getLogger().info("Disabled");
	}
	
	public static org.bukkit.plugin.Plugin getPlugin() {
		return plugin;
	}
}