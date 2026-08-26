import { OpenRouter } from '@openrouter/sdk';
import type { ChatAssistantMessage, ChatMessages } from '@openrouter/sdk/models';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'minimax/minimax-m3:free';
const openRouter = new OpenRouter({ apiKey });

const silence: ChatAssistantMessage = { role: 'assistant', content: '' };
const conversation: ChatMessages[] = [];

function textOf(content: ChatAssistantMessage['content']): string {
  return typeof content === 'string' ? content : '';
}

export async function complete(userInput: string): Promise<string> {
  conversation.push({ role: 'user', content: userInput });

  const result = await openRouter.chat.send({
    chatRequest: { model, stream: false, messages: conversation },
  });
  const reply = ('choices' in result ? result.choices[0]?.message : undefined) ?? silence;

  conversation.push(reply);

  return textOf(reply.content);
}
