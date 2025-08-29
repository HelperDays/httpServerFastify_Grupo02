import Fastify from "fastify";
import usuariosRoutes from "./src/routes/usuarios/usuarios-routes.ts";
import rootRoutes from "./src/routes/root-routes.ts";
import swagger from './src/routes/plugins/swagger.ts'
import fastifySwagger from "@fastify/swagger";  

const fastify = Fastify({
    logger: true    
});

// Registrar rutas
fastify.register(swagger);
fastify.register(rootRoutes);
fastify.register(usuariosRoutes);


//Iniciar la escucha
try {
    await fastify.listen({ host:"::",port: 3000 });
        console.log("Servidor escuchando en el puerto 3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
