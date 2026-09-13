export default function DashboardPage() {
 return (
   <div>
     <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <p className="text-sm font-medium text-slate-500">Total Book</p>
         <h3 className="text-3xl font-bold text-slate-800 mt-2">24</h3>
       </div>
       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <p className="text-sm font-medium text-slate-500">Active Users</p>
         <h3 className="text-3xl font-bold text-slate-800 mt-2">1,280</h3>
       </div>
       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <p className="text-sm font-medium text-slate-500">System Status</p>
         <h3 className="text-3xl font-bold text-emerald-600 mt-2">Optimal</h3>
       </div>
     </div>
   </div>
 );
}

