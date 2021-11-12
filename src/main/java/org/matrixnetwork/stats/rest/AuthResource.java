package org.matrixnetwork.stats.rest;

import fr.xephi.authme.api.v3.AuthMeApi;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.matrixnetwork.stats.MatrixStats;
import org.matrixnetwork.stats.entity.Account;
import org.matrixnetwork.stats.util.Auth;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Path("/auth")
public class AuthResource {
    private final JSONParser parser = new JSONParser();

    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response login(String jsonRequest) {
        JSONObject obj;

        try {
            obj = (JSONObject) parser.parse(jsonRequest);
        } catch (ParseException e) {
            return Response.status(400).build();
        }

        if(obj.get("username") == null ||
                !(obj.get("username") instanceof String) ||
                obj.get("password") == null ||
                !(obj.get("password") instanceof String)) {
            return Response.status(400).build();
        }


        if(AuthMeApi.getInstance().checkPassword((String) obj.get("username"), (String) obj.get("password"))) {
            String token = Auth.getInstance().generateToken((String) obj.get("username"));
            MatrixStats.getPlugin().getLogger().info((String) obj.get("username"));
            MatrixStats.getPlugin().getLogger().info(token);

            if (token == null) {
                return Response.status(403).build();
            }

            JSONObject retObj = new JSONObject();
            retObj.put("token", token);
            retObj.put("expiryDate", LocalDateTime.now().plusSeconds(Auth.getInstance().TOKEN_EXPIRATION_TIME).toString());
            return Response.ok(retObj.toJSONString()).build();
        }
        else {
            MatrixStats.getPlugin().getLogger().info((String) obj.get("username"));
            MatrixStats.getPlugin().getLogger().info((String) obj.get("password"));
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
