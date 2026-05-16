import React from 'react';

/**
 * PRODUCTION SKELETON COMPONENT
 * 
 * Used for "Perceived Performance". Instead of blank screens or spinners, 
 * we show structural placeholders that match the UI.
 */
export const Skeleton = ({ className, height, width, circle }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200/60 ${circle ? 'rounded-full' : 'rounded-xl'} ${className}`}
      style={{ height: height || '1rem', width: width || '100%' }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="premium-card p-6 space-y-4">
    <Skeleton width="40%" height="0.75rem" />
    <Skeleton width="80%" height="1.5rem" />
    <div className="pt-4 flex gap-2">
      <Skeleton width="30%" height="0.5rem" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 py-4 border-b border-slate-50">
        <Skeleton width="15%" />
        <Skeleton width="35%" />
        <Skeleton width="20%" />
        <Skeleton width="10%" />
        <Skeleton width="20%" />
      </div>
    ))}
  </div>
);

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-v-accent/20 border-t-v-accent rounded-full animate-spin"></div>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Initialising Workspace...</p>
  </div>
);
