import { ask, close, reply } from './cli.js';
import { complete } from './llm.js';

const userInput = await ask();

reply(await complete(userInput));

close();
