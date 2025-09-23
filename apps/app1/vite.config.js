import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      '@demo/interfaces': resolve(__dirname, '../../packages/interfaces/src/index.ts'),
      '@demo/h2-core': resolve(__dirname, '../../packages/h2-core/src/index.ts'),
      '@demo/h2-extra': resolve(__dirname, '../../packages/h2-extra/src/index.ts'),
      '@demo/o2-resource': resolve(__dirname, '../../packages/o2-resource/src/index.ts'),
      '@demo/o2-datasource': resolve(__dirname, '../../packages/o2-datasource/src/index.ts'),
      '@demo/o2-sql-view': resolve(__dirname, '../../packages/o2-sql-view/src/index.ts'),
      '@demo/o2-java-view': resolve(__dirname, '../../packages/o2-java-view/src/index.ts'),
      '@demo/o2-cube': resolve(__dirname, '../../packages/o2-cube/src/index.ts'),
      '@demo/o2-dashboard': resolve(__dirname, '../../packages/o2-dashboard/src/index.ts')
    }
  }
});