// The vocabulary a test uses to script what the model will say back.
//
//   startFakeModel([
//     calls(tool('read_file', { path: 'package.json' })),
//     says('This project is called build-coding-agent-from-scratch.'),
//   ]);

export type ToolCall = {
  readonly name: string;
  readonly arguments: Readonly<Record<string, unknown>>;
};

export type SpokenReply = { readonly says: string };
export type ToolCallReply = { readonly calls: readonly ToolCall[] };
export type Reply = SpokenReply | ToolCallReply;

export function says(text: string): Reply {
  return { says: text };
}

export function calls(...toolCalls: readonly ToolCall[]): Reply {
  return { calls: toolCalls };
}

export function tool(name: string, args: Record<string, unknown> = {}): ToolCall {
  return { name, arguments: args };
}

function spoken(reply: Reply): reply is SpokenReply {
  return 'says' in reply;
}

function wireToolCall(call: ToolCall, index: number): Record<string, unknown> {
  return {
    id: `call_${index + 1}`,
    type: 'function',
    function: { name: call.name, arguments: JSON.stringify(call.arguments) },
  };
}

function assistantMessage(reply: Reply): Record<string, unknown> {
  if (spoken(reply)) return { role: 'assistant', content: reply.says };

  return {
    role: 'assistant',
    content: null,
    tool_calls: reply.calls.map(wireToolCall),
  };
}

// OpenRouter speaks the OpenAI completion envelope, and the SDK validates every field.
export function completionFor(reply: Reply): string {
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
