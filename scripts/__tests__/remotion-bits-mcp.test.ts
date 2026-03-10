// @vitest-environment node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { describe, expect, it } from 'vitest';

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
const tsxCliPath = path.join(repositoryRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const serverScriptPath = path.join(repositoryRoot, 'scripts', 'remotion-bits-mcp.ts');

const createClient = async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [tsxCliPath, serverScriptPath],
    cwd: repositoryRoot,
    stderr: 'pipe',
  });

  let stderr = '';
  const stderrStream = transport.stderr;
  if (stderrStream) {
    stderrStream.on('data', (chunk) => {
      stderr += chunk.toString();
    });
  }

  const client = new Client({
    name: 'remotion-bits-test-client',
    version: '1.0.0',
  });

  await client.connect(transport);

  return {
    client,
    getStderr: () => stderr,
    close: async () => {
      await client.close();
    },
  };
};

describe('remotion bits mcp server', () => {
  it('exposes exactly the two required tools', async () => {
    const session = await createClient();

    try {
      const result = await session.client.listTools();

      expect(result.tools.map((tool) => tool.name)).toEqual([
        'find_remotion_bits',
        'fetch_remotion_bit',
      ]);
      expect(result.tools).toHaveLength(2);
      expect(session.getStderr()).toContain('remotion-bits MCP server running on stdio');
    } finally {
      await session.close();
    }
  });

  it('returns shared catalog discovery results from find_remotion_bits', async () => {
    const session = await createClient();

    try {
      const result = await session.client.callTool({
        name: 'find_remotion_bits',
        arguments: {
          query: 'camera presentation',
          tags: ['scene-3d'],
          limit: 2,
        },
      });

      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual({
        results: [
          expect.objectContaining({
            id: expect.stringContaining('bit-'),
            sourcePath: expect.stringContaining('docs/src/bits/examples/scene-3d/'),
          }),
        ],
      });
      expect(result.content[0]).toMatchObject({
        type: 'text',
      });
    } finally {
      await session.close();
    }
  });

  it('returns a full bit record from fetch_remotion_bit', async () => {
    const session = await createClient();

    try {
      const result = await session.client.callTool({
        name: 'fetch_remotion_bit',
        arguments: {
          id: 'bit-fade-in',
        },
      });

      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual({
        bit: expect.objectContaining({
          id: 'bit-fade-in',
          name: 'Fade In',
          sourcePath: 'docs/src/bits/examples/animated-text/FadeIn.tsx',
          sourceCode: expect.stringContaining('export const metadata = {'),
        }),
      });
    } finally {
      await session.close();
    }
  });

  it('rejects malformed MCP input for find_remotion_bits', async () => {
    const session = await createClient();

    try {
      await expect(
        session.client.callTool({
          name: 'find_remotion_bits',
          arguments: {
            limit: 0,
          },
        })
      ).rejects.toThrow('The limit field must be a positive integer.');
    } finally {
      await session.close();
    }
  });
});