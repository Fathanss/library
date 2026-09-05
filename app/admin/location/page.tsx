'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { Location, locationService } from '@/services/locationService';

export default function LocationsPage() {
 const [locations, setLocations] = useState<Location[]>([]);
 const [search, setSearch] = useState<string>('');
 const [currentPage, setCurrentPage] = useState<number>(1);
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
 const itemsPerPage = 5;

 // Offcanvas state
 const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false);
 const [isEditing, setIsEditing] = useState<boolean>(false);
 const [currentLocationId, setCurrentLocationId] = useState<number | null>(null);
 const [formData, setFormData] = useState<{ full_name: string }>({ full_name: '' });


 // Initial load
 useEffect(() => {
   locationService
     .getAll()
     .then((data) => setLocations(data))
     .catch((err) => {
       Swal.fire({ icon: 'error', title: 'Error', text: err.message });
     });
 }, []);


 // Filter & Pagination logic
 const filteredLocations = locations.filter((loc) =>
   loc.full_name.toLowerCase().includes(search.toLowerCase())
 );
 const totalPages = Math.ceil(filteredLocations.length / itemsPerPage) || 1;
 const paginatedLocations = filteredLocations.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
 );


 // Modal Handlers
 const handleOpenCreate = () => {
   setIsEditing(false);
   setCurrentLocationId(null);
   setFormData({ full_name: '' });
   setIsOffcanvasOpen(true);
 };


 const handleOpenEdit = (loc: Location) => {
   setIsEditing(true);
   setCurrentLocationId(loc.id);
   setFormData({ full_name: loc.full_name });
   setIsOffcanvasOpen(true);
 };


 // Unified Submit: POST or PUT
 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   setIsSubmitting(true);

   try {
     if (isEditing && currentLocationId !== null) {
       // API: PUT /api/location/[id]
       const updated = await locationService.update(currentLocationId, formData);
       setLocations((prev) =>
         prev.map((loc) => (loc.id === currentLocationId ? updated : loc))
       );
       Swal.fire({
         icon: 'success',
         title: 'Updated!',
         text: 'Location updated successfully',
         timer: 1500,
         showConfirmButton: false,
       });
     } else {
       // API: POST /api/location
       const created = await locationService.create(formData);
       setLocations((prev) => [created, ...prev]);
       Swal.fire({
         icon: 'success',
         title: 'Created!',
         text: 'Location added successfully',
         timer: 1500,
         showConfirmButton: false,
       });
     }
     setIsOffcanvasOpen(false);
   } catch (error: any) {
     Swal.fire({ icon: 'error', title: 'Action Failed', text: error.message });
   } finally {
     setIsSubmitting(false);
   }
 };


 // API: DELETE /api/location/[id]
 const handleDelete = (id: number) => {
   Swal.fire({
     title: 'Delete Location?',
     text: 'You cannot undo this action after it is deleted.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#ef4444',
     cancelButtonColor: '#94a3b8',
     confirmButtonText: 'Yes, Delete',
   }).then(async (result) => {
     if (result.isConfirmed) {
       try {
         await locationService.remove(id);
         setLocations((prev) => prev.filter((loc) => loc.id !== id));
         Swal.fire({
           icon: 'success',
           title: 'Deleted!',
           text: 'Location has been deleted.',
           timer: 1500,
           showConfirmButton: false,
         });
       } catch (error: any) {
         Swal.fire({ icon: 'error', title: 'Delete Failed', text: error.message });
       }
     }
   });
 };


 return (
   <div>
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
       <div>
         <h1 className="text-2xl font-bold text-slate-800">Location Management</h1>
         <p className="text-sm text-slate-500">Manage your library catalog locations efficiently</p>
       </div>
       <button
         onClick={handleOpenCreate}
         className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100"
       >
         <Plus size={18} />
         <span>Add New Location</span>
       </button>
     </div>


     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
       <div className="p-4 border-b border-slate-100 flex items-center gap-3">
         <div className="relative flex-1 max-w-sm">
           <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
             <Search size={18} />
           </span>
           <input
             type="text"
             value={search}
             onChange={(e) => {
               setSearch(e.target.value);
               setCurrentPage(1);
             }}
             placeholder="Search by location name..."
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
           />
         </div>
       </div>


       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
               <th className="py-3.5 px-6">Location Name</th>
               <th className="py-3.5 px-6">Created at</th>
               <th className="py-3.5 px-6 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {paginatedLocations.length > 0 ? (
               paginatedLocations.map((loc) => (
                 <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="py-4 px-6 font-medium text-slate-800">{loc.full_name}</td>
                   <td className="py-4 px-6 text-slate-500">
                     {new Date(loc.created_at).toLocaleDateString()}
                   </td>
                   <td className="py-4 px-6 text-right space-x-2">
                     <button
                       onClick={() => handleOpenEdit(loc)}
                       className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                     >
                       <Edit2 size={16} />
                     </button>
                     <button
                       onClick={() => handleDelete(loc.id)}
                       className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                     >
                       <Trash2 size={16} />
                     </button>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan={3} className="py-8 text-center text-slate-400">
                   No locations found.
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>


       <div className="p-4 border-t border-slate-100 flex items-center justify-between">
         <span className="text-xs text-slate-500">
           Page {currentPage} of {totalPages}
         </span>
         <div className="flex items-center gap-1">
           <button
             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
             disabled={currentPage === 1}
             className="p-2 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
           >
             <ChevronLeft size={16} />
           </button>
           <button
             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
             disabled={currentPage === totalPages}
             className="p-2 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
           >
             <ChevronRight size={16} />
           </button>
         </div>
       </div>
     </div>


     {/* Offcanvas Form */}
     {isOffcanvasOpen && (
       <div className="fixed inset-0 z-50 overflow-hidden">
         <div
           className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
           onClick={() => !isSubmitting && setIsOffcanvasOpen(false)}
         />
         <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
           <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h2 className="text-lg font-bold text-slate-800">
                 {isEditing ? 'Edit Location' : 'Add New Location'}
               </h2>
               <button
                 disabled={isSubmitting}
                 onClick={() => setIsOffcanvasOpen(false)}
                 className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
               >
                 <X size={20} />
               </button>
             </div>


             <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto">
               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                   Location Name
                 </label>
                 <input
                   type="text"
                   required
                   disabled={isSubmitting}
                   value={formData.full_name}
                   onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                   placeholder="Enter location name"
                 />
               </div>


               <div className="pt-4 flex gap-3">
                 <button
                   type="button"
                   disabled={isSubmitting}
                   onClick={() => setIsOffcanvasOpen(false)}
                   className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                 >
                   {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Location'}
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}

