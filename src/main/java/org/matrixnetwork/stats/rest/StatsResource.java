package org.matrixnetwork.stats.rest;

import org.bukkit.entity.Player;
import org.json.simple.JSONObject;
import org.matrixnetwork.stats.MatrixStats;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/stats")
public class StatsResource {

    @Path("/{username}")
    @GET
    @Produces( MediaType.APPLICATION_JSON )
    public Response meet(@PathParam("username") String username) {
        if(MatrixStats.getPlugin().getServer().getPlayer(username) != null) {
            Player p = MatrixStats.getPlugin().getServer().getPlayer(username);
            JSONObject obj = new JSONObject();
            obj.put("exp", p.getExp());
            obj.put("food_level", p.getFoodLevel());
            obj.put("loc_x", p.getLocation().getBlockX());
            obj.put("loc_y", p.getLocation().getBlockY());
            obj.put("loc_z", p.getLocation().getBlockZ());
            return Response.ok(obj.toJSONString()).build();
        }
        else {
            return Response.status(404).build();
        }
    }
}
