import { id } from "zod/locales";

export interface Book {
 id: number;
 full_name: string;
 description: string;
 code_book: string;
 location: string;
 location_id: string;
 status: string;
}

export interface BookPayload {
}

const BASE_URL = '/api/book';

export const bookService = {
 // Fetch all books
 async getAll(): Promise<Book[]> {
   const res = await fetch(BASE_URL);
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to fetch books');
   return result.data;
 },


 // Create new book (POST)
 async create(payload: BookPayload): Promise<Book> {

   const res = await fetch(BASE_URL, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to create book');
   return result.data;
 },
 // Update existing book (PUT)
 async update(id: number, payload: BookPayload): Promise<Book> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to update book');
   return result.data;
 },

 // Delete book (DELETE)
 async remove(id: number): Promise<void> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'DELETE',
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to delete book');
 },

};
