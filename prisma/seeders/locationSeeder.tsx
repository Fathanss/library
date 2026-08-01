import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
export async function seedLocations(prisma: PrismaClient) {
 console.log('Seeding locations...')


 // Example location dummy data (adjust model/fields based on your schema)
 const locations = [
   { full_name: 'Rak A1' },
   { full_name: 'Rak A2' },
   { full_name: 'Rak A3' },
 ]


 // Assuming you have a location/locations table in your schema:
 for (const loc of locations) {
   await prisma.location.create({
     data: loc,
   })
 }

 console.log('Locations seeded successfully!')
}