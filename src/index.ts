import { createInterface } from 'node:readline/promises';

import { OpenRouter } from '@openrouter/sdk';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'z-ai/glm-5.2:free';
const openRouter = new OpenRouter({ apiKey });

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const prompt = await terminal.question('You: ');
terminal.close();

const result = await openRouter.chat.send({
  chatRequest: { model, stream: false, messages: [{ role: 'user', content: prompt }] },
});

const reply = 'choices' in result ? result.choices[0]?.message.content : null;
const text = typeof reply === 'string' ? reply : '';

console.log(`Assistant: ${text}`);
