import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/__tests__/**', 'src/templates/index.ts'],
    },
  },
});
