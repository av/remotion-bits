---
description: This agent can perform remotion-bits release procedures.
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
---
You will aid me in releasing a new version of remotion-bits. Follow these steps:

- In ./package.json - bump the version number to the new version. Bump patch unless I tell you otherwise.
- Update CHANGELOG.md with release notes for the new version (see CHANGELOG format below).
- Run `npm run registry:build` to build the registry
- When build is done, commit current changes with the message: `chore: vX.Y.Z`
- Push the commit to the master branch
- Research changes made since the last release by examining git commit history and PRs merged.
- Open https://github.com/everlier/remotion-bits/releases/new, with query parameters to prefill the new release form (see below). Use XDG open or other system-level open command, not your internal browser.
- After the release is published on GitHub, deploy the docs to Cloudflare by running `./scripts/deploy-docs.sh`.
- Publish the package to NPM by logging into NPM first and then running `npm publish` from the root directory.

### GitHub new release parameter reference

You can use below query parameters to prefill the new release form:

**tag**
The tag name for the Release. For remotion-bits it's always in the format "vX.Y.Z" of the version being released.

**target**
The branch name or commit oid to point the Release's tag at, if the tag doesn't already exist. For remotion-bits it's always "master".

**title**
The name of the Release. For remotion-bits, it's always "vX.Y.Z".

**body**
The description text of the Release.
For remotion-bits, it should match the following structure:
```markdown
## What's Changed

- One short sentence per notable new feature.
- One short sentence per notable bugfix.
- One short sentence per notable improvement.

**Full Changelog**: https://github.com/av/remotion-bits/compare/vX.Y.(Z-1)...vX.Y.Z
```

**prerelease**
Whether the Release should be tagged as a pre-release; valid values are "1" or "true". For remotion-bits, it's always "false".

### Cloudflare Deployment

After creating the GitHub release, deploy the updated docs to Cloudflare:

```bash
cd docs
npm run deploy
```

This deploys the documentation site to Cloudflare Pages using Wrangler.

### NPM Publishing

After Cloudflare deployment, publish the package to npm from the root directory:

```bash
npm publish
```

Ensure you're authenticated with npm before publishing. The authentication token should be configured in your environment.

### CHANGELOG Format

The CHANGELOG.md should follow this structure:

```markdown
### vX.Y.Z

- Feature: Brief description of new feature
- Fix: Brief description of bug fix
- Improvement: Brief description of enhancement
- Docs: Brief description of documentation change
```

When updating the CHANGELOG.md:
1. Add a new version section at the top (after the existing latest version)
2. List changes in categories: Feature, Fix, Improvement, Docs
3. Keep entries concise and user-focused
4. Reference git commits and PRs from recent changes