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
      external: []
    },
    sourcemap: true,
    minify: false
  },
  plugins: [
    dts({
      rollupTypes: true,
      outDir: 'dist'
    })
  ]
});