import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const adapter = new PrismaPg({ connectionString })

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
      book: book.full_name,
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
    const { full_name, no_hp, time_borrow, time_return, book_id } = body

    if (!full_name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }


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
    const newUsers = await prisma.borrower.create({ // Ubah nama variabel dari newUser ke newBook
      data: {
        full_name,
        book_id,
        no_hp,
        time_borrow: new Date(time_borrow),//khsus untuk time_borrow, karena harus diubah menjadi tipe data Date
        time_return: time_return ? new Date(time_return) : null,
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
      ...newUsers,
      book: newUsers.book.full_name,
    }

    return NextResponse.json(
      { success: true, message: 'Borrower created successfully', data: createdBorrower },
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