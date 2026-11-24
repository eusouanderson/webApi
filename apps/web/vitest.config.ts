import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';

export default defineConfig({
  plugins: [react() as unknown as PluginOption],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: false,
  },
});
