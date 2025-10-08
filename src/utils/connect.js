import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientSingleton()
} else {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton()
  }
  prisma = global.prisma
}

export default prisma