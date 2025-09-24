import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { esmExternalsPlugin } from './vite-plugin-esm-externals.js';

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
      // Map @esm packages to source during development
      '@esm/interfaces': path.resolve(__dirname, '../../packages/esm-interfaces/src'),
      '@esm/lit-all': path.resolve(__dirname, '../../packages/esm-lit-all/src'),
      '@esm/h2-core': path.resolve(__dirname, '../../packages/esm-h2-core/src'),
      '@esm/h2-extra': path.resolve(__dirname, '../../packages/esm-h2-extra/src'),
      '@esm/o2-resource': path.resolve(__dirname, '../../packages/esm-o2-resource/src'),
      '@esm/o2-datasource': path.resolve(__dirname, '../../packages/esm-o2-datasource/src'),
      '@esm/o2-sql-view': path.resolve(__dirname, '../../packages/esm-o2-sql-view/src'),
      '@esm/o2-java-view': path.resolve(__dirname, '../../packages/esm-o2-java-view/src'),
      '@esm/o2-cube': path.resolve(__dirname, '../../packages/esm-o2-cube/src'),
      '@esm/o2-dashboard': path.resolve(__dirname, '../../packages/esm-o2-dashboard/src')
    }
  },
  plugins: [
    esmExternalsPlugin()
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