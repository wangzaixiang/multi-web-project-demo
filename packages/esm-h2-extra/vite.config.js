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
      name: 'H2Extra',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // External dependencies - these will be resolved at runtime
      external: [
        '@esm/lit-all',
        '@esm/h2-core',
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