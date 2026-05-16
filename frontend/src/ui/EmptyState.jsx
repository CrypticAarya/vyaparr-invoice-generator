import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 bg-v-accent/5 text-v-accent rounded-3xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
        {description}
      </p>
      {actionText && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
