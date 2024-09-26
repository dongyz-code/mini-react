// https://vitejs.dev/config/

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, './build'),
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'MiniReact',
      fileName: 'mini-react',
    },
    emptyOutDir: true,
  },
});
