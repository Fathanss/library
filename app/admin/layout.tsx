'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Handshake,
  Clock,
  Locate,
  LucideIcon,
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import Swal from 'sweetalert2';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Books', href: '/admin/books', icon: BookOpen },
    { name: 'Borrowers', href: '/admin/borrower', icon: Handshake },
    { name: 'Borrowing History', href: '/admin/borrowing-history', icon: Clock },
    { name: 'Locations', href: '/admin/location', icon: Locate },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari aplikasi?',
      text: 'Sesi login Anda saat ini akan diakhiri.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl shadow-xl border border-slate-100',
        confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md shadow-indigo-500/20',
        cancelButton: 'rounded-xl px-5 py-2.5 font-medium',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans antialiased flex text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/80 fixed inset-y-0 z-30 shadow-sm transition-all">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight block leading-tight">
                AdminPanel
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Library System
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={19}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? 'text-white scale-110'
                        : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-105'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Snippet & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">admin@library.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pb-24 md:pb-8 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Floating Navbar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white rounded-2xl shadow-2xl px-3 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-indigo-600/90 shadow-md shadow-indigo-500/30 font-medium scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-[9px] leading-none">{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl text-rose-400 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-[9px] leading-none">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}