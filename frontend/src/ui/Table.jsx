import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
  <tr className={`hover:bg-v-accent/[0.01] transition-all group ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-5 text-[13px] font-medium text-slate-600 ${className}`}>
    {children}
  </td>
);

export default Table;
