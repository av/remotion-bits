import React from 'react';
import { ShowcasePlayer, withShowcaseFill } from '../ShowcasePlayer';
import { bits, type BitName } from '../../bits';

// Mapping of bit names to their documentation slugs
const BIT_SLUG_MAP: Record<BitName, string> = {
    FadeIn: 'fade-in',
    WordByWord: 'word-by-word',
    CharByChar: 'char-by-char',
    BlurSlideWord: 'blur-slide-word',
    StaggeredFadeIn: 'staggered-fade-in',
    SlideFromLeft: 'slide-from-left',
    LinearGradient: 'linear-gradient',
    RadialGradient: 'radial-gradient',
    ConicGradient: 'conic-gradient',
    ParticlesSnow: 'particles-snow',
    ParticlesFountain: 'particles-fountain',
    ParticlesGrid: 'particles-grid',
    Scene3DPresentation: 'basic-3d',
    FlyingThroughWords: 'flying-through-words',
    Elements3D: '3d-elements',
};

interface HeroShowcaseProps {
    bitNames: BitName[];
    layout?: 'grid' | 'row';
    className?: string;
}

const ShowcaseItem: React.FC<{ bitName: BitName; className?: string }> = ({ bitName, className }) => {
    const module = bits[bitName];
    const slug = BIT_SLUG_MAP[bitName];

    if (!module) return null;

    return (
        <a
            href={`/docs/bits/${slug}`}
            className={`group relative block overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-lg transition-all hover:border-primary hover:shadow-primary/20 aspect-video ${className || ''}`}
        >
            <div className="absolute inset-0 w-full h-full">
                <ShowcasePlayer
                    component={withShowcaseFill(module.Component)}
                    duration={module.metadata.duration}
                    width={module.metadata.width ?? 1920}
                    height={module.metadata.height ?? 1080}
                    controls={false}
                    autoPlay={true}
                    loop={true}
                    autoResize={true}
                    className="w-full h-full opacity-80 transition-opacity group-hover:opacity-100"
                />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        </a>
    );
};

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ bitNames, layout = 'grid', className }) => {
    const isRow = layout === 'row';

    return (
        <div
            className={`w-full ${
                isRow
                    ? 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory'
                    : 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'
            } ${className || ''}`}
        >
            {bitNames.map((bitName) => (
                <ShowcaseItem
                    key={bitName}
                    bitName={bitName}
                    className={isRow ? 'w-80 min-w-[20rem] snap-center' : 'w-full'}
                />
            ))}
        </div>
    );
};
