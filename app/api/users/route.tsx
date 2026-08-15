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
// GET: Fetch all users
export async function GET() {

  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: users }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new user with hashed password
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, email, password, role } = body

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save to Supabase
    const newUser = await prisma.users.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        role: role || 'user',
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
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