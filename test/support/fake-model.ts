import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ServerResponse } from 'node:http';

import { completionFor, type Reply } from './model-script.js';

export type Message = {
  readonly role: string;
  readonly content: string | null;
};

export type ModelRequest = {
  readonly model: string;
  readonly messages: readonly Message[];
};

export type FakeModel = {
  readonly url: string;
  readonly requests: readonly ModelRequest[];
  close: () => Promise<void>;
};

async function readBody(request: IncomingMessage): Promise<ModelRequest> {
  let body = '';

  for await (const chunk of request) body += String(chunk);

  return JSON.parse(body) as ModelRequest;
}

function send(response: ServerResponse, status: number, body: string): void {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(body);
}

// Running past the end of the script is a test bug, so it must be loud rather than blank.
function offScript(response: ServerResponse, asked: number): void {
  const message = `fake model was asked ${asked} times but the script has fewer replies`;

  send(response, 500, JSON.stringify({ error: { message } }));
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
export async function startFakeModel(script: readonly Reply[]): Promise<FakeModel> {
  const requests: ModelRequest[] = [];
  const server = createServer((request, response) => {
    readBody(request)
      .then((asked) => {
        requests.push(asked);

        const reply = script[requests.length - 1];

        if (reply) send(response, 200, completionFor(reply));
        else offScript(response, requests.length);
      })
      .catch(() => response.destroy());
  });

  const port = await listening(server);

  return { url: `http://127.0.0.1:${port}`, requests, close: () => closed(server) };
}
