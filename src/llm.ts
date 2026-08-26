import { OpenRouter } from '@openrouter/sdk';
import type { ChatAssistantMessage, ChatMessages, ChatToolCall } from '@openrouter/sdk/models';

import * as prompt from './prompt.js';
import * as tools from './tools/index.js';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'minimax/minimax-m3:free';
const openRouter = new OpenRouter({ apiKey });

export type Turn = string | readonly tools.ToolResult[];

export type Response = {
  readonly text: string;
  readonly toolCalls: readonly tools.ToolCall[];
};

const silence: ChatAssistantMessage = { role: 'assistant', content: '' };
const conversation: ChatMessages[] = [{ role: 'system', content: prompt.coding }];

function messagesFor(turn: Turn): ChatMessages[] {
  if (typeof turn === 'string') return [{ role: 'user', content: turn }];

  return turn.map((result) => ({
    role: 'tool',
    toolCallId: result.id,
    content: result.output,
  }));
}

function textOf(content: ChatAssistantMessage['content']): string {
  return typeof content === 'string' ? content : '';
}

function toolCallsFrom(calls: ChatToolCall[] | undefined): tools.ToolCall[] {
  return (calls ?? []).map((call) => ({
    id: call.id,
    name: call.function.name,
    arguments: call.function.arguments,
  }));
}

export async function complete(turn: Turn): Promise<Response> {
  conversation.push(...messagesFor(turn));

  const result = await openRouter.chat.send({
    chatRequest: { model, stream: false, messages: conversation, tools: tools.schemas },
  });
  const reply = ('choices' in result ? result.choices[0]?.message : undefined) ?? silence;

  conversation.push(reply);

  return { text: textOf(reply.content), toolCalls: toolCallsFrom(reply.toolCalls) };
}
