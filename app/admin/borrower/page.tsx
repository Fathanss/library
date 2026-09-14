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
import { Book, bookService } from "@/services/bookService";
import { Borrower, borrowerService } from "@/services/borrowerService";

interface SelectOption {
 value: string;
 label: string;
}

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [Books, setBooks] = useState<Book[]>([]);
  const itemsPerPage = 5;

  // Offcanvas state
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentBorrowerId, setCurrentBorrowerId] = useState<number | null>(
    null,
  );
  const [formData, setFormData] = useState<{
    full_name: string;
    book_id: string;
    no_hp: string;
    time_borrow: string;
    time_return: string;
  }>({
    full_name: "",
    book_id: "",
    no_hp: "",
    time_borrow: "",
    time_return: "",
  });

  // Initial load
  useEffect(() => {
    Promise.all([borrowerService.getAll(), bookService.getAll()])
      .then(([borrowersData, booksData]) => {
        setBorrowers(borrowersData);
        setBooks(booksData);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Load Failed",
          text: error.message,
        });
      });
  }, []);

  const bookOptions: SelectOption[] = Books.map((book) => ({
    value: String(book.id),
    label: book.full_name,
  }));

  // Filter & Pagination logic
  const filteredBorrowers = borrowers.filter((borrower) =>
    borrower.full_name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredBorrowers.length / itemsPerPage) || 1;
  const paginatedBorrowers = filteredBorrowers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal Handlers
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentBorrowerId(null);
    setFormData({
      full_name: "",
      book_id: "",
      no_hp: "",
      time_borrow: "",
      time_return: "",
    });
    setIsOffcanvasOpen(true);
  };

  const handleOpenEdit = (borrower: Borrower) => {
    setIsEditing(true);
    setCurrentBorrowerId(borrower.id);
    setFormData({
      full_name: borrower.full_name,
      book_id: borrower.book_id,
      no_hp: borrower.no_hp.toString(),
      time_borrow: borrower.time_borrow
        ? borrower.time_borrow.toISOString()
        : "",
      time_return: borrower.time_return
        ? borrower.time_return.toISOString()
        : "",
    });
    setIsOffcanvasOpen(true);
  };

  // Unified Submit: POST or PUT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && currentBorrowerId !== null) {
        // API: PUT /api/borrowers/[id]
        const updated = await borrowerService.update(
          currentBorrowerId,
          formData,
        );
        setBorrowers((prev) =>
          prev.map((borrower) =>
            borrower.id === currentBorrowerId ? updated : borrower,
          ),
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Borrower updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // API: POST /api/borrowers
        const created = await borrowerService.create(formData);
        setBorrowers((prev) => [created, ...prev]);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Borrower added successfully",
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

  // API: DELETE /api/borrowers/[id]
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Delete Borrower?",
      text: "You cannot undo this action after it is deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await borrowerService.remove(id);
          setBorrowers((prev) => prev.filter((borrower) => borrower.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Borrower has been deleted.",
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
          <h1 className="text-2xl font-bold text-slate-800">
            Borrower Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage your library catalog borrowers efficiently
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18} />
          <span>Add New Borrower</span>
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
              placeholder="Search by borrower name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Borrower Name</th>
                <th className="py-3.5 px-6">No hp</th>
                <th className="py-3.5 px-6">Book</th>
                <th className="py-3.5 px-6">Time borrow</th>
                <th className="py-3.5 px-6">Time return</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedBorrowers.length > 0 ? (
                paginatedBorrowers.map((borrower) => (
                  <tr
                    key={borrower.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {borrower.full_name}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {borrower.no_hp}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {borrower.book_id}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {
                        new Date(borrower.time_borrow)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {
                        new Date(borrower.time_return)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(borrower)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(borrower.id)}
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
                    No borrowers found.
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
                  {isEditing ? "Edit Borrower" : "Add New Borrower"}
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
                    Borrower Name
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
                    placeholder="Enter borrower name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isSubmitting}
                    value={formData.no_hp}
                    onChange={(e) =>
                      setFormData({ ...formData, no_hp: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Book
                  </label>
                  <Select<SelectOption>
                    isDisabled={isSubmitting}
                    isClearable
                    placeholder="Search or Select a book..."
                    options={bookOptions}
                    value={
                      bookOptions.find(
                        (opt) => opt.value === formData.book_id,
                      )|| null
                    }
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        book_id: selected ? selected.value : "",
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
                    Time Borrow
                  </label>
                  <input
                    type="datetime-local"
                    required
                    disabled={isSubmitting}
                    value={formData.time_borrow}
                    onChange={(e) =>
                      setFormData({ ...formData, time_borrow: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter time borrowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Time Return
                  </label>
                  <input
                    type="datetime-local"
                    disabled={isSubmitting}
                    value={formData.time_return}
                    onChange={(e) =>
                      setFormData({ ...formData, time_return: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="Enter time to return"
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
                        : "Create Borrower"}
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
