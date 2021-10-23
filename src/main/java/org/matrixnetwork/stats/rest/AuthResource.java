package org.matrixnetwork.stats.rest;

import fr.xephi.authme.api.v3.AuthMeApi;
import org.jboss.resteasy.annotations.Form;
import org.json.simple.JSONObject;
import org.matrixnetwork.stats.util.Auth;

import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/auth")
public class AuthResource {
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response login(@FormParam("username") String username, @FormParam("password") String password) {
        if(AuthMeApi.getInstance().checkPassword(username, password)) {
            JSONObject obj = new JSONObject();
            obj.put("token", Auth.getInstance().generateToken(username));
            return Response.ok(obj.toJSONString()).build();
        }
        else {
            return Response.status(403).build();
        }
    }
}
