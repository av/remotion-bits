import { createRequire } from 'node:module';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  type CallToolResult,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { fetchBit, findBits } from '../catalog/runtime';
import type {
  FindBitsOptions,
  RemotionBitCatalogEntry,
  RemotionBitCatalogSummary,
} from '../catalog/contracts';

type JsonObject = Record<string, unknown>;

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json') as { version?: string };

const isRecord = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assertString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `The ${fieldName} field must be a non-empty string.`
    );
  }

  return value;
};

const assertOptionalString = (value: unknown, fieldName: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, `The ${fieldName} field must be a string.`);
  }

  return value;
};

const assertOptionalTags = (value: unknown): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.some((tag) => typeof tag !== 'string')) {
    throw new McpError(ErrorCode.InvalidParams, 'The tags field must be an array of strings.');
  }

  return value;
};

const assertOptionalLimit = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new McpError(ErrorCode.InvalidParams, 'The limit field must be a positive integer.');
  }

  return value;
};

const parseFindArguments = (value: unknown): FindBitsOptions => {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'find_remotion_bits arguments must be an object.'
    );
  }

  return {
    query: assertOptionalString(value.query, 'query'),
    tags: assertOptionalTags(value.tags),
    limit: assertOptionalLimit(value.limit),
  };
};

const parseFetchArguments = (value: unknown): { id: string } => {
  if (!isRecord(value)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'fetch_remotion_bit arguments must be an object.'
    );
  }

  return {
    id: assertString(value.id, 'id'),
  };
};

const toTextContent = (
  payload: { results: RemotionBitCatalogSummary[] } | { bit: RemotionBitCatalogEntry }
) => [
  {
    type: 'text' as const,
    text: JSON.stringify(payload, null, 2),
  },
];

const createSuccessResult = (
  payload: { results: RemotionBitCatalogSummary[] } | { bit: RemotionBitCatalogEntry }
): CallToolResult => ({
  content: toTextContent(payload),
  structuredContent: payload,
});

const createErrorResult = (message: string): CallToolResult => ({
  isError: true,
  content: [
    {
      type: 'text',
      text: message,
    },
  ],
});

const toolDefinitions: Tool[] = [
  {
    name: 'find_remotion_bits',
    title: 'Find Remotion Bits',
    description: 'Search the live Remotion Bits catalog by visual goal, tags, and result limit.',
    annotations: {
      title: 'Find Remotion Bits',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        query: {
          type: 'string',
          description: 'Free-text visual goal or style query.',
        },
        tags: {
          type: 'array',
          description: 'Optional tag filter applied with AND semantics.',
          items: { type: 'string' },
        },
        limit: {
          type: 'integer',
          description: 'Maximum number of results to return.',
          minimum: 1,
        },
      },
    },
  },
  {
    name: 'fetch_remotion_bit',
    title: 'Fetch Remotion Bit',
    description:
      'Fetch one live Remotion Bit by id, including metadata, source path, and source code.',
    annotations: {
      title: 'Fetch Remotion Bit',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
          description: 'The bit id returned by find_remotion_bits.',
        },
      },
      required: ['id'],
    },
  },
];

export const createRemotionBitsMcpServer = (): Server => {
  const server = new Server(
    {
      name: 'remotion-bits',
      version: packageJson.version ?? '0.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
      instructions:
        'Use find_remotion_bits first, then fetch_remotion_bit for the best one or two matches. Adapt examples before composing from primitives.',
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: input } = request.params;

    if (name === 'find_remotion_bits') {
      return createSuccessResult({ results: findBits(parseFindArguments(input)) });
    }

    if (name === 'fetch_remotion_bit') {
      const { id } = parseFetchArguments(input);
      const bit = await fetchBit(id);

      if (!bit) {
        return createErrorResult(`No bit found for "${id}".`);
      }

      return createSuccessResult({ bit });
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  });

  return server;
};

export const startRemotionBitsMcpServer = async (): Promise<void> => {
  const server = createRemotionBitsMcpServer();
  const transport = new StdioServerTransport();

  const shutdown = async () => {
    await server.close();
  };

  process.on('SIGINT', () => {
    void shutdown().finally(() => {
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    void shutdown().finally(() => {
      process.exit(0);
    });
  });

  await server.connect(transport);
  console.error('remotion-bits MCP server running on stdio');
};