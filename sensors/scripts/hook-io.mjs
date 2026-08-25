export async function readHookPayload(stream = process.stdin) {
  let input = '';

  for await (const chunk of stream) input += chunk;

  try {
    return JSON.parse(input);
  } catch {
    return {};
  }
}

export function editedPaths(payload) {
  const input = payload.tool_input ?? {};

  return [input.file_path, input.notebook_path].filter(Boolean);
}
