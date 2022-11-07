import Fastify from "fastify"
import cors from '@fastify/cors'
import jwt from '@fastify/jwt';

import { poolRoutes } from "./routes/pool"
import { authRoutes } from "./routes/auth"
import { gameRoutes } from "./routes/game"
import { guessRoutes } from "./routes/guess"
import { userRoutes } from "./routes/user"


async function main() {
  const fastify = Fastify({
    logger: true,
  })

  //qualquer aplicação pode acessar o back
  await fastify.register(cors,{
    origin: true,
  })

  //senha secreta deve ser escondido deve ser uma variavel ambiente
  await fastify.register(jwt, {
    secret:  'nlwcopa' 
  })
  
 await fastify.register(poolRoutes)
 await fastify.register(authRoutes)
 await fastify.register(gameRoutes)
 await fastify.register(guessRoutes)
 await fastify.register(userRoutes)

  await fastify.listen({port: 3333})

}

main()