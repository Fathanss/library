import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// GET: Fetch all history
export async function GET() {
  try {
    const history = await prisma.history.findMany({
      select: {
        id: true,
        book_id: true,
        notes: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: history }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch history:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new history
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { notes, book_id, status } = body

    // PERBAIKAN: !status sudah dihapus dari sini
    if ( !book_id || !notes) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validasi jika status yang dikirim valid (hanya dicek jika status dikirim frontend)
    const validStatuses = ['available', 'borrowed', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Save to Database
    const newHistory = await prisma.history.create({
      data: {
        book_id,
        notes,
        status: status || 'available', 
      },
      select: {
        id: true,
        book_id: true,
        notes: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    })

    return NextResponse.json(
      { success: true, message: 'History created successfully', data: newHistory },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create history:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}