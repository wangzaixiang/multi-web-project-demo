import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    dts({
      outDir: "dist",
      include: ["src/**/*"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'O2javaview',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: [
        '@esm/lit-all',
        '@esm/h2-core',
        '@esm/h2-extra',
        '@esm/interfaces'
      ],
      output: {
        dir: 'dist'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});