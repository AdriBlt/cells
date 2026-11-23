import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Served from https://adriblt.github.io/cells, so assets live under /cells/.
export default defineConfig({
  base: '/cells/',
  plugins: [
    // MobX 5 uses legacy decorators: Babel only needs to parse them, esbuild compiles them.
    react({ babel: { parserOpts: { plugins: ['decorators-legacy'] } } }),
  ],
  build: { outDir: 'build' },
  test: { globals: true, environment: 'node' },
});
