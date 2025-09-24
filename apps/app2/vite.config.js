import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: '.',
  server: {
    port: 3002
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
  build: {
    outDir: 'dist',
    minify: false, // 禁用代码混淆和压缩
    rollupOptions: {
      external: ["lit", "lit/decorators.js"],
      output: {
        manualChunks: {
            'h2-core': ['@demo/h2-core'],
            'h2-extra': ['@demo/h2-extra'],
            'o2-resource': ['@demo/o2-resource'],
            'o2-datasource': ['@demo/o2-datasource'],
            'o2-views': ['@demo/o2-sql-view', '@demo/o2-java-view'],
            'o2-analytics': ['@demo/o2-cube', '@demo/o2-dashboard']
        },

        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 保持代码格式化和可读性
        compact: false
      }
    },
    sourcemap: true,
    target: 'es2020'
  }
});