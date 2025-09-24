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
      name: 'Interfaces',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // No external dependencies for interfaces
      external: [],
      output: {
        dir: 'dist'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});