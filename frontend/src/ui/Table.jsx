import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1E1E24]">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/30">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-zinc-800/30 transition-colors group ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 text-[13px] font-semibold text-zinc-300 ${className}`}>
    {children}
  </td>
);

export default Table;
