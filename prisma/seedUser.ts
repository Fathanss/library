import bcrypt from 'bcryptjs'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed with password hashing...')

  // Define plain text passwords
  const defaultPassword = 'password123'

  // Hash the password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const dummyUsers = [
    {
      full_name: 'Jino Sulistya',
      email: 'jino@example.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      full_name: 'Budi Santosa',
      email: 'budi@example.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      full_name: 'Siti Rahma',
      email: 'siti@example.com',
      password: hashedPassword,
      role: 'user',
    },
  ]

  for (const user of dummyUsers) {
    const createdUser = await prisma.users.upsert({
      where: { email: user.email },
      update: {
        password: user.password, // Update password if user already exists
      },
      create: user,
    })
    console.log(`Created/Updated user: ${createdUser.full_name} (${createdUser.email})`)
  }

  console.log('Seeding complete!')
  console.log(`All seeded users have password: "${defaultPassword}"`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })