import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data:{
            name:"Lailla",
            email:'emailteste@gmail.com',
            avatarUrl: " "
        }
    })
    const pool = await prisma.pool.create({
        data: {
            title: "Example Pool",
            code:  'BOL123',
            ownerId: user.id,

            participants:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    //new Date().toISOString()
    await prisma.game.create({
        data:{
            date:'2022-11-03T00:08:56.007Z',
            firsTeamCountryCode: "DE",
            secondTeamCountryCode: "BR"
        }
    })

    await prisma.game.create({
        data:{
            date: '2022-11-03T00:08:56.007Z',
            firsTeamCountryCode: "DR",
            secondTeamCountryCode: "ER",

            guesses:{
                create: {
                    firstTeamPoints:1,
                    secondTeamPoint: 2,

                    participant:{
                        connect:{
                            userId_poolId:{
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                    
                }
            }
        }
    })
}

main()