import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};


const ALL_COMMANDS = [TEST_COMMAND];

// TypeScript-safe env access
const APP_ID = process.env.APP_ID;
if (!APP_ID) {
  throw new Error('Missing APP_ID in environment variables');
}

InstallGlobalCommands(APP_ID, ALL_COMMANDS);