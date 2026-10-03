import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'


const connectionString = process.env.DATABASE_URL
if (!connectionString) {
 throw new Error('DATABASE_URL environment variable is missing')
}


const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


type RouteContext = {
 params: Promise<{ id: string }>
}


// DELETE /api/book/[id]
export async function DELETE(
 request: Request,
 context: RouteContext
) {
 try {
   const { id } = await context.params


   if (!id) {
     return NextResponse.json(
       { success: false, message: 'Missing borrower ID parameter' },
       { status: 400 }
     )
   }


   // If your Prisma model uses an integer ID (e.g. Int @id @default(autoincrement())),
   // parse it first:
   // const targetId = Number(id)
   // if (isNaN(targetId)) {
   //   return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 })
   // }
   const targetId = id // use this directly if your ID is a UUID/String


   // Check if the record exists
   const existingBook = await prisma.book.findUnique({
     where: { id: targetId },
   })


   if (!existingBook) {
     return NextResponse.json(
       { success: false, message: 'Book not found' },
       { status: 404 }
     )
   }


   // Delete the record
   const deletedBook = await prisma.book.delete({
     where: { id: targetId },
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
     {
       success: true,
       message: 'Book deleted successfully',
       data: deletedBook,
     },
     { status: 200 }
   )
 } catch (error) {
   console.error('Failed to delete book:', error)
   return NextResponse.json(
     { success: false, message: 'Internal server error' },
     { status: 500 }
   )
 }
}

// PUT /api/books/[id]
export async function PUT(
 request: Request,
 context: RouteContext
) {
 try {
   const { id } = await context.params
   const body = await request.json()
   const { full_name } = body


   if (!id) {
     return NextResponse.json(
       { success: false, message: 'Missing book ID parameter' },
       { status: 400 }
     )
   }


   if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
     return NextResponse.json(
       { success: false, message: 'Field "full_name" is required and cannot be empty' },
       { status: 400 }
     )
   }


 // Convert to Number(id) if your schema ID is an Int
   const targetId = id


   // 1. Verify the book exists
   const existingBook = await prisma.book.findUnique({
     where: { id: targetId },
   })


   if (!existingBook) {
     return NextResponse.json(
       { success: false, message: 'Book not found' },
       { status: 404 }
     )
   }


   // 2. Prevent duplicate names if another record already has this name
   const duplicateBook = await prisma.book.findFirst({
     where: {
       full_name: full_name.trim(),
       NOT: { id: targetId },
     },
   })


   if (duplicateBook) {
     return NextResponse.json(
       { success: false, message: 'A book with this name already exists' },
       { status: 409 }
     )
   }


   // 3. Update the record
   const updatedBook = await prisma.book.update({
     where: { id: targetId },
     data: {
       full_name: full_name.trim(),
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
     {
       success: true,
       message: 'Book updated successfully',
       data: updatedBook,
     },
     { status: 200 }
   )
 } catch (error) {
   console.error('Failed to update book:', error)
   return NextResponse.json(
     { success: false, message: 'Internal server error' },
     { status: 500 }
   )
 }
}



