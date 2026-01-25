# Remotion Bits Documentation

Documentation site for [Remotion Bits](../README.md) - Beautiful animation components for Remotion.

Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`

## Build

```bash
npm run build
```

Output: `dist/` folder (ready for static hosting)

## Features

- ✅ Custom landing page at `/`
- ✅ Docs at `/docs/*` with Starlight
- ✅ Live showcases with @remotion/player
- ✅ Built-in search
- ✅ Responsive design
- ✅ Static output for CloudFlare Pages

## Structure

```
src/
├── components/          # React components
│   ├── ShowcasePlayer.tsx
│   └── showcases/       # Live examples
├── content/docs/        # MDX documentation
├── pages/               # Custom pages
└── styles/              # CSS
```

## Deploy

Works with Cloudflare Pages, Vercel, Netlify, GitHub Pages, etc.

Build command: `npm run build`  
Output directory: `dist`
