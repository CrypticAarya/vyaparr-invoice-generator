import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

/**
 * CONFIRM DIALOG
 * 
 * A production-grade replacement for window.confirm().
 * Supports: destructive (delete), warning, and neutral variants.
 * 
 * Usage:
 *   <ConfirmDialog
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Client"
 *     message="This will permanently remove the client and all related records."
 *     variant="danger"
 *     confirmText="Yes, Delete"
 *   />
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'neutral'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      confirmVariant: 'danger',
    },
    warning: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmVariant: 'primary',
    },
    neutral: {
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmVariant: 'primary',
    },
  };

  const config = variantConfig[variant];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className={`w-12 h-12 rounded-2xl ${config.iconBg} ${config.iconColor} flex items-center justify-center mb-5`}>
              {config.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-[14px] font-medium text-slate-500 leading-relaxed">{message}</p>
          </div>

          <div className="px-8 pb-8 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              onClick={() => { onConfirm(); onClose(); }}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
