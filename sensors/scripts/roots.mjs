import path from 'node:path';

// The apparatus lives one directory below the workspace it inspects.
export const sensorsRoot = path.resolve(import.meta.dirname, '..');
export const projectRoot = path.resolve(sensorsRoot, '..');

export function sensorsPath(...segments) {
  return path.join(sensorsRoot, ...segments);
}
