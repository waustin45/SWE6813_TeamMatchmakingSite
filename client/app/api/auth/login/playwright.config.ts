import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  // Only run .spec.ts files
  testMatch: '**/*.spec.ts',
  // Explicitly ignore .test.ts files to prevent Vitest conflicts
  testIgnore: ['**/*.test.ts'],
  use: {
    baseURL: 'http://localhost:3000',
  },
});