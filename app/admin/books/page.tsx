'use client';


import { useState, useEffect, FormEvent } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Swal from 'sweetalert2';


interface Book {
 id: number;
 title: string;
 author: string;
 year: number;
}


interface PostApiResponse {
 id: number;
 title: string;
 body: string;
 userId: number;
}


export default function BooksPage() {
 const [books, setBooks] = useState<Book[]>([]);
 const [search, setSearch] = useState<string>('');
 const [currentPage, setCurrentPage] = useState<number>(1);
 const itemsPerPage = 5;


 // Offcanvas state
 const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false);
 const [isEditing, setIsEditing] = useState<boolean>(false);
 const [currentBookId, setCurrentBookId] = useState<number | null>(null);
 const [formData, setFormData] = useState<{ title: string; author: string; year: string | number }>({
   title: '',
   author: '',
   year: '',
 });


 // Fetch dummy data from JSONPlaceholder API
 useEffect(() => {
   fetch('https://jsonplaceholder.typicode.com/posts?_limit=12')
     .then((res) => res.json())
     .then((data: PostApiResponse[]) => {
       const mappedBooks: Book[] = data.map((item, idx) => ({
         id: item.id,
         title: item.title.slice(0, 30),
         author: `Author ${idx + 1}`,
         year: 2020 + (idx % 5),
       }));
       setBooks(mappedBooks);
     });
 }, []);


 // Filter & Pagination logic
 const filteredBooks = books.filter(
   (b) =>
     b.title.toLowerCase().includes(search.toLowerCase()) ||
     b.author.toLowerCase().includes(search.toLowerCase())
 );
 const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
 const paginatedBooks = filteredBooks.slice(
   (currentPage - 1) * itemsPerPage,
   currentPage * itemsPerPage
 );


 // Open Create Offcanvas
 const handleOpenCreate = () => {
   setIsEditing(false);
   setFormData({ title: '', author: '', year: '' });
   setIsOffcanvasOpen(true);
 };


 // Open Edit Offcanvas
 const handleOpenEdit = (book: Book) => {
   setIsEditing(true);
   setCurrentBookId(book.id);
   setFormData({ title: book.title, author: book.author, year: book.year });
   setIsOffcanvasOpen(true);
 };


 // Handle Form Submit (Create / Update)
 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   if (isEditing && currentBookId !== null) {
     setBooks(books.map((b) => (b.id === currentBookId ? { ...b, ...formData, year: Number(formData.year) } : b)));
     Swal.fire({ icon: 'success', title: 'Updated!', text: 'Book updated successfully', timer: 1500, showConfirmButton: false });
   } else {
     const newBook: Book = {
       id: Date.now(),
       title: String(formData.title),
       author: String(formData.author),
       year: Number(formData.year),
     };
     setBooks([newBook, ...books]);
     Swal.fire({ icon: 'success', title: 'Created!', text: 'Book added successfully', timer: 1500, showConfirmButton: false });
   }
   setIsOffcanvasOpen(false);
 };


 // Handle Delete with SweetAlert
 const handleDelete = (id: number) => {
   Swal.fire({
     title: 'Delete Book?',
     text: 'You cannot undo this action after it is deleted.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#ef4444',
     cancelButtonColor: '#94a3b8',
     confirmButtonText: 'Yes, Delete',
   }).then((result) => {
     if (result.isConfirmed) {
       setBooks(books.filter((b) => b.id !== id));
       Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Book has been deleted.', timer: 1500, showConfirmButton: false });
     }
   });
 };


 return (
   <div>
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
       <div>
         <h1 className="text-2xl font-bold text-slate-800">Book Management</h1>
         <p className="text-sm text-slate-500">Manage your library catalog efficiently</p>
       </div>
       <button
         onClick={handleOpenCreate}
         className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100"
       >
         <Plus size={18} />
         <span>Add New Book</span>
       </button>
     </div>


     {/* Table Container */}
     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
       {/* Search Bar */}
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
             placeholder="Search by title or author..."
             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
           />
         </div>
       </div>


       {/* Data Table */}
       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
               <th className="py-3.5 px-6">Title</th>
               <th className="py-3.5 px-6">Author</th>
               <th className="py-3.5 px-6">Year</th>
               <th className="py-3.5 px-6 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {paginatedBooks.length > 0 ? (
               paginatedBooks.map((book) => (
                 <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="py-4 px-6 font-medium text-slate-800">{book.title}</td>
                   <td className="py-4 px-6 text-slate-600">{book.author}</td>
                   <td className="py-4 px-6 text-slate-600">{book.year}</td>
                   <td className="py-4 px-6 text-right space-x-2">
                     <button
                       onClick={() => handleOpenEdit(book)}
                       className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                     >
                       <Edit2 size={16} />
                     </button>
                     <button
                       onClick={() => handleDelete(book.id)}
                       className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                     >
                       <Trash2 size={16} />
                     </button>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan={4} className="py-8 text-center text-slate-400">
                   No books found.
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>


       {/* Pagination */}
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


     {/* Right-to-Left Offcanvas Form */}
     {isOffcanvasOpen && (
       <div className="fixed inset-0 z-50 overflow-hidden">
         {/* Backdrop */}
         <div
           className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
           onClick={() => setIsOffcanvasOpen(false)}
         />


         <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
           <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h2 className="text-lg font-bold text-slate-800">
                 {isEditing ? 'Edit Book' : 'Add New Book'}
               </h2>
               <button
                 onClick={() => setIsOffcanvasOpen(false)}
                 className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
               >
                 <X size={20} />
               </button>
             </div>


             {/* Form Content */}
             <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto">
               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Book Title</label>
                 <input
                   type="text"
                   required
                   value={formData.title}
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                   placeholder="Enter book title"
                 />
               </div>


               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Author</label>
                 <input
                   type="text"
                   required
                   value={formData.author}
                   onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                   placeholder="Enter author name"
                 />
               </div>


               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Publication Year</label>
                 <input
                   type="number"
                   required
                   value={formData.year}
                   onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                   placeholder="2026"
                 />
               </div>


               <div className="pt-4 flex gap-3">
                 <button
                   type="button"
                   onClick={() => setIsOffcanvasOpen(false)}
                   className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100"
                 >
                   {isEditing ? 'Save Changes' : 'Create Book'}
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


