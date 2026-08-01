import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from 'pg'; 

// Setup adapter PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

async function main() {
  const dummyLocations = [
    {
      full_name: 'A1',
    },
    {
      full_name: 'A2',
    },
    {
      full_name: 'A3',
    },
  ]

  console.log('Mulai melakukan seeding data...')

  // Memasukkan data ke tabel location
  const result = await prisma.location.createMany({
    data: dummyLocations,
    skipDuplicates: true, // Abaikan jika ada nama yang sama (opsional, berguna jika full_name @unique)
  })

  console.log(`Berhasil menambahkan ${result.count} data lokasi.`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  