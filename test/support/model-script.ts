// The vocabulary a test uses to script what the model says back.

export type ToolCall = {
  readonly name: string;
  readonly arguments: Readonly<Record<string, unknown>>;
};

export type SpokenReply = { readonly says: string };
export type ToolCallReply = { readonly calls: readonly ToolCall[] };
export type FailureReply = { readonly status: number; readonly error: string };
export type Reply = SpokenReply | ToolCallReply | FailureReply;

export function says(text: string): Reply {
  return { says: text };
}

export function calls(...toolCalls: readonly ToolCall[]): Reply {
  return { calls: toolCalls };
}

export function tool(name: string, args: Record<string, unknown> = {}): ToolCall {
  return { name, arguments: args };
}

export function fails(status: number, error: string): Reply {
  return { status, error };
}

function spoken(reply: SpokenReply | ToolCallReply): reply is SpokenReply {
  return 'says' in reply;
}

function failed(reply: Reply): reply is FailureReply {
  return 'status' in reply;
}

export function statusFor(reply: Reply): number {
  return failed(reply) ? reply.status : 200;
}

function wireToolCall(call: ToolCall, index: number): Record<string, unknown> {
  return {
    id: `call_${index + 1}`,
    type: 'function',
    function: { name: call.name, arguments: JSON.stringify(call.arguments) },
  };
}

function assistantMessage(reply: SpokenReply | ToolCallReply): Record<string, unknown> {
  if (spoken(reply)) return { role: 'assistant', content: reply.says };

  return {
    role: 'assistant',
    content: null,
    tool_calls: reply.calls.map(wireToolCall),
  };
}

// OpenRouter speaks the OpenAI completion envelope, and the SDK validates every field.
export function completionFor(reply: Reply): string {
  if (failed(reply)) return JSON.stringify({ error: { code: reply.status, message: reply.error } });

  return JSON.stringify({
    id: 'fake-completion',
    object: 'chat.completion',
    created: 0,
    model: 'fake/model',
    system_fingerprint: null,
    choices: [
      {
        index: 0,
        finish_reason: spoken(reply) ? 'stop' : 'tool_calls',
        message: assistantMessage(reply),
      },
    ],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  });
}
