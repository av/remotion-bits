import React from 'react';
import { ShowcasePlayer, withShowcaseFill } from './ShowcasePlayer';
import { getBit, type BitName } from '@bits';

interface ComponentBitsShowcaseProps {
  bitSlugs: BitName[];
}

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

export const ComponentBitsShowcase: React.FC<ComponentBitsShowcaseProps> = ({ bitSlugs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8"
      style={{
        height: '250px'
      }}
    >
      {bitSlugs.map((bitName) => {
        const bit = getBit(bitName);
        if (!bit) return null;

        const slug = BIT_SLUG_MAP[bitName];

        return (
          <a
            key={bitName}
            href={`/docs/bits/${slug}`}
            className="group block relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.03] shadow-lg hover:shadow-xl"
          >
            <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
              <ShowcasePlayer
                component={withShowcaseFill(bit.Component)}
                duration={bit.metadata.duration}
                width={bit.metadata.width ?? 1920}
                height={bit.metadata.height ?? 1080}
                controls={false}
                autoPlay={true}
                loop={true}
                autoResize={true}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
            </div>
          </a>
        );
      })}
    </div>
  );
};
