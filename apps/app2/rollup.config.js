import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import html from '@rollup/plugin-html';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    manualChunks: {
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
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
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
    terser(),
    html({
      title: 'Demo App2 - Split Package',
      template: ({ attributes, files, meta, publicPath, title }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }
        
        .header {
            background: #27ae60;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .info-panel {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .app-panel {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .chunk-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .chunk-item {
            background: #e8f5e8;
            padding: 0.5rem;
            border-radius: 4px;
            text-align: center;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📦 Demo Application 2 - Split Package Mode</h1>
        <p>Dependencies split into separate chunks for better caching and loading performance</p>
    </div>
    
    <div class="container">
        <div class="info-panel">
            <h2>📊 Package Structure</h2>
            <p>This application uses a split package approach where dependencies are broken into separate chunks:</p>
            
            <div class="chunk-list">
                <div class="chunk-item">lit.js</div>
                <div class="chunk-item">h2-core.js</div>
                <div class="chunk-item">h2-extra.js</div>
                <div class="chunk-item">o2-resource.js</div>
                <div class="chunk-item">o2-datasource.js</div>
                <div class="chunk-item">o2-views.js</div>
                <div class="chunk-item">o2-analytics.js</div>
                <div class="chunk-item">main.js</div>
            </div>
            
            <p><strong>Benefits:</strong> Better caching, faster subsequent loads, selective loading</p>
        </div>
        
        <div class="app-panel">
            <h2>🚀 Application</h2>
            <demo-app2></demo-app2>
        </div>
    </div>
    
    ${files.js.map(f => `<script type="module" src="${publicPath}${f.fileName}"></script>`).join('\n    ')}
</body>
</html>`;
      }
    })
  ]
};