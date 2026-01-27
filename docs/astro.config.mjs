// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black';

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
            plugins: [starlightThemeBlack({
                footerText: `Remotion Bits / ${new Date().getFullYear()}`,
                navLinks: [
                    {
                        label: 'GitHub',
                        link: 'https://github.com/av/remotion-bits',
                    }
                ]
            })],
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
                    link: '/docs/getting-started',
                },
                {
                    label: 'Bits Catalog',
                    link: '/docs/bits-catalog',
                },
            ],
            customCss: ['./src/styles/custom.css'],
        }),
    ],
});