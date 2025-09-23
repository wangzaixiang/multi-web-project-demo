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
    outDir: 'dist-vite',
    minify: false, // 禁用代码混淆和压缩
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 基于模块路径进行分包
          if (id.includes('node_modules')) {
            if (id.includes('lit')) {
              return 'lit';
            }
            return 'vendor';
          }
          
          // 基于包路径进行分包
          if (id.includes('packages/h2-core')) {
            return 'h2-core';
          }
          if (id.includes('packages/h2-extra')) {
            return 'h2-extra';
          }
          if (id.includes('packages/o2-resource')) {
            return 'o2-resource';
          }
          if (id.includes('packages/o2-datasource')) {
            return 'o2-datasource';
          }
          if (id.includes('packages/o2-sql-view') || id.includes('packages/o2-java-view')) {
            return 'o2-views';
          }
          if (id.includes('packages/o2-cube') || id.includes('packages/o2-dashboard')) {
            return 'o2-analytics';
          }
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