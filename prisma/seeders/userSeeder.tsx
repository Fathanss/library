import bcrypt from 'bcryptjs'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export async function seedUsers(prisma: PrismaClient) {
 console.log('Seeding users...')


 const defaultPassword = await bcrypt.hash('password123', 10)


 const users = [
   {
     full_name: 'Joni Sulistya',
     email: 'joni@example.com',
     password: defaultPassword,
     role: 'admin',
   },
   {
     full_name: 'Budi Santoso',
     email: 'budi@example.com',
     password: defaultPassword,
     role: 'user',
   },
 ]


 for (const user of users) {
   await prisma.users.upsert({
     where: { email: user.email },
     update: { password: user.password },
     create: user,
   })
 }


 console.log('Users seeded successfully!')
}
