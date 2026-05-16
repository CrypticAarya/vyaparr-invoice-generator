import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetchApi('/audit');
        setLogs(res.data.logs);
      } catch (err) {
        addToast('Failed to retrieve security logs', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [addToast]);

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'text-rose-500 bg-rose-50';
    if (action.includes('CREATE')) return 'text-emerald-500 bg-emerald-50';
    if (action.includes('LOGIN')) return 'text-indigo-500 bg-indigo-50';
    return 'text-slate-500 bg-slate-50';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security & Activity Logs</h1>
        <p className="text-xs font-medium text-slate-500">A transparent record of all critical actions performed on your workspace.</p>
      </header>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-sm text-slate-400 font-medium italic">
                    No activity recorded yet.
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-slate-700">
                    {log.entity || 'SYSTEM'}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-400">
                    {log.ipAddress || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500 max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
