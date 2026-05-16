import React from 'react';

const variants = {
  primary: 'bg-v-accent text-white hover:opacity-90 shadow-sm shadow-v-accent/20',
  secondary: 'bg-white text-slate-700 border border-black/10 hover:bg-slate-50 shadow-sm',
  outline: 'bg-transparent border border-black/10 text-slate-600 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200',
  accent: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20',
};

const sizes = {
  sm: 'px-4 py-2 text-[12px]',
  md: 'px-6 py-3 text-[14px]',
  lg: 'px-8 py-4 text-[16px]',
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
        btn-premium
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
      ) : Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
