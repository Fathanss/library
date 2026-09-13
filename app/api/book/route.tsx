import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const adapter = new PrismaPg({ connectionString })

// 2. Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter })
// GET: Fetch all books
export async function GET() {

  try {
    const book = await prisma.book.findMany({
      select: {
        id: true,
        full_name: true,
        description: true,
        code_book: true,
        location: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    })

    const books = book.map(({ location, ...bookData }) => ({
      ...bookData,
      location: location.full_name,
    }))

    return NextResponse.json({ success: true, data: books }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch book:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new book
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, description, code_book, status, location_id } = body

    if (!code_book) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if book already exists
    const existingBook = await prisma.book.findFirst({
      where: { code_book },
    })

    if (existingBook) {
      return NextResponse.json(
        { success: false, message: 'Book already exists' },
        { status: 400 }
      )
    }
    // Save to Supabase
    const newUser = await prisma.book.create({
      data: {
        full_name,
        description,
        code_book,
        location_id,
        status,
      },
      select: {
        id: true,
        full_name: true,
        description: true,
        code_book: true,
        location: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    })

    const createdBook = {
      ...newUser,
      location: newUser.location.full_name,
    }

    return NextResponse.json(
      { success: true, message: 'Book created successfully', data: createdBook },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create book:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}