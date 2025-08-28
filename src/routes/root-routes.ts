import type { FastifyInstance } from "fastify";  

async function rootRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return { message: "API de usuarios funcionando" };
  });

  // Ruta catch-all para 404
  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({ error: "Ruta no encontrada" });
  });
}

export default rootRoutes;