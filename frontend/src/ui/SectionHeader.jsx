import React from 'react';

const SectionHeader = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 ${className}`}>
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="text-zinc-500 font-semibold mt-2">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default SectionHeader;
