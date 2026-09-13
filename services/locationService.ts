export interface Location {
 id: string;
 full_name: string;
 created_at: string;
}

export interface LocationPayload {
 full_name: string;
}

const BASE_URL = '/api/location';

export const locationService = {
 // Fetch all locations
 async getAll(): Promise<Location[]> {
   const res = await fetch(BASE_URL);
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to fetch locations');
   return result.data;
 },


 // Create new location (POST)
 async create(payload: LocationPayload): Promise<Location> {
   const res = await fetch(BASE_URL, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to create location');
   return result.data;
 },
 // Update existing location (PUT)
 async update(id: number, payload: LocationPayload): Promise<Location> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to update location');
   return result.data;
 },

 // Delete location (DELETE)
 async remove(id: number): Promise<void> {
   const res = await fetch(`${BASE_URL}/${id}`, {
     method: 'DELETE',
   });
   const result = await res.json();
   if (!res.ok) throw new Error(result.message || 'Failed to delete location');
 },

};
