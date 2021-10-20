package org.matrixnetwork.stats.rest;

import fr.xephi.authme.api.v3.AuthMeApi;
import org.jboss.resteasy.annotations.Form;
import org.json.simple.JSONObject;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("/auth")
public class AuthResource {
    @POST
    public Response login(@FormParam("username") String username, @FormParam("password") String password) {
        if(AuthMeApi.getInstance().checkPassword(username, password)) {
            JSONObject obj = new JSONObject();
            // TODO: token authorization to see if user is member or staff
            return Response.ok().build();
        }
        else {
            return Response.status(403).build();
        }
    }
}
