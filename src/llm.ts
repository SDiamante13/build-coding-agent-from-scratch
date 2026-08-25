import { OpenRouter } from '@openrouter/sdk';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'z-ai/glm-5.2:free';
const openRouter = new OpenRouter({ apiKey });

export async function complete(userInput: string): Promise<string> {
  const result = await openRouter.chat.send({
    chatRequest: {
      model,
      stream: false,
      messages: [{ role: 'user', content: userInput }],
    },
  });

  const content = 'choices' in result ? result.choices[0]?.message.content : null;

  return typeof content === 'string' ? content : '';
}
