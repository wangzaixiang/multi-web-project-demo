import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { externalDepsPlugin } from './vite-plugin-external-deps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: '.',
  server: {
    port: 3002
  },
  optimizeDeps: {
    exclude: ['lit', 'lit/decorators.js']
  },
  resolve: {
    alias: {
      '@demo/interfaces': path.resolve(__dirname, '../../packages/interfaces/src'),
      '@demo/h2-core': path.resolve(__dirname, '../../packages/h2-core/src'),
      '@demo/h2-extra': path.resolve(__dirname, '../../packages/h2-extra/src'),
      '@demo/o2-resource': path.resolve(__dirname, '../../packages/o2-resource/src'),
      '@demo/o2-datasource': path.resolve(__dirname, '../../packages/o2-datasource/src'),
      '@demo/o2-sql-view': path.resolve(__dirname, '../../packages/o2-sql-view/src'),
      '@demo/o2-java-view': path.resolve(__dirname, '../../packages/o2-java-view/src'),
      '@demo/o2-cube': path.resolve(__dirname, '../../packages/o2-cube/src'),
      '@demo/o2-dashboard': path.resolve(__dirname, '../../packages/o2-dashboard/src')
    }
  },
  plugins: [
    externalDepsPlugin()
  ],
  build: {
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        compact: false
      }
    },
    sourcemap: true,
    target: 'es2020'
  }
});