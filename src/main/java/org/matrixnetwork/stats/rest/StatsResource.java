package org.matrixnetwork.stats.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.javadoc.internal.doclets.toolkit.taglets.UserTaglet;
import org.bukkit.entity.Player;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.MatrixPlayer;
import org.matrixnetwork.stats.entity.PlayerStats;
import org.matrixnetwork.stats.manager.DataManager;

import javax.transaction.Transactional;
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
            MatrixPlayer mP = DataManager.getInstance().getMatrixPlayerByProperty("uuid", p.getUniqueId().toString());

            if(mP == null) {
                Session s = DataManager.getInstance().getSession();
                Transaction t = s.beginTransaction();

                mP = (MatrixPlayer) s.merge(new MatrixPlayer(p.getUniqueId().toString(), p.getName()));
                t.commit();
            }

            return Response.ok(mP.toJson().toJSONString()).build();
        }
        else {
            return Response.status(404).build();
        }
    }
}
