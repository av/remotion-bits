// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import startlightThemeFlexoki from 'starlight-theme-flexoki';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to generate Bits sidebar dynamically
function getBitsSidebar() {
    const bitsDir = path.resolve(__dirname, './src/content/docs/bits');
    if (!fs.existsSync(bitsDir)) return [];

    const files = fs.readdirSync(bitsDir).filter(f => f.endsWith('.mdx'));
    const categories = {};

    files.forEach(file => {
        const content = fs.readFileSync(path.join(bitsDir, file), 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title:\s*(.*)/);
            const categoryMatch = frontmatter.match(/category:\s*(.*)/);

            const title = titleMatch ? titleMatch[1].trim() : file;
            const category = categoryMatch ? categoryMatch[1].trim() : 'Uncategorized';
            const link = `/docs/bits/${file.replace('.mdx', '')}`;

            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({ label: title, link });
        }
    });

    // Define preferred order for categories
    const orderedCategories = ['Text Animations', 'Background Effects', 'Particles', '3D Scenes'];
    const sidebarItems = [{ label: 'Introduction', link: '/docs/bits-catalog' }];

    // Add ordered categories first
    orderedCategories.forEach(cat => {
        if (categories[cat]) {
            sidebarItems.push({
                label: cat,
                items: categories[cat]
            });
            delete categories[cat];
        }
    });

    // Add any remaining categories
    Object.keys(categories).forEach(cat => {
        sidebarItems.push({
            label: cat,
            items: categories[cat]
        });
    });

    return sidebarItems;
}

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
            include: ['react', 'react-dom', 'remotion', '@remotion/player'],
            exclude: ['remotion-bits'],
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
                    label: 'Reference',
                    items: [
                        {
                            label: 'Components',
                            items: [
                                { label: 'Animated Text', link: '/docs/reference/animated-text' },
                                { label: 'Staggered Motion', link: '/docs/reference/staggered-motion' },
                                { label: 'Gradient Transition', link: '/docs/reference/gradient-transition' },
                                { label: 'Particle System', link: '/docs/reference/particle-system' },
                                { label: 'Scene3D', link: '/docs/reference/scene3d' },
                                { label: 'Step', link: '/docs/reference/step' },
                                { label: 'Element3D', link: '/docs/reference/element3d' },
                            ]
                        },
                        {
                            label: 'Hooks',
                            items: [
                                { label: 'useViewportRect', link: '/docs/reference/use-viewport-rect' },
                                { label: 'useScene3D', link: '/docs/reference/use-scene3d' },
                                { label: 'useCamera', link: '/docs/reference/use-camera' },
                                { label: 'useActiveStep', link: '/docs/reference/use-active-step' },
                            ]
                        },
                        {
                            label: 'Utilities',
                            items: [
                                { label: 'Interpolation', link: '/docs/reference/utils-interpolation' },
                                { label: 'Geometry', link: '/docs/reference/utils-geometry' },
                                { label: 'Motion', link: '/docs/reference/utils-motion' },
                                { label: 'Random', link: '/docs/reference/utils-random' },
                            ]
                        }
                    ]
                },
                {
                    label: 'Bits',
                    items: getBitsSidebar(),
                },
            ],
            // customCss: ['./src/styles/custom.css'],
        }),
    ],
});