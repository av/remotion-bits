#!/usr/bin/env node

import { runRemotionBitsCli } from '../cli/remotion-bits';

const exitCode = await runRemotionBitsCli(process.argv.slice(2));
process.exitCode = exitCode;