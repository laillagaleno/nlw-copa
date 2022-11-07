import { Fastify } from 'fastify';
//definição de tipos do typescript

import '@fastify/jwt'

declare module '@fastify/jwt'{
    interface FastifyJWT {
        user:{
            sub: string;
            name: string;
            avatarUrl: string;
        }
    }
    
}