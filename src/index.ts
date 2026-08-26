import * as cli from './cli.js';
import * as llm from './llm.js';
import * as tools from './tools/index.js';

while (true) {
  const userInput = await cli.ask();
  let response = await llm.complete(userInput);

  if (response.toolCalls.length > 0) {
    response = await llm.complete(await tools.run(response.toolCalls));
  }

  cli.reply(response.text);
}
