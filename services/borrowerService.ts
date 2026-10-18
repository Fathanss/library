export interface Borrower {
  id: string;
  full_name: string;
  book_id: string;
  book: string;
  no_hp: number;     
  time_borrow: Date;
  time_return: Date;
}

export interface BorrowerPayload {
  full_name: string;
  book_id: string;
  no_hp: number;       
  time_borrow: Date;
  time_return: Date;
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
  async update(id: string, payload: BorrowerPayload): Promise<Borrower> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update borrower');
    return result.data;
  },

  // Delete borrower (DELETE) - Aman untuk status 204 No Content
  async remove(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      let errorMessage = 'Failed to delete borrower';
      try {
        const result = await res.json();
        errorMessage = result.message || errorMessage;
      } catch {
        // Jika response body kosong / bukan JSON (misal status 204)
      }
      throw new Error(errorMessage);
    }
  },
};