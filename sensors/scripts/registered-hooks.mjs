import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');

// The local manifest is gitignored, so a worktree registers hooks whose scripts it never received.
const MANIFESTS = [
  '.claude/settings.json',
  '.claude/settings.local.json',
  '.codex/hooks.json',
];

const ROOTED = /(?:\$CLAUDE_PROJECT_DIR|\$\(git rev-parse --show-toplevel\))\/([^"'\s]+)/;

function commandsIn(node) {
  if (Array.isArray(node)) return node.flatMap(commandsIn);
  if (node === null || typeof node !== 'object') return [];

  const own = typeof node.command === 'string' ? [node.command] : [];

  return [...own, ...Object.values(node).flatMap(commandsIn)];
}

function readManifest(manifest) {
  try {
    return JSON.parse(readFileSync(path.join(projectRoot, manifest), 'utf8'));
  } catch {
    return null;
  }
}

export function scriptNamedBy(command) {
  return command.match(ROOTED)?.[1] ?? null;
}

function hooksIn(manifest) {
  const parsed = readManifest(manifest);

  return parsed === null
    ? []
    : commandsIn(parsed)
        .map((command) => ({ manifest, script: scriptNamedBy(command) }))
        .filter((hook) => hook.script !== null)
        .map((hook) => ({
          ...hook,
          present: existsSync(path.join(projectRoot, hook.script)),
        }));
}

export function registeredHooks() {
  return MANIFESTS.flatMap(hooksIn);
}

export function deadHooks(hooks = registeredHooks()) {
  return hooks.filter((hook) => !hook.present);
}
