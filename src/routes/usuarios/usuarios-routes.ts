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
  fastify.get("/usuarios", async (request, reply) => {
    return users;
  });

  // Obtener un usuario por id
  fastify.get<{ Params: { id: number } }>("/usuarios/:id", async (request, reply) => {
    const user = users.find(u => u.id === Number(request.params.id));
    if (!user) return reply.status(404).send({ error: "Usuario no encontrado" });
    return user;
  });

  // Crear un nuevo usuario
  fastify.post<{ Body: Omit<User, "id"> }>("/usuarios", async (request, reply) => {
    const { nombre, email } = request.body;
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = { id, nombre, email };
    users.push(newUser);
    reply.status(201);
    return newUser;
  });

  // Actualizar un usuario existente
  fastify.put<{ Params: { id: number }; Body: Omit<User, "id"> }>("/usuarios/:id", async (request, reply) => {
    const { id } = request.params;
    const { nombre, email } = request.body;
    const userIndex = users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) return reply.status(404).send({ error: "Usuario no encontrado" });
    users[userIndex] = { id: Number(id), nombre, email };
    return users[userIndex];
  });

  // Eliminar un usuario
  fastify.delete<{ Params: { id: number } }>("/usuarios/:id", async (request, reply) => {
    const { id } = request.params;
    const userIndex = users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) return reply.status(404).send({ error: "Usuario no encontrado" });
    const deleted = users.splice(userIndex, 1)[0];
    return deleted;
  });
}

export default usuariosRoutes;