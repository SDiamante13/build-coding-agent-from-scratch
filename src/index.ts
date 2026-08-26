import * as cli from './cli.js';
import * as llm from './llm.js';

const userInput = await cli.ask();

cli.reply(await llm.complete(userInput));

cli.close();
