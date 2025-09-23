import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/app1.bundle.js',
    format: 'iife',
    name: 'App1',
    sourcemap: true
  },
  plugins: [
    alias({
      entries: [
        { find: '@demo/interfaces', replacement: path.resolve(__dirname, '../../packages/interfaces/src') },
        { find: '@demo/h2-core', replacement: path.resolve(__dirname, '../../packages/h2-core/src') },
        { find: '@demo/h2-extra', replacement: path.resolve(__dirname, '../../packages/h2-extra/src') },
        { find: '@demo/o2-resource', replacement: path.resolve(__dirname, '../../packages/o2-resource/src') },
        { find: '@demo/o2-datasource', replacement: path.resolve(__dirname, '../../packages/o2-datasource/src') },
        { find: '@demo/o2-sql-view', replacement: path.resolve(__dirname, '../../packages/o2-sql-view/src') },
        { find: '@demo/o2-java-view', replacement: path.resolve(__dirname, '../../packages/o2-java-view/src') },
        { find: '@demo/o2-cube', replacement: path.resolve(__dirname, '../../packages/o2-cube/src') },
        { find: '@demo/o2-dashboard', replacement: path.resolve(__dirname, '../../packages/o2-dashboard/src') }
      ]
    }),
    resolve({
      moduleDirectories: ['node_modules'],
      preferBuiltins: false,
      extensions: ['.js', '.ts']
    }),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        allowImportingTsExtensions: false,
        noEmit: false,
        declaration: false,
        declarationMap: false,
        skipLibCheck: true,
        // Ensure decorators work properly
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
        // Import helpers from tslib
        importHelpers: true
      }
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
      presets: [
        ['@babel/preset-env', { targets: 'defaults' }],
        '@babel/preset-typescript'
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { version: '2023-05' }]
      ]
    }),
    terser()
  ],
  external: []
};