# Remotion Bits

Remotion component bits distributed as a jsrepo registry. Add ready-made components to your project with jsrepo, or import them directly as a library.

## Overview

Remotion Bits provides small, composable Remotion/React components you can install into your codebase. jsrepo copies component templates into your project so you can customize them, and manages updates over time. This package no longer ships a custom installer—use jsrepo for installs and updates.

## Installation

### npm

```bash
npm install remotion-bits
```

### pnpm

```bash
pnpm add remotion-bits
```

### yarn

```bash
yarn add remotion-bits
```

### bun

```bash
bun add remotion-bits
```

## Install with jsrepo (recommended)

The registry is published as a jsrepo registry at:

```
https://unpkg.com/remotion-bits/registry.json
```

### Initialize the registry

```bash
npx jsrepo init https://unpkg.com/remotion-bits/registry.json
```

### Add components

```bash
npx jsrepo add text-transition
```

### One-off add without init

```bash
npx jsrepo add --registry https://unpkg.com/remotion-bits/registry.json text-transition
```

## Local registry usage (this repo)

When testing against a local checkout, build the registry and use the `fs` provider. A plain filesystem path like `/home/everlier/code/remotion-bits/registry.json` will fail with “A provider for this registry was not found.”

```bash
npm run registry:build
```

Add the `fs` provider in your project’s jsrepo config:

```ts
import { defineConfig } from "jsrepo";
import { fs } from "jsrepo/providers";

export default defineConfig({
  providers: [fs()],
});
```

Then initialize jsrepo with the `fs://` registry path:

```bash
npx jsrepo init fs:///home/everlier/code/remotion-bits/registry.json
```

```bash
npx jsrepo add text-transition
```

## Available components

- `text-transition`
- `background-transition`

## Demo Playground

An interactive playground is available to preview and test all components with real-time property tweaking.

### Run the demo

```bash
cd demo
npm install
npm start
```

This opens Remotion Studio where you can:
- Preview the components in action
- Adjust component properties using the controls panel
- See changes instantly without reloading
- Render the demo video

See [demo/README.md](demo/README.md) for more details on available properties and customization options.

## Default install path

By default, components are added to `src/components`. You can change this in your project’s jsrepo config by setting the `paths.component` value.

## Library usage example import

```ts
import { TextTransition } from "remotion-bits";
```

If you installed components into your project via jsrepo, you can import from your local files, for example:

```ts
import { TextTransition } from "./components/TextTransition";
```

## Directory structure

After installing components into your project, you will typically have:

```
src/
	components/
		TextTransition.tsx
```

## Registry build output (maintainers)

The registry JSON is generated via the repository output and published at the root as registry.json. Build it before publishing:

```bash
npm run registry:build
```

## Contributing

1. Fork the repo and create your branch from `main`.
2. Make changes with clear commit messages.
3. Ensure the build and tests (if any) pass.
4. Open a pull request describing your changes.

## License

MIT
