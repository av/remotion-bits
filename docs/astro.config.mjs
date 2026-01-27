// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import startlightThemeFlexoki from 'starlight-theme-flexoki';

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
            plugins: [
                startlightThemeFlexoki({
                    accentColor: 'orange',
                })
            ],
            title: 'Remotion Bits',
            description: 'Building blocks for your Remotion videos.',
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
                    link: '/docs/getting-started',
                },
                {
                    label: 'Bits',
                    items: [
                        { label: 'Introduction', link: '/docs/bits-catalog' },
                        {
                            label: 'Text Animations',
                            items: [
                                { label: 'Fade In', link: '/docs/bits/fade-in' },
                                { label: 'Slide from Left', link: '/docs/bits/slide-from-left' },
                                { label: 'Word by Word', link: '/docs/bits/word-by-word' },
                                { label: 'Character by Character', link: '/docs/bits/char-by-char' },
                            ]
                        },
                        {
                            label: 'Background Effects',
                            items: [
                                { label: 'Linear Gradient', link: '/docs/bits/linear-gradient' },
                                { label: 'Radial Gradient', link: '/docs/bits/radial-gradient' },
                            ]
                        },
                    ],
                },
            ],
            // customCss: ['./src/styles/custom.css'],
        }),
    ],
});