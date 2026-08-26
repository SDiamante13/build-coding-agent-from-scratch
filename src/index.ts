import * as cli from './cli.js';
import * as llm from './llm.js';
import * as tools from './tools/index.js';

while (true) {
  const userInput = await cli.ask();
  let response = await llm.complete(userInput);

  if (response.toolCall) {
    response = await llm.complete(await tools.run(response.toolCall));
  }

  cli.reply(response.text);
}
