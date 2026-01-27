import React from 'react';
import { ShowcasePlayer } from '../ShowcasePlayer';
import { bits } from '../../bits';

// Helper to get slug from bit name (assuming kebab-case file names in content/docs/bits)
// Keys in `bits` object match the export names in `docs/src/bits/index.ts`
const BITS_LIST = [
    { module: bits.CharByChar, slug: 'char-by-char' },
    { module: bits.FadeIn, slug: 'fade-in' },
    { module: bits.LinearGradient, slug: 'linear-gradient' },
    { module: bits.RadialGradient, slug: 'radial-gradient' },
    { module: bits.SlideFromLeft, slug: 'slide-from-left' },
    { module: bits.WordByWord, slug: 'word-by-word' },
];

export const HeroShowcase: React.FC = () => {
    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                {BITS_LIST.map(({ module, slug }) => (
                    <a
                        key={slug}
                        href={`/bits/${slug}`}
                        className="block group relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-white/10 hover:border-primary transition-all hover:scale-[1.02] shadow-lg"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            <ShowcasePlayer
                                component={module.Component}
                                duration={module.metadata.duration}
                                width={module.metadata.width ?? 1920}
                                height={module.metadata.height ?? 1080}
                                controls={false}
                                autoPlay={true}
                                loop={true}
                                autoResize={true}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="text-sm font-mono font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {module.metadata.name}
                            </span>
                             <p className="text-xs text-gray-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                {module.metadata.description}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
