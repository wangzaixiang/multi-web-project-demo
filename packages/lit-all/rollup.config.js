import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    }
  ],
  // Bundle all Lit dependencies into the output
  // DO NOT mark lit as external - we want to bundle it
  external: [],
  plugins: [
    resolve({
      // Include node modules in the bundle
      preferBuiltins: false
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      outDir: './dist'
    })
  ]
};