# Remotion Bits

Remotion component bits with a shadcn-like installer. Use the CLI to copy ready-made components into your project, or import them directly as a library.

## Overview

Remotion Bits provides small, composable Remotion/React components you can install into your codebase. The CLI copies component templates into your project so you can customize them, and generates an index file for simple imports.

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

## CLI usage

The CLI binary is `remotionbits`.

### List available components

```bash
npx remotion-bits@latest list
```

```bash
bunx remotion-bits@latest list
```

### Install components

```bash
npx remotion-bits@latest install text-transition hero-title
```

```bash
bunx remotion-bits@latest install all
```

## npx/bunx examples

```bash
npx remotion-bits@latest install backgrounds --dir src/remotionbits
```

```bash
bunx remotion-bits@latest install all --dir src/remotionbits --overwrite
```

## Available components

- `text-transition`
- `backgrounds`
- `hero-title`

## Install options

- `--dir <path>` or `-d <path>`: Target directory for installed components. Defaults to `src/remotionbits` in your project.
- `--overwrite`: Overwrite existing component files in the target directory.

## Library usage example import

```ts
import { TextTransition, Backgrounds, HeroTitle } from "remotion-bits";
```

If you installed components into your project via the CLI, you can import from the generated local index file, for example:

```ts
import { TextTransition, Backgrounds, HeroTitle } from "./remotionbits";
```

## Directory structure

After installing components into your project, you will typically have:

```
src/
	remotionbits/
		Backgrounds.tsx
		HeroTitle.tsx
		TextTransition.tsx
		index.ts
```

## Contributing

1. Fork the repo and create your branch from `main`.
2. Make changes with clear commit messages.
3. Ensure the build and tests (if any) pass.
4. Open a pull request describing your changes.

## License

MIT
