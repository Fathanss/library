import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg' // 1. Tambahkan import Pool dari 'pg'
//book_id,no_hp,full_name,time_borrow,time_return//
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

// 2. Buat instance Pool, lalu masukkan ke PrismaPg
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// GET: Fetch all borrower
export async function GET() {
  try {
    const borrower = await prisma.borrower.findMany({
      select: {
        id: true,
        full_name: true,
        book: true,
        no_hp: true,
        time_borrow: true,
        time_return: true,
        created_at: true,
        updated_at: true,
      },
    })

    const borrowers = borrower.map(({ book, ...borrowerData }) => ({
      ...borrowerData,
      book_id: book.full_name,
    }))

    return NextResponse.json({ success: true, data: borrowers }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch borrowers:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new borrower
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const book = "8c74ce43-e8d7-44a2-9c67-17e0b01645eb" // Contoh book_id, sesuaikan dengan kebutuhan
    const { full_name, no_hp, time_borrow, time_return } = body

    if (!full_name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Optional: Validasi jika status yang dikirim valid

    // Check if book already exists (berdasarkan full_name)
    const existingBorrower = await prisma.borrower.findFirst({
      where: { full_name },
    })

    if (existingBorrower) {
      return NextResponse.json(
        { success: false, message: 'Borrower already exists' },
        { status: 400 }
      )
    }
    
    // Save to Database
    const newBorrower = await prisma.borrower.create({ // Ubah nama variabel dari newUser ke newBook
      data: {
        full_name,
        book_id: book,
        no_hp,
        time_borrow : new Date(time_borrow),
        time_return: new Date(time_return),
      },
      select: {
        id: true,
        full_name: true,
        book: true,
        no_hp: true,
        time_borrow: true,
        time_return: true,
        created_at: true,
        updated_at: true,
      },
    })

    const createdBorrower = {
      ...newBorrower,
      book: newBorrower.book.full_name,
    }

    return NextResponse.json(
      { success: true, message: 'Borrower created successfully', data: newBorrower },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create borrower:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}