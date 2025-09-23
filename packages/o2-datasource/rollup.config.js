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
      name: 'O2DataSource',
      sourcemap: true,
      globals: {
        'lit': 'Lit',
        '@demo/interfaces': 'DemoInterfaces',
        '@demo/h2-core': 'H2Core',
        '@demo/h2-extra': 'H2Extra'
      }
    }
  ],
  external: ['lit', '@demo/interfaces', '@demo/h2-core', '@demo/h2-extra'],
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