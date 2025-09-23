import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      '@demo/interfaces': '../../packages/interfaces/src',
      '@demo/h2-core': '../../packages/h2-core/src',
      '@demo/h2-extra': '../../packages/h2-extra/src',
      '@demo/o2-resource': '../../packages/o2-resource/src',
      '@demo/o2-datasource': '../../packages/o2-datasource/src',
      '@demo/o2-sql-view': '../../packages/o2-sql-view/src',
      '@demo/o2-java-view': '../../packages/o2-java-view/src',
      '@demo/o2-cube': '../../packages/o2-cube/src',
      '@demo/o2-dashboard': '../../packages/o2-dashboard/src'
    }
  }
});