import { configDefaults, defineConfig } from 'vitest/config';

// Every acceptance test spawns the agent, and a laptop with a browser open is slower than 5s.
export default defineConfig({
  test: { testTimeout: 15000, exclude: [...configDefaults.exclude, 'kata/**'] },
});
