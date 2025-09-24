import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync } from 'fs';

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
  build: {
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      plugins: [
        {
          name: 'copy-lit-all',
          writeBundle() {
            const litAllPath = path.resolve(__dirname, '../../packages/lit-all/dist/index.js');
            const litAllSourceMapPath = path.resolve(__dirname, '../../packages/lit-all/dist/index.js.map');
            const destDir = path.resolve(__dirname, 'dist/assets');
            mkdirSync(destDir, { recursive: true });
            copyFileSync(litAllPath, path.join(destDir, 'lit-all.js'));
            copyFileSync(litAllSourceMapPath, path.join(destDir, 'lit-all.js.map'));
            console.log('📦 Copied lit-all.js to assets/');
          }
        }
      ],
      external: ["lit", "lit/decorators.js", "lit/directive.js", "lit/async-directive.js", "lit/directive-helpers.js", "lit/directives/async-append.js", "lit/directives/async-replace.js", "lit/directives/cache.js", "lit/directives/choose.js", "lit/directives/class-map.js", "lit/directives/guard.js", "lit/directives/if-defined.js", "lit/directives/join.js", "lit/directives/keyed.js", "lit/directives/live.js", "lit/directives/map.js", "lit/directives/range.js", "lit/directives/ref.js", "lit/directives/repeat.js", "lit/directives/style-map.js", "lit/directives/template-content.js", "lit/directives/unsafe-html.js", "lit/directives/unsafe-svg.js", "lit/directives/until.js", "lit/directives/when.js", "lit/static-html.js",
          '@demo/lit-all'],
      output: {
        manualChunks(id) {
          if (id.includes('packages/h2-core/')) return 'h2-core';
          if (id.includes('packages/h2-extra/')) return 'h2-extra';
          if (id.includes('packages/o2-resource/')) return 'o2-resource';
          if (id.includes('packages/o2-datasource/')) return 'o2-datasource';
          if (id.includes('packages/o2-sql-view/') || id.includes('packages/o2-java-view/')) return 'o2-views';
          if (id.includes('packages/o2-cube/') || id.includes('packages/o2-dashboard/')) return 'o2-analytics';
        },
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