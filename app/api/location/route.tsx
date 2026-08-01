import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const adapter = new PrismaPg({ connectionString })

// 2. Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter })
// GET: Fetch all location
export async function GET() {

  try {
    const location = await prisma.location.findMany({
      select: {
        id: true,
        full_name: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: location }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch location:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new location
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name,  password, role } = body

    if (!full_name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if location already exists
    const existingLocation = await prisma.location.findFirst({
      where: { full_name },
    })

    if (existingLocation) {
      return NextResponse.json(
        { success: false, message: 'Location already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save to Supabase
    const newUser = await prisma.location.create({
      data: {
        full_name,
      },
      select: {
        id: true,
        full_name: true,
        created_at: true,
        updated_at: true,
      },
    })

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: newUser },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}