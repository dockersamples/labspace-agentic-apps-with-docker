import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { websiteAnalyzer } from './agent';

export const mastra = new Mastra({
  agents: { websiteAnalyzer },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    host: '0.0.0.0'
  },
});
