// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    vite: {
      resolve: {
        dedupe: ['react', 'react-dom', 'remotion', '@remotion/player', 'remotion-bits'],
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@components': path.resolve(__dirname, './src/components'),
          '@showcases': path.resolve(__dirname, './src/components/showcases'),
          '@bits': path.resolve(__dirname, './src/bits'),
          'remotion-bits': path.resolve(__dirname, '../src/index.ts'),
        },
      },
      ssr: {
          noExternal: ['remotion', '@remotion/player', 'remotion-bits'],
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'remotion', '@remotion/player', 'remotion-bits'],
      },

      plugins: [tailwindcss()],
    },
    integrations: [
        react(),
        starlight({
            title: 'Remotion Bits',
            description: 'Beautiful animation components for Remotion',
            disable404Route: true,
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/av/remotion-bits',
                },
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    items: [
                        { label: 'Introduction', link: '/docs/getting-started' },
                        { label: 'Installation', link: '/docs/installation' },
                    ],
                },
                {
                    label: 'Bits Catalog',
                    link: '/docs/bits-catalog',
                },
                {
                    label: 'Components',
                    items: [
                        { label: 'TextTransition', link: '/docs/components/text-transition' },
                        { label: 'BackgroundTransition', link: '/docs/components/background-transition' },
                        { label: 'MotionTransition', link: '/docs/components/motion-transition' },
                    ],
                },
                {
                    label: 'Utilities',
                    items: [
                        { label: 'Interpolate', link: '/docs/utilities/interpolate' },
                        { label: 'Easing Functions', link: '/docs/utilities/easing' },
                        { label: 'Color Utilities', link: '/docs/utilities/colors' },
                        { label: 'Gradient Utilities', link: '/docs/utilities/gradients' },
                    ],
                },
                {
                    label: 'Examples',
                    items: [
                        { label: 'Text Animations', link: '/docs/examples/text-animations' },
                        { label: 'Background Effects', link: '/docs/examples/background-effects' },
                    ],
                },
            ],
            customCss: ['./src/styles/custom.css'],
        }),
    ],
});