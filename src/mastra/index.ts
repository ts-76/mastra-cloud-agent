import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';

import { LibSQLStore } from '@mastra/libsql';
import { newsWorkflow } from './workflows/newsWorkflow';
import { researchAgent } from './agents/researchAgent';
import { searchTool } from './tools/searchTool';
import { emailTool } from './tools/emailTool';

export const mastra = new Mastra({
  workflows: {
    newsWorkflow,
  },
  agents: {
    researchAgent,
  },
  storage: new LibSQLStore({ url: ':memory:' }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
  bundler: {
    externals: ['difflib'],
  },
  deployer: new CloudflareDeployer({
    projectName: 'mastra-ai-news',
    env: {
      NODE_ENV: 'production',
    },
  }),
});
