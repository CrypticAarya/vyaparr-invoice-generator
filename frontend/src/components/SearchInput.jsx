import React from 'react';

/**
 * PRODUCTION SEARCH COMPONENT
 * 
 * A high-end search input with consistent styling, 
 * clear action, and subtle focus animations.
 */
export default function SearchInput({ value, onChange, placeholder = "Search records...", className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-v-accent transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all focus:border-v-accent/30 focus:ring-4 focus:ring-v-accent/10 placeholder:text-slate-400"
      />
    </div>
  );
}
