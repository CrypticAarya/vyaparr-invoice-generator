import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <nav className="h-24 bg-v-bg/60 backdrop-blur-xl sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
      {/* Mobile Toggle */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-3 text-zinc-500 hover:bg-black/5 rounded-2xl transition-all mr-4"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Greetings */}
      <div className="flex-1">
        <h2 className="sketch-title text-2xl font-bold tracking-tight">
          Hey, {user?.name?.split(' ')[0] || 'Sarthak'} 👋
        </h2>
        <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Welcome back to your workspace.</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-v-mint/50 border border-black/[0.03] rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">AI Live</p>
        </div>

        {/* Notifications */}
        <button className="p-3 text-zinc-500 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-black/5 shadow-sm hover:shadow-md relative group">
          <div className="absolute top-3 right-3 w-2 h-2 bg-v-accent border-2 border-v-bg rounded-full group-hover:scale-125 transition-transform"></div>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>

        {/* Quick Action Button */}
        <button className="hidden sm:flex items-center gap-2 btn-premium btn-premium-primary py-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          <span className="font-bold">New Flow</span>
        </button>
      </div>
    </nav>
  );
}
