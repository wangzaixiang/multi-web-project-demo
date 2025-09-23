import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    manualChunks: {
      'lit': ['lit'],
      'h2-core': ['@demo/h2-core'],
      'h2-extra': ['@demo/h2-extra'],
      'o2-resource': ['@demo/o2-resource'],
      'o2-datasource': ['@demo/o2-datasource'],
      'o2-views': ['@demo/o2-sql-view', '@demo/o2-java-view'],
      'o2-analytics': ['@demo/o2-cube', '@demo/o2-dashboard']
    }
  },
  external: [],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};