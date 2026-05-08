import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '' }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors group ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 text-[14px] font-bold text-slate-700 ${className}`}>
    {children}
  </td>
);

export default Table;
