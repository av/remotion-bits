// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [
        react(),
        starlight({
            title: 'Remotion Bits',
            description: 'Beautiful animation components for Remotion',
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
                        { label: 'Introduction', slug: 'getting-started' },
                        { label: 'Installation', slug: 'installation' },
                    ],
                },
                {
                    label: 'Components',
                    items: [
                        { label: 'TextTransition', slug: 'components/text-transition' },
                        { label: 'BackgroundTransition', slug: 'components/background-transition' },
                        { label: 'MotionTransition', slug: 'components/motion-transition' },
                    ],
                },
                {
                    label: 'Utilities',
                    items: [
                        { label: 'Interpolate', slug: 'utilities/interpolate' },
                        { label: 'Easing Functions', slug: 'utilities/easing' },
                        { label: 'Color Utilities', slug: 'utilities/colors' },
                        { label: 'Gradient Utilities', slug: 'utilities/gradients' },
                    ],
                },
                {
                    label: 'Examples',
                    items: [
                        { label: 'Text Animations', slug: 'examples/text-animations' },
                        { label: 'Background Effects', slug: 'examples/background-effects' },
                    ],
                },
            ],
            customCss: ['./src/styles/custom.css'],
        }),
    ],
});