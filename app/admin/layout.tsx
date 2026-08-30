'use client';


import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen,  LogOut, LucideIcon } from 'lucide-react';
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
   { name: 'Borrowers', href: '/admin/borrower', icon: BookOpen },
   { name: 'History', href: '/admin/history', icon: BookOpen },
   { name: 'Locations', href: '/admin/location', icon: BookOpen },
 ];


 const handleLogout = () => {
   Swal.fire({
     title: 'Are you sure?',
     text: 'You will be logged out of your session.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#4f46e5',
     cancelButtonColor: '#94a3b8',
     confirmButtonText: 'Yes, Logout',
   }).then((result) => {
     if (result.isConfirmed) {
       router.push('/login');
     }
   });
 };


 return (
   <div className="min-h-screen bg-slate-50 flex">
     {/* Desktop Sidebar */}
     <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 z-30">
       <div className="p-6 border-b border-slate-100">
         <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-indigo-100">
             ID
           </div>
           <span className="font-bold text-slate-800 text-lg">AdminPanel</span>
         </div>
       </div>


       <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
         {navItems.map((item) => {
           const Icon = item.icon;
           const isActive = pathname === item.href;
           return (
             <Link
               key={item.name}
               href={item.href}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                 isActive
                   ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
               }`}
             >
               <Icon size={20} />
               <span>{item.name}</span>
             </Link>
           );
         })}
       </nav>


       <div className="p-4 border-t border-slate-100">
         <button
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 transition-all"
         >
           <LogOut size={20} />
           <span>Logout</span>
         </button>
       </div>
     </aside>


     {/* Main Content Area */}
     <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen flex flex-col">
       <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</div>
     </main>


     {/* Mobile Floating Bottom Navbar */}
     <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
       <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white rounded-2xl shadow-2xl px-4 py-2 flex items-center justify-around">
         {navItems.map((item) => {
           const Icon = item.icon;
           const isActive = pathname === item.href;
           return (
             <Link
               key={item.name}
               href={item.href}
               className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                 isActive ? 'text-indigo-400 bg-white/10' : 'text-slate-400 hover:text-white'
               }`}
             >
               <Icon size={20} />
               <span className="text-[10px] font-medium">{item.name}</span>
             </Link>
           );
         })}
         <button
           onClick={handleLogout}
           className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-rose-400 hover:text-rose-300 transition-all"
         >
           <LogOut size={20} />
           <span className="text-[10px] font-medium">Logout</span>
         </button>
       </div>
     </div>
   </div>
 );
}

