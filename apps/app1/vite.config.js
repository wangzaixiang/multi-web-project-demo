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
      '@esm/interfaces': resolve(__dirname, '../../packages/esm-interfaces/src/index.ts'),
      '@esm/lit-all': resolve(__dirname, '../../packages/esm-lit-all/src/index.ts'),
      '@esm/h2-core': resolve(__dirname, '../../packages/esm-h2-core/src/index.ts'),
      '@esm/h2-extra': resolve(__dirname, '../../packages/esm-h2-extra/src/index.ts'),
      '@esm/o2-resource': resolve(__dirname, '../../packages/esm-o2-resource/src/index.ts'),
      '@esm/o2-datasource': resolve(__dirname, '../../packages/esm-o2-datasource/src/index.ts'),
      '@esm/o2-sql-view': resolve(__dirname, '../../packages/esm-o2-sql-view/src/index.ts'),
      '@esm/o2-java-view': resolve(__dirname, '../../packages/esm-o2-java-view/src/index.ts'),
      '@esm/o2-cube': resolve(__dirname, '../../packages/esm-o2-cube/src/index.ts'),
      '@esm/o2-dashboard': resolve(__dirname, '../../packages/esm-o2-dashboard/src/index.ts')
    }
  },
  build: {
      outDir: 'dist',
      sourcemap: true,
      target: 'es2020',
  }
});