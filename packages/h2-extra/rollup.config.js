import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'H2Extra',
      sourcemap: true,
      globals: {
        'lit': 'Lit',
        '@demo/h2-core': 'H2Core',
        '@demo/interfaces': 'DemoInterfaces'
      }
    }
  ],
  external: ['lit', '@demo/h2-core', '@demo/interfaces'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      outDir: './dist'
    })
  ]
};