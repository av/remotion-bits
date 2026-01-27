import React from 'react';
import { HeroShowcase } from './showcases/HeroShowcase';

export const HomeShowcase = () => {
    return (
        <div className="relative rounded-xl border border-white/10 bg-surface-dark shadow-[0_0_50px_-10px_rgba(255,85,0,0.15)] overflow-hidden h-[600px] ring-1 ring-white/5 bg-[#0C0C0C]">
             <HeroShowcase />
        </div>
    );
};
