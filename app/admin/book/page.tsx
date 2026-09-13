"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Select from "react-select";
import { Location, locationService } from "@/services/locationService";
import { Book, bookService } from "@/services/bookService";

// Format expected by react-select
interface SelectOption {
  value: string;
  label: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const itemsPerPage = 5;

  // Offcanvas state
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    description: string;
    code_book: string;
    location_id: string;
    status: string;
  }>({
    full_name: "",
    description: "",
    code_book: "",
    location_id: "",
    status: "",
  });

  // Fetch both datasets concurrently
  useEffect(() => {
    Promise.all([bookService.getAll(), locationService.getAll()])
      .then(([booksData, locationsData]) => {
        setBooks(booksData);
        setLocations(locationsData);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Data Loading Error",
          text: err.message,
        });
      });
  }, []);

  const locationOptions: SelectOption[] = locations.map((loc) => ({
    value: loc.id,
    label: loc.full_name,
  }));

  // Filter & Pagination logic
  const filteredBooks = books.filter((book) =>
    book.full_name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal Handlers
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentBookId(null);
    setFormData({
      full_name: "",
      description: "",
      code_book: "",
      location_id: "",
      status: "",
    });
    setIsOffcanvasOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setIsEditing(true);
    setCurrentBookId(book.id);
    setFormData({
      full_name: book.full_name,
      description: book.description,
      code_book: book.code_book,
      location_id: book.location_id,
      status: book.status,
    });
    setIsOffcanvasOpen(true);
  };

  // Unified Submit: POST or PUT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && currentBookId !== null) {
        // API: PUT /api/books/[id]
        const updated = await bookService.update(currentBookId, formData);
        setBooks((prev) =>
          prev.map((book) => (book.id === currentBookId ? updated : book)),
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Book updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // API: POST /api/books
        const created = await bookService.create(formData);
        setBooks((prev) => [created, ...prev]);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Book added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setIsOffcanvasOpen(false);
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Action Failed", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // API: DELETE /api/books/[id]
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Delete Book?",
      text: "You cannot undo this action after it is deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await bookService.remove(id);
          setBooks((prev) => prev.filter((book) => book.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Book has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error.message,
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Book Management</h1>
          <p className="text-sm text-slate-500">
            Manage your library catalog books efficiently
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18} />
          <span>Add New Book</span>
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
              placeholder="Search by book name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Book Name</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Code book</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {book.full_name}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {book.description}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {book.code_book}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {book.location}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${book.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {book.status}
                      </span>
                    </td>
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
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No books found.
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
                  {isEditing ? "Edit Book" : "Add New Book"}
                </h2>
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsOffcanvasOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 p-6 space-y-4 overflow-y-auto"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Book Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter book name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter book description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Code Book
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.code_book}
                    onChange={(e) =>
                      setFormData({ ...formData, code_book: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter book code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Location
                  </label>
                  <Select<SelectOption>
                    isDisabled={isSubmitting}
                    isClearable
                    placeholder="Search or select a location..."
                    options={locationOptions}
                    value={
                      locationOptions.find(
                        (opt) => opt.value === formData.location_id,
                      ) || null
                    }
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        location_id: selected ? selected.value : "",
                      })
                    }
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#f8fafc",
                        borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
                        borderRadius: "0.75rem",
                        padding: "4px 6px",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
                          : "none",
                        "&:hover": {
                          borderColor: state.isFocused ? "#6366f1" : "#cbd5e1",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "0.75rem",
                        zIndex: 9999, // Keeps dropdown floating above the modal
                      }),
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter book status"
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
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                        ? "Save Changes"
                        : "Create Book"}
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
