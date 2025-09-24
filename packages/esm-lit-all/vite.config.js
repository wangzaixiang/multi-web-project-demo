import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      include: ['src/**/*']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LitAll',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // Bundle everything - no externals for this package
      external: [],
      output: {
        dir: 'dist'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});