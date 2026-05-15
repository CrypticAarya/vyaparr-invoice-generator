import React from 'react';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] active:scale-[0.98]',
  secondary: 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-700 active:scale-[0.98]',
  outline: 'bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 active:scale-[0.98]',
  ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-[0.98]',
  danger: 'bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white active:scale-[0.98]',
  accent: 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl',
  lg: 'px-6 py-3 text-base font-bold rounded-2xl',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false, 
  icon: Icon,
  ...props 
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
