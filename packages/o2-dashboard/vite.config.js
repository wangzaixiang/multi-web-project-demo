import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['@demo/lit-all', '@demo/interfaces', '@demo/h2-core', '@demo/h2-extra']
    },
    sourcemap: true,
    minify: false
  },
  plugins: [
    dts({
      rollupTypes: false,
      outDir: 'dist'
    })
  ]
});
