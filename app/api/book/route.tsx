import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg' // 1. Tambahkan import Pool dari 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

// 2. Buat instance Pool, lalu masukkan ke PrismaPg
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// GET: Fetch all books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
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
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: books }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch books:', error)
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
    const { full_name, description, code_book, location, status } = body

    if (!full_name || !description || !code_book || !location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Optional: Validasi jika status yang dikirim valid
    const validStatuses = ['available', 'borrowed', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Check if book already exists (berdasarkan full_name)
    const existingBook = await prisma.book.findFirst({
      where: { full_name },
    })

    if (existingBook) {
      return NextResponse.json(
        { success: false, message: 'Book already exists' },
        { status: 400 }
      )
    }
    
    // Save to Database
    const newBook = await prisma.book.create({ // Ubah nama variabel dari newUser ke newBook
      data: {
        full_name,
        description,
        code_book,
        location_id: location, // Pastikan field ini sesuai dengan nama kolom di database
        status: status || 'available', // Perbaikan logika status
      },
      select: {
        id: true,
        full_name: true,
        description: true,
        code_book: true,
        location_id: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Book created successfully', data: newBook },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create book:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error },
      { status: 500 }
    )
  }
}