import { OpenRouter } from '@openrouter/sdk';
import type { ChatAssistantMessage, ChatMessages, ChatToolCall } from '@openrouter/sdk/models';

import * as tools from './tools/index.js';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'minimax/minimax-m3:free';
const openRouter = new OpenRouter({ apiKey });

export type Turn = string | tools.ToolResult;

export type Response = {
  readonly text: string;
  readonly toolCall?: tools.ToolCall;
};

const silence: ChatAssistantMessage = { role: 'assistant', content: '' };
const conversation: ChatMessages[] = [];

function messageFor(turn: Turn): ChatMessages {
  if (typeof turn === 'string') return { role: 'user', content: turn };

  return { role: 'tool', toolCallId: turn.id, content: turn.output };
}

function textOf(content: ChatAssistantMessage['content']): string {
  return typeof content === 'string' ? content : '';
}

function firstToolCall(calls: ChatToolCall[] | undefined): tools.ToolCall | undefined {
  const call = calls?.[0];

  if (!call) return undefined;

  return { id: call.id, name: call.function.name, arguments: call.function.arguments };
}

export async function complete(turn: Turn): Promise<Response> {
  conversation.push(messageFor(turn));

  const result = await openRouter.chat.send({
    chatRequest: { model, stream: false, messages: conversation, tools: tools.schemas },
  });
  const reply = ('choices' in result ? result.choices[0]?.message : undefined) ?? silence;

  conversation.push(reply);

  return { text: textOf(reply.content), toolCall: firstToolCall(reply.toolCalls) };
}
