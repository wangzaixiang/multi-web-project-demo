import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3003
  },
  resolve: {
    alias: {
      '@demo/interfaces': '../../packages/interfaces/src',
      '@demo/h2-core': '../../packages/h2-core/src',
      '@demo/h2-extra': '../../packages/h2-extra/src'
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          'lit': 'Lit'
        }
      }
    }
  }
});