import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        {/* Mobile Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        <div className="relative w-full hidden sm:block">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search records..." 
            className="w-full bg-slate-50 border border-transparent rounded-lg pl-10 pr-4 py-1.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-300 transition-all outline-none"
          />
        </div>
      </div>

      {/* User & Notifications */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Support Link */}
        <a href="#" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Support
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
          <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border border-white rounded-full"></div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter truncate max-w-[100px]">{user?.businessName || 'Business Account'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
}
