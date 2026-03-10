// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { runRemotionBitsLookupCli } from '../remotion-bits-lookup';

const createIo = () => {
  let stdout = '';
  let stderr = '';

  return {
    io: {
      stdout: {
        write: (value: string) => {
          stdout += value;
        },
      },
      stderr: {
        write: (value: string) => {
          stderr += value;
        },
      },
    },
    getStdout: () => stdout,
    getStderr: () => stderr,
  };
};

describe('remotion bits lookup cli', () => {
  it('prints deterministic JSON results for find', async () => {
    const { io, getStdout, getStderr } = createIo();

    const exitCode = await runRemotionBitsLookupCli(
      ['find', '--query', 'fade in', '--limit', '1', '--json'],
      io
    );

    expect(exitCode).toBe(0);
    expect(getStderr()).toBe('');

    expect(JSON.parse(getStdout())).toEqual({
      results: [
        expect.objectContaining({
          id: 'bit-fade-in',
          name: 'Fade In',
          sourcePath: 'docs/src/bits/examples/animated-text/FadeIn.tsx',
        }),
      ],
    });
  });

  it('accepts repeated and comma-separated tag filters for find', async () => {
    const { io, getStdout } = createIo();

    const exitCode = await runRemotionBitsLookupCli(
      ['find', '--tag', 'text', '--tag', 'fade,basic', '--limit', '1'],
      io
    );

    expect(exitCode).toBe(0);
    expect(getStdout()).toContain('1. bit-fade-in');
    expect(getStdout()).toContain('Tags: text, fade, basic');
  });

  it('fetches a live bit by id in JSON mode', async () => {
    const { io, getStdout, getStderr } = createIo();

    const exitCode = await runRemotionBitsLookupCli(['fetch', 'bit-fade-in', '--json'], io);

    expect(exitCode).toBe(0);
    expect(getStderr()).toBe('');

    expect(JSON.parse(getStdout())).toEqual({
      bit: expect.objectContaining({
        id: 'bit-fade-in',
        name: 'Fade In',
        sourcePath: 'docs/src/bits/examples/animated-text/FadeIn.tsx',
        sourceCode: expect.stringContaining('export const metadata = {'),
      }),
    });
  });

  it('fetches a live bit by exact name in human-readable mode', async () => {
    const { io, getStdout } = createIo();

    const exitCode = await runRemotionBitsLookupCli(['fetch', 'Fade In'], io);

    expect(exitCode).toBe(0);
    expect(getStdout()).toContain('bit-fade-in');
    expect(getStdout()).toContain('Source code:');
    expect(getStdout()).toContain('export const Component: React.FC');
  });

  it('returns a structured JSON error for invalid limits', async () => {
    const { io, getStdout, getStderr } = createIo();

    const exitCode = await runRemotionBitsLookupCli(
      ['find', '--query', 'fade', '--limit', '0', '--json'],
      io
    );

    expect(exitCode).toBe(2);
    expect(getStderr()).toBe('');
    expect(JSON.parse(getStdout())).toEqual({
      error: {
        code: 'invalid-limit',
        message: 'The --limit value must be a positive integer.',
      },
    });
  });

  it('returns a structured JSON error for unknown bits', async () => {
    const { io, getStdout } = createIo();

    const exitCode = await runRemotionBitsLookupCli(['fetch', 'bit-does-not-exist', '--json'], io);

    expect(exitCode).toBe(3);
    expect(JSON.parse(getStdout())).toEqual({
      error: {
        code: 'not-found',
        message: 'No bit found for "bit-does-not-exist".',
      },
    });
  });
});