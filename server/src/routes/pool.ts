import ShortUniqueId from 'short-unique-id'
import { FastifyInstance } from 'fastify';
import { prisma } from './../lib/prisma';
import { z } from 'zod' //biblioteca de validação
import { authenticate } from '../plugins/authenticate';


export async function poolRoutes(fastify: FastifyInstance){
  fastify.get('/pools/count', async ()=>{
      const count = await prisma.pool.count()
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


    let ownerId = null;

    try{
      await request.jwtVerify()

      await prisma.pool.create({
        data:{
          title,
          code,
          ownerId: request.user.sub,
          participants : {
            create:{
              userId: request.user.sub
            }
          }
        }
      })

    } catch {
      await prisma.pool.create({
        data:{
          title,
          code,
        }
      })
    }

    return reply.status(201).send({code})
    // return { title }

  })

  //entrar em um bolão
  fastify.post('/pools/join', {
    onRequest: [authenticate]
  }, async (request, reply)=>{
    const joinPoolBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolBody.parse(request.body)

    const pool = await prisma.pool.findUnique({
      where:{
        code,

      },
      include:{
        participants:{
          where:{
            userId: request.user.sub,
          }
        }
      }
    })

    if(!pool){
      return reply.status(400).send({
        message: 'Poll not Found'
      })
    }

    if(pool.participants.length > 0){
      return reply.status(400).send({
        message: 'You already joined this poll'
      })
    }
    //colocando o primeiro usuario q entra no bolão como dono

    if (!pool.ownerId){
      await prisma.pool.update({
        where:{
          id: pool.id,
        },
        data:{
          ownerId: request.user.sub,
        }
      })

    }
    await prisma.participant.create({
      data:{
        poolId: pool.id,
        userId: request.user.sub,
      }
    })

    return reply.status(201).send()
  })

  //boloes q o usuario participa
  fastify.get('/pools', {
    onRequest: [authenticate]
  },async (request)=>{
    const pools = await prisma.pool.findMany({
      where:{
        participants:{
          some:{
            userId: request.user.sub,
          }
        }
      },
      include:{
        _count:{
          select:{
            participants:true,
          }
        },
        participants:{
          select:{
            id: true,
            user:{
              select:{
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select:{
            id: true,
            name: true,
          }
        },        
      }
    })
    return { pools }
  })

  fastify.get('/pools/:id', {
    onRequest: [authenticate],

  },async (request)=>{
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params)

    const pool = await prisma.pool.findUnique({
      where:{
        id,
      },
      include:{
        _count:{
          select:{
            participants:true,
          }
        },
        participants:{
          select:{
            id: true,
            user:{
              select:{
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        owner: {
          select:{
            id: true,
            name: true,
          }
        },        
      }
    })
    return { pool }
  })
}