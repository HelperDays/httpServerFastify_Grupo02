import type { FastifyInstance, FastifySchema } from "fastify";  

async function rootRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    schema: {
      tags: ["root"],
      summary: "Ruta raíz",
      description: "Endpoint principal de la API"
    } as FastifySchema
  }, async (request, reply) => {
    return { message: "API de usuarios funcionando" };
  });

  // Ruta catch-all para 404
  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({ error: "Ruta no encontrada" });
  });
}

export default rootRoutes;