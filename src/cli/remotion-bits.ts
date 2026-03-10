import { parseArgs } from 'node:util';

import { fetchBit, findBits, resolveBitCatalogIdentifier } from '../catalog/runtime';
import type {
  RemotionBitCatalogEntry,
  RemotionBitCatalogSummary,
} from '../catalog/contracts';
import { startRemotionBitsMcpServer } from '../mcp/remotion-bits';

type Writable = {
  write: (value: string) => void;
};

interface CliIo {
  stdout: Writable;
  stderr: Writable;
}

class CliError extends Error {
  public readonly exitCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    exitCode: number,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CliError';
    this.exitCode = exitCode;
    this.code = code;
    this.details = details;
  }
}

const EXIT_SUCCESS = 0;
const EXIT_INVALID_INPUT = 2;
const EXIT_NOT_FOUND = 3;

const usage = `Usage:
  remotion-bits find [query] [--query <text>] [--tag <tag>] [--tags <tag1,tag2>] [--limit <number>] [--json]
  remotion-bits fetch <id-or-name> [--id <id-or-name>] [--json]
  remotion-bits mcp

Commands:
  find   Search the published Remotion Bits catalog.
  fetch  Retrieve one published bit record, including source code.
  mcp    Start the Remotion Bits MCP server on stdio.

Options:
  --query, -q   Text query for find.
  --tag, -t     Filter by tag. Repeatable. Comma-separated values are accepted.
  --tags        Alias for --tag.
  --limit, -l   Maximum number of find results.
  --id, -i      Bit id or exact display name to fetch.
  --json, -j    Emit deterministic JSON output.
  --help, -h    Show usage.
`;

const dedupeStrings = (values: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      deduped.push(value);
    }
  }

  return deduped;
};

const collectTags = (values: Array<string | undefined>): string[] =>
  dedupeStrings(
    values
      .flatMap((value) => (value ?? '').split(','))
      .map((value) => value.trim())
      .filter(Boolean)
  );

const parseLimit = (value: string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1) {
    throw new CliError(
      'The --limit value must be a positive integer.',
      EXIT_INVALID_INPUT,
      'invalid-limit'
    );
  }

  return limit;
};

const serializeSummary = (entry: RemotionBitCatalogSummary) => ({
  id: entry.id,
  exportName: entry.exportName,
  name: entry.name,
  description: entry.description,
  tags: [...entry.tags],
  duration: entry.duration,
  width: entry.width,
  height: entry.height,
  sourcePath: entry.sourcePath,
  componentNames: [...entry.componentNames],
  registryDependencies: [...entry.registryDependencies],
});

const serializeEntry = (entry: RemotionBitCatalogEntry) => ({
  ...serializeSummary(entry),
  sourceCode: entry.sourceCode,
});

const stringifyJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

const formatTags = (tags: string[]): string => (tags.length > 0 ? tags.join(', ') : 'none');

const formatDimensions = (entry: RemotionBitCatalogSummary): string => {
  if (entry.width === undefined || entry.height === undefined) {
    return 'auto';
  }

  return `${entry.width}x${entry.height}`;
};

const formatSummaryBlock = (entry: RemotionBitCatalogSummary, index?: number): string => {
  const header = index === undefined ? entry.id : `${index + 1}. ${entry.id}`;

  return [
    header,
    `   Name: ${entry.name}`,
    `   Export: ${entry.exportName}`,
    `   Description: ${entry.description}`,
    `   Tags: ${formatTags(entry.tags)}`,
    `   Duration: ${entry.duration}`,
    `   Dimensions: ${formatDimensions(entry)}`,
    `   Source: ${entry.sourcePath}`,
    `   Components: ${formatTags(entry.componentNames)}`,
    `   Registry dependencies: ${formatTags(entry.registryDependencies)}`,
  ].join('\n');
};

const formatEntryBlock = (entry: RemotionBitCatalogEntry): string =>
  [formatSummaryBlock(entry), '   Source code:', entry.sourceCode].join('\n');

const writeJsonError = (io: CliIo, error: CliError): void => {
  io.stdout.write(
    stringifyJson({
      error: {
        code: error.code,
        message: error.message,
        ...error.details,
      },
    })
  );
};

const writeHumanError = (io: CliIo, error: CliError): void => {
  io.stderr.write(`${error.message}\n`);
};

const toCliParseError = (error: unknown): CliError => {
  if (error instanceof CliError) {
    return error;
  }

  if (error instanceof Error) {
    return new CliError(error.message, EXIT_INVALID_INPUT, 'invalid-arguments');
  }

  return new CliError('Invalid command arguments.', EXIT_INVALID_INPUT, 'invalid-arguments');
};

