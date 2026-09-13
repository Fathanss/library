export interface Borrower {
 id: number;
 full_name: string;
 book_id: string;
 no_hp: number;
 time_borrow: Date;
 time_return: Date;
}

export interface BorrowerPayload {
}

const BASE_URL = '/api/borrower';

export const borrowerService = {
 // Fetch all borrowers
 async getAll(): Promise<Borrower[]> {
   const res = await fetch(BASE_URL);
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to fetch borrowers');
   return result.data;
 },


 // Create new borrower (POST)
 async create(payload: BorrowerPayload): Promise<Borrower> {

   const res = await fetch(BASE_URL, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to create borrower');
   return result.data;
 },
 // Update existing borrower (PUT)
 async update(id: number, payload: BorrowerPayload): Promise<Borrower> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to update borrower');
   return result.data;
 },

 // Delete borrower (DELETE)
 async remove(id: number): Promise<void> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'DELETE',
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to delete borrower');
 },

};
