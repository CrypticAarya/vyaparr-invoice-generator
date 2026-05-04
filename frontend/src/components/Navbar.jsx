import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user } = useAuth();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <nav className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
      {/* Search & Intelligence */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-slate-900/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search records, invoices, or AI commands..." 
            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-[14px] font-bold text-slate-900 placeholder-slate-400 focus:ring-0 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Global Context Area */}
      <div className="flex items-center gap-8">
        {/* Health Status */}
        <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100/50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Business Healthy</span>
        </div>

        {/* Notifications */}
        <button className="relative p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full z-10"></div>
          <svg className="w-6 h-6 text-slate-500 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>

        {/* User Profile - Premium */}
        <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-black text-slate-900 leading-none">{user?.name || 'Business Pro'}</p>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.businessName || 'Vyapar Flow'}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20"
          >
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <span className="text-indigo-600 font-black text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'V'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
