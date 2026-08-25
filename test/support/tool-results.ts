import type { Message, ModelRequest } from './fake-model.js';

export function toolResultsIn(request: ModelRequest | undefined): readonly Message[] {
  return request?.messages.filter((message) => message.role === 'tool') ?? [];
}
