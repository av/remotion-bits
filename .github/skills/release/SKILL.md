---
name: release
description: 'Release remotion-bits to GitHub, Cloudflare, and npm. Use when bumping the package version, updating CHANGELOG.md, building the registry, creating the release commit, pushing master, opening a prefilled GitHub release form, deploying docs, and publishing to npm.'
argument-hint: 'Optional target version or bump type, for example: patch, minor, major, or 0.1.15'
---

# Remotion Bits Release

Use this skill when preparing and publishing a new remotion-bits release from this repository.

## What This Skill Does

This skill performs the full release workflow:

1. Bump the version in `./package.json`. Default to a patch bump unless the user explicitly requests minor, major, or a specific version.
2. Update `CHANGELOG.md` with concise release notes for the new version.
3. Run `npm run registry:build`.
4. Commit the release changes with `chore: vX.Y.Z`.
5. Push the release commit to `master`.
6. Research notable changes since the previous release from git history and merged PRs.
7. Open the prefilled GitHub release form with system-level browser opening, not the internal browser.
8. After the GitHub release is published, deploy docs with `./scripts/deploy-docs.sh`.
9. Publish the package to npm with `npm publish`.

## Preconditions

- Work from the repository root.
- Do not start the docs dev server.
- Assume release publishing requires valid GitHub, Cloudflare, and npm credentials already configured in the environment.
- If the working tree contains unrelated user changes, do not revert them. Either work around them or stop and ask before touching them if they affect the release files.

## Release Workflow

### 1. Determine The Target Version

- Read the current version from `./package.json`.
- If the user gave a specific version, use it.
- If the user gave a bump type, apply it.
- Otherwise bump patch.
- The git tag and release title must be `vX.Y.Z`.

### 2. Prepare Release Notes

- Review commits since the last released tag.
- Review merged PRs when they help summarize the changes.
- Update `CHANGELOG.md` by inserting the new version section at the top.
- Keep entries concise and user-facing.
- Use this format:

```markdown
### vX.Y.Z

- Feature: Brief description of new feature
- Fix: Brief description of bug fix
- Improvement: Brief description of enhancement
- Docs: Brief description of documentation change
```

### 3. Bump Version And Build Registry

- Update `./package.json` to the new version.
- Run:

```bash
npm run registry:build
```

- If the build fails, stop and fix the underlying problem before continuing.

### 4. Commit And Push The Release

- Review the release diff.
- Commit the prepared release with:

```bash
git commit -am "chore: vX.Y.Z"
```

- Push the commit to `master`.
- If the repo is behind remote or push fails, resolve that state before continuing.

### 5. Draft The GitHub Release

- Build release notes from the changelog summary and recent commits.
- Open this URL with `xdg-open` or another system-level open command, never the internal browser:

```text
https://github.com/everlier/remotion-bits/releases/new?tag=vX.Y.Z&target=master&title=vX.Y.Z&body=...
```

- Prefill the form with:
  - `tag`: `vX.Y.Z`
  - `target`: `master`
  - `title`: `vX.Y.Z`
  - `prerelease`: `false`

- The release body should follow this structure:

```markdown
## What's Changed

- One short sentence per notable new feature.
- One short sentence per notable bugfix.
- One short sentence per notable improvement.

**Full Changelog**: https://github.com/everlier/remotion-bits/compare/vX.Y.(Z-1)...vX.Y.Z
```

- Pause for the user to publish the GitHub release if browser confirmation is required.

### 6. Deploy Docs

- After the GitHub release is published, run:

```bash
./scripts/deploy-docs.sh
```

### 7. Publish To npm

- Confirm npm authentication is available.
- Publish from the repository root:

```bash
npm publish
```

## Decision Rules

- Default to patch releases unless the user says otherwise.
- If release notes are unclear, derive them from commit history before asking the user.
- If a command mutates release artifacts, keep those generated changes in the release commit.
- If publishing requires a manual browser step, stop at the boundary, tell the user exactly what is waiting, then continue after confirmation.
- If credentials are missing for GitHub, Cloudflare, or npm, stop and report the missing prerequisite instead of retrying blindly.

## Completion Checklist

- `package.json` has the target version.
- `CHANGELOG.md` has a new topmost section for that version.
- `npm run registry:build` completed successfully.
- Release commit `chore: vX.Y.Z` exists and is pushed to `master`.
- GitHub release form was opened with the correct prefilled values.
- Docs deployment completed.
- `npm publish` completed successfully.