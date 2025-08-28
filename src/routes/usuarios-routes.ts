import type { FastifyInstance } from "fastify";


interface User {
  id: number;
  nombre: string;
  email: string;
}

let users: User[] = [
  { id: 1, nombre: "Yoni", email: "Yoni@correo.com" },
  { id: 2, nombre: "Walker", email: "Walker@correo.com" },
  { id: 3, nombre: "WhiteHorse", email: "whitehorse@correo.com" }
];

async function usuariosRoutes(fastify: FastifyInstance) {
  // Obtener todos los usuarios
  fastify.get("/usuarios", {
    //Falta validar el Schema para que no tire error en Swagger
    /*schema: {
      description: "Obtiene todos los usuarios",
      response: { 200: { type: "array", items: { type: "object" } } }
    }*/
  }, async (request, reply) => {
    return users;
  });

  // Obtener un usuario por id
  fastify.get<{ Params: { id: number } }>("/usuarios/:id", {
    //Falta validar el Schema para que no tire error en Swagger
   /* schema: {
        description: "Obtiene un usuario por id",
        params: { id: { type: "number" } },
        response: { 200: { type: "object" } }
    }*/
  }, async (request, reply) => {
    const user = users.find(u => u.id === Number(request.params.id));
    if (!user) return reply.status(404).send({ error: "Usuario no encontrado" });
    return user;
  });
}

export default usuariosRoutes;