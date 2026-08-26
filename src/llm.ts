import { OpenRouter } from '@openrouter/sdk';
import type { OpenRouterError } from '@openrouter/sdk/models/errors';
import type { ChatAssistantMessage, ChatMessages, ChatToolCall } from '@openrouter/sdk/models';

import * as log from './log.js';
import * as prompt from './prompt.js';
import * as tools from './tools/index.js';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Set OPENROUTER_API_KEY before running the agent.');
  process.exit(1);
}

const model = process.env.OPENROUTER_MODEL ?? 'deepseek/deepseek-v4-flash-0731';
const openRouter = new OpenRouter({ apiKey });

log.detail('loading tools', tools.schemas);

export type Turn = string | readonly tools.ToolResult[];

export type Response = {
  readonly text: string;
  readonly toolCalls: readonly tools.ToolCall[];
};

const silence: ChatAssistantMessage = { role: 'assistant', content: '' };
const conversation: ChatMessages[] = [{ role: 'system', content: prompt.coding }];

let requests = 0;

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

// An Error's name, message and stack are not its own properties, so JSON.stringify drops them.
function failure(reason: unknown): unknown {
  const { name, message, stack, statusCode, body } = reason as Error & OpenRouterError;

  return { name, message, statusCode, body, stack };
}

export async function complete(turn: Turn): Promise<Response> {
  const messages = messagesFor(turn);

  conversation.push(...messages);

  const number = ++requests;
  const askedAt = Date.now();

  log.detail(`--> request ${number}, messages: ${conversation.length}`, messages);

  const result = await openRouter.chat
    .send({ chatRequest: { model, stream: false, messages: conversation, tools: tools.schemas } })
    .catch((reason: unknown) => {
      log.detail(`!!! request ${number} failed after ${Date.now() - askedAt}ms`, failure(reason));

      throw reason;
    });

  log.detail(`<-- reply ${number} after ${Date.now() - askedAt}ms`, result);

  const reply = ('choices' in result ? result.choices[0]?.message : undefined) ?? silence;

  conversation.push(reply);

  return { text: textOf(reply.content), toolCalls: toolCallsFrom(reply.toolCalls) };
}
