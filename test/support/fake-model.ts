import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

export type ModelRequest = {
  readonly model: string;
  readonly messages: readonly { readonly role: string; readonly content: string }[];
};

export type FakeModel = {
  readonly url: string;
  readonly requests: readonly ModelRequest[];
  close: () => Promise<void>;
};

function completion(content: string): string {
  return JSON.stringify({
    id: 'fake-completion',
    object: 'chat.completion',
    created: 0,
    model: 'fake/model',
    system_fingerprint: null,
    choices: [
      { index: 0, finish_reason: 'stop', message: { role: 'assistant', content } },
    ],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  });
}

async function readBody(request: IncomingMessage): Promise<ModelRequest> {
  let body = '';

  for await (const chunk of request) body += String(chunk);

  return JSON.parse(body) as ModelRequest;
}

function listening(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve((server.address() as AddressInfo).port);
    });
  });
}

function closed(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

// The agent under test is a black box: it is told a base URL and nothing else.
export async function startFakeModel(replies: readonly string[]): Promise<FakeModel> {
  const requests: ModelRequest[] = [];
  const server = createServer((request, response) => {
    readBody(request)
      .then((asked) => {
        const reply = replies[requests.length] ?? '';

        requests.push(asked);
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(completion(reply));
      })
      .catch(() => response.destroy());
  });

  const port = await listening(server);

  return { url: `http://127.0.0.1:${port}`, requests, close: () => closed(server) };
}
