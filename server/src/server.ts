import Fastify from "fastify"
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'
import { z } from 'zod' //biblioteca de validação
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query'],
})

async function main() {
  const fastify = Fastify({
    logger: true,
  })

  //qualquer aplicação pode acessar o back
  await fastify.register(cors,{
    origin: true,
  })

  fastify.get('/pools/count', async ()=>{
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.get('/users/count', async ()=>{
    const count = await prisma.user.count()
    return { count }
  })

  fastify.get('/guesses/count', async ()=>{
    const count = await prisma.guess.count()
    return { count }
  })
  //criar bolão
  fastify.post('/pools', async (request, reply)=>{
    const createPoolBody = z.object({ //o corpo é um objeto e dentro dele tem uma string e n pode ser nulo
      title: z.string(),
    })
    
    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({length: 6})
    const code = String(generate()).toUpperCase()
    //criando bolão
    await prisma.pool.create({
      data:{
        title,
        code
      }
    })

    return reply.status(201).send({code})
    // return { title }

  })

  await fastify.listen({port: 3333})

}


main()