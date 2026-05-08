import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-indigo-600" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 font-bold max-w-sm mx-auto mb-8">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="lg">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
