// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    vite: {
        ssr: {
            noExternal: ['remotion', '@remotion/player'],
        },
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
                    href: 'https://github.com/yourusername/remotion-bits',
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