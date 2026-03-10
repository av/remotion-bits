import {
  createRemotionBitsMcpServer,
  startRemotionBitsMcpServer,
} from '../src/mcp/remotion-bits';

if (process.argv[1]?.endsWith('remotion-bits-mcp.ts')) {
  startRemotionBitsMcpServer().catch((error) => {
    console.error('Fatal error in remotion-bits MCP server:', error);
    process.exit(1);
  });
}

export { createRemotionBitsMcpServer, startRemotionBitsMcpServer };