import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'


// Import your custom seeders
import { seedUsers } from './seeders/userSeeder'
import { seedLocations } from './seeders/locationSeeder'


const connectionString = process.env.DATABASE_URL
if (!connectionString) {
 throw new Error('DATABASE_URL environment variable is missing')
}


const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


async function main() {
 console.log('Starting database seeding sequence...\n')


 // Run seeders sequentially
 // (Order matters if location data depends on users, or vice versa)
 await seedUsers(prisma)
 await seedLocations(prisma)


 console.log('\n All seeders completed successfully!')
}


main()
 .catch((e) => {
   console.error('Seeding failed:', e)
 })
 .finally(async () => {
   await prisma.$disconnect()
 })
