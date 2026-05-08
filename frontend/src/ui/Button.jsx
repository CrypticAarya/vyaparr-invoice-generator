import React from 'react';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98]',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98]',
  outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98]',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
  md: 'px-5 py-2.5 text-sm font-bold rounded-xl',
  lg: 'px-6 py-3.5 text-base font-black rounded-2xl',
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
