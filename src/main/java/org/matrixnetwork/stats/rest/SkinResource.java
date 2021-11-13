package org.matrixnetwork.stats.rest;

import fr.xephi.authme.api.v3.AuthMeApi;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.Token;
import org.matrixnetwork.stats.util.Auth;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.UUID;

@Path("/skin")
public class SkinResource {
    private JSONParser parser = new JSONParser();

    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getSkin(@HeaderParam("Authorization") String tokenStr) {
        if(tokenStr == null) {
            return Response.status(400).build();
        }

        if(Auth.getInstance().getToken(tokenStr) != null) {
            Token token = Auth.getInstance().getToken(tokenStr);

            JSONObject retObj = new JSONObject();
            retObj.put("skin", MatrixStats.getSkinsRestorerAPI().getSkinName(
                    MatrixStats.getPlugin().getServer().getOfflinePlayer(UUID.fromString(token.getMatrixPlayer().getUUID())).getName()
            ));
            return Response.ok(retObj.toJSONString()).build();
        }
        else {
            return Response.status(403).build();
        }
    }

    @OPTIONS
    @Produces(MediaType.APPLICATION_JSON)
    public Response optionsForBookResource() {
        return Response.status(200)
                .header("Allow","POST")
                .header("Content-Type", MediaType.APPLICATION_JSON)
                .header("Content-Length", "0")
                .build();
    }
}
