'use client';


import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';




export default function LoginPage() {
 const router = useRouter();
 const [email, setEmail] = useState < string > ('');
 const [password, setPassword] = useState < string > ('');
 const [errors, setErrors] = useState < Record < string, string>> ({});
 const [successMsg, setSuccessMsg] = useState("");
 const [loading, setLoading] = useState(false);




 const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   setErrors({});
   setSuccessMsg("");
   setLoading(true);
  
   try {
     const res = await fetch("/api/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ email, password }),
     });
     const data = await res.json();


     if (!res.ok) {
       if (data.errors) {
         setErrors(data.errors);
       } else {
         setErrors({ form: data.message || "Something went wrong" });
       }
     } else {
       setSuccessMsg(data.message || "Login successful!");
       router.push('/admin');
     }
   } catch (error) {
     setErrors({ form: "Network error occurred. Please try again." });
   } finally {
     setLoading(false);
   }

 };


 return (
   <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
     <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
       <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl mb-4 shadow-lg shadow-indigo-200">
           ID
         </div>
         <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
         <p className="text-sm text-slate-500 mt-1">Sign in to access your admin panel</p>
       </div>


       {successMsg && (
         <div className="mb-6 p-4 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-medium border border-emerald-200">
           {successMsg}
         </div>
       )}

       {errors.form && (
         <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 text-sm font-medium border border-red-200">
           {errors.form}
         </div>
       )}



       <form onSubmit={handleLogin} className="space-y-5">
         <div>
           <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
           <div className="relative">
             <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
               <Mail size={18} />
             </span>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
               placeholder=""
             />
             {errors.email && (
               <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
             )}
           </div>
         </div>
         <div>
           <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
           <div className="relative">
             <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
               <Lock size={18} />
             </span>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
               placeholder=""
             />
             {errors.password && (
               <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
             )}
           </div>
         </div>
         <button
           type="submit"
           disabled={loading}
           className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
         >
           <span>{loading ? "Processing..." : "Sign In"}</span>
           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
       </form>
     </div>
   </div>
 );
}

