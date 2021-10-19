package org.matrixnetwork.stats.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/test")
public class StatsResource {

    @GET
    @Produces( MediaType.TEXT_PLAIN )
    public Response meet() {
        return Response.ok("Hello").build();
    }
}
