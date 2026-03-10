import { runRemotionBitsCli } from '../src/cli/remotion-bits';

export const runRemotionBitsLookupCli = runRemotionBitsCli;

if (process.argv[1]?.endsWith('remotion-bits-lookup.ts')) {
  const exitCode = await runRemotionBitsLookupCli(process.argv.slice(2));
  process.exitCode = exitCode;
}