const parseFindArguments = (args: string[]) => {
  let parsed;

  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        query: { type: 'string', short: 'q' },
        tag: { type: 'string', short: 't', multiple: true },
        tags: { type: 'string', multiple: true },
        limit: { type: 'string', short: 'l' },
        json: { type: 'boolean', short: 'j' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error) {
    throw toCliParseError(error);
  }

  const positionalQuery = parsed.positionals.join(' ').trim();
  const query = parsed.values.query ?? (positionalQuery || undefined);

  return {
    json: parsed.values.json ?? false,
    help: parsed.values.help ?? false,
    query,
    tags: collectTags([...(parsed.values.tag ?? []), ...(parsed.values.tags ?? [])]),
    limit: parseLimit(parsed.values.limit),
  };
};

const parseFetchArguments = (args: string[]) => {
  let parsed;

  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        id: { type: 'string', short: 'i' },
        json: { type: 'boolean', short: 'j' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error) {
    throw toCliParseError(error);
  }

  const positionalIdentifier = parsed.positionals.join(' ').trim();
  const identifier = (parsed.values.id ?? positionalIdentifier).trim();

  if (!parsed.values.help && !identifier) {
    throw new CliError(
      'The fetch command requires a bit id or exact display name.',
      EXIT_INVALID_INPUT,
      'missing-identifier'
    );
  }

  if (parsed.values.id && positionalIdentifier) {
    throw new CliError(
      'Provide the fetch identifier either positionally or with --id, not both.',
      EXIT_INVALID_INPUT,
      'conflicting-identifier'
    );
  }

  return {
    json: parsed.values.json ?? false,
    help: parsed.values.help ?? false,
    identifier,
  };
};

const runFindCommand = async (args: string[], io: CliIo): Promise<number> => {
  const options = parseFindArguments(args);

  if (options.help) {
    io.stdout.write(usage);
    return EXIT_SUCCESS;
  }

  const results = findBits({
    query: options.query,
    tags: options.tags,
    limit: options.limit,
  });

  if (options.json) {
    io.stdout.write(stringifyJson({ results: results.map((entry) => serializeSummary(entry)) }));
    return EXIT_SUCCESS;
  }

  if (results.length === 0) {
    io.stdout.write('No bits found.\n');
    return EXIT_SUCCESS;
  }

  io.stdout.write(`${results.map((entry, index) => formatSummaryBlock(entry, index)).join('\n\n')}\n`);
  return EXIT_SUCCESS;
};

const runFetchCommand = async (args: string[], io: CliIo): Promise<number> => {
  const options = parseFetchArguments(args);

  if (options.help) {
    io.stdout.write(usage);
    return EXIT_SUCCESS;
  }

  const resolution = resolveBitCatalogIdentifier(options.identifier);

  if (!resolution.entry) {
    if (resolution.reason === 'ambiguous-name') {
      throw new CliError(
        `The identifier "${options.identifier}" matches multiple bits. Use one of: ${(resolution.matches ?? []).join(', ')}`,
        EXIT_INVALID_INPUT,
        'ambiguous-name',
        { matches: resolution.matches ?? [] }
      );
    }

    throw new CliError(`No bit found for "${options.identifier}".`, EXIT_NOT_FOUND, 'not-found');
  }

  const bit = await fetchBit(options.identifier);

  if (!bit) {
    throw new CliError(`No bit found for "${options.identifier}".`, EXIT_NOT_FOUND, 'not-found');
  }

  if (options.json) {
    io.stdout.write(stringifyJson({ bit: serializeEntry(bit) }));
    return EXIT_SUCCESS;
  }

  io.stdout.write(`${formatEntryBlock(bit)}\n`);
  return EXIT_SUCCESS;
};

const runMcpCommand = async (args: string[], io: CliIo): Promise<number> => {
  if (args.includes('--help') || args.includes('-h')) {
    io.stdout.write(usage);
    return EXIT_SUCCESS;
  }

  await startRemotionBitsMcpServer();
  return EXIT_SUCCESS;
};

export const runRemotionBitsCli = async (
  args: string[],
  io: CliIo = process
): Promise<number> => {
  const [command, ...rest] = args;

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    io.stdout.write(usage);
    return command ? EXIT_SUCCESS : EXIT_INVALID_INPUT;
  }

  try {
    if (command === 'find') {
      return await runFindCommand(rest, io);
    }

    if (command === 'fetch') {
      return await runFetchCommand(rest, io);
    }

    if (command === 'mcp') {
      return await runMcpCommand(rest, io);
    }

    throw new CliError(`Unknown command "${command}".`, EXIT_INVALID_INPUT, 'unknown-command');
  } catch (error) {
    if (error instanceof CliError) {
      const jsonRequested = rest.includes('--json') || rest.includes('-j');

      if (jsonRequested) {
        writeJsonError(io, error);
      } else {
        writeHumanError(io, error);
      }

      return error.exitCode;
    }

    throw error;
  }
};