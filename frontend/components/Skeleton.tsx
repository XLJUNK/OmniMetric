import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'pulse' | 'shimmer';
}

export const Skeleton = ({ className = '', variant = 'pulse' }: SkeletonProps) => {
    const baseClass = variant === 'pulse' ? 'skeleton' : 'skeleton-shimmer';
    return (
        <div className={`w-full h-full ${baseClass} ${className}`} />
    );
};

export const SkeletonCard = () => (
    <div className="bg-[#111] border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="h-4 w-1/3 skeleton" />
        <div className="flex-grow flex items-center justify-center">
            <div className="h-12 w-full skeleton-shimmer" />
        </div>
        <div className="h-2 w-full skeleton opacity-50" />
    </div>
);

export const SkeletonPulseTile = () => (
    <div className="bg-[#111] border border-slate-800 rounded-xl p-4 flex flex-col gap-3 h-[180px]">
        <div className="flex justify-between items-start">
            <div className="h-3 w-20 skeleton" />
            <div className="h-3 w-10 skeleton" />
        </div>
        <div className="flex-grow flex items-center">
            <div className="h-8 w-1/2 skeleton-shimmer" />
        </div>
        <div className="h-12 w-full skeleton opacity-30" />
    </div>
);
