import type { FastifyInstance, FastifySchema } from "fastify";


interface User {
  id_usuario: number;
  nombre: string;
  isAdmin: boolean;
}

let users: User[] = [
  { id_usuario: 1, nombre: "Yoni", isAdmin: true },
  { id_usuario: 2, nombre: "Walker", isAdmin: false },
  { id_usuario: 3, nombre: "WhiteHorse", isAdmin: false }
];

const usuarioSchema = {//validador response 
    type: 'object',
    properties: {
        nombre: {type: 'string', minLength:2},
        isAdmin: {type: 'boolean'}
    },
    required: ['nombre','isAdmin'],
    additionalProperties: false
}


const usuarioPostSchema = {
    type: 'object',
    properties: {
        id_usuario: {type: 'number', minimum:1},
        nombre: {type: 'string', minLength:2},
        isAdmin: {type: 'boolean'}
    },
    required: ['id_usuario','nombre','isAdmin'],
    additionalProperties: true
}



async function usuariosRoutes(fastify: FastifyInstance) {
  // Obtener todos los usuarios
    fastify.get('/usuarios',{
    //si no ejecuta el validador o no cumple el validador, nunca va a llegar al handler
        schema:{ 
            summary: 'Ruta de usuarios',
            description: 'Ruta para obtener todos los usuarios',
            tags: ['GET'],
            response: {
                200: {
                    type: 'array',
                    items: usuarioSchema
                }
            }
        } as FastifySchema
    },
  async function handler (request, reply) {
    return users;
  });


  //No me acuerdo como se hace el querystring
  // Obtener un usuario por id
  fastify.get<{ Params: { id: number } }>("/usuarios/:id", {
    schema: {
      summary: 'Obtener un usuario por id',
      description: 'Devuelve el usuario seleccionado por su id',
      tags: ['GET'],
      params: {
        type: "object",
        properties: {
          id: { type: "integer", minimum: 1 }
        },
        required: ["id"],
        additionalProperties: false
      },
      response: {
        200: usuarioSchema,
        404: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    } as FastifySchema
  }, async (request, reply) => {
    const user = users.find(u => u.id_usuario === Number(request.params.id));
    if (!user) return reply.status(404).send({ error: "Usuario no encontrado" });
    return user;
  });

  // Crear un nuevo usuario
  fastify.post<{ Body: Omit<User, "id"> }>("/usuarios", {
    schema: {
      summary: 'Crear un nuevo usuario',
      description: 'Creacion de un nuevo usuario ',
      tags: ['POST'],
      body: usuarioPostSchema,
      response: {
        201: usuarioSchema,
        400: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    } as FastifySchema
  }, async (request, reply) => {
    const { nombre, isAdmin, id_usuario } = request.body as any;
    const id = users.length ? Math.max(...users.map(u => u.id_usuario)) + 1 : 1;
    const newUser: any = { id_usuario: id, nombre, isAdmin };
    users.push(newUser);
    reply.status(201);
    return newUser;
  });

  // Modificar un usuario
    fastify.put<{ Params: { id: number }; Body: Omit<User, "id"> }>("/usuarios/:id", {
    schema: {
      summary: 'Modificar un usuario',
      description: 'Poder modificar un usuario por su id',
      tags: ['PUT'],
      params: { 
        type: "object", 
        properties: { 
          id: { type: "integer", minimum: 1 } 
        }, 
        required: ["id"], 
        additionalProperties: false 
      },
      body: {
        type: "object",
        properties: {
          nombre: { type: "string", minLength: 2 }
        },
        required: ["nombre"],
        additionalProperties: false
      },
      response: {
        204: {type: 'null'},
        404: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    } as FastifySchema
  }, async (request, reply) => {
    const { id } = request.params;
    const { nombre, isAdmin, id_usuario } = request.body as any;
    const userIndex = users.findIndex(u => u.id_usuario === Number(id));
    if (userIndex === -1) return reply.status(404).send({ error: "Usuario no encontrado" });
    users[userIndex].nombre = nombre;
    return reply.status(204).send();
  });

  // Eliminar un usuario
  fastify.delete<{ Params: { id: number } }>("/usuarios/:id", {
    schema: {
      summary: 'Eliminar un usuario',
      description: 'Elimina el usuario seleccionado por su id',
      tags: ['DELETE'],
      params: {
        type: "object",
        properties: {
          id: { type: "integer", minimum: 1 }
        },
        required: ["id"],
        additionalProperties: false
      },
      response: {
        204: {type: 'null'},
        404: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    } as FastifySchema
  }, async (request, reply) => {
    const { id } = request.params;
    const userIndex = users.findIndex(u => u.id_usuario === Number(id));
    if (userIndex === -1) return reply.status(404).send({ error: "Usuario no encontrado" });
    const deleted = users.splice(userIndex, 1);
    return reply.status(204).send();
  });
}

export default usuariosRoutes;