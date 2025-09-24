// 外部依赖自动化配置
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 自动扫描 workspace 依赖，生成外部依赖配置
 */
export function getExternalDepsConfig() {
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  // 扫描所有以 @demo/ 开头的 workspace 依赖
  const workspaceDeps = Object.keys(packageJson.dependencies || {})
    .filter(dep => dep.startsWith('@demo/'))
    .filter(dep => dep !== '@demo/workspace'); // 排除根工作区
  
  // 生成配置
  const config = {
    // Vite external 配置
    external: workspaceDeps,
    
    // Import map 映射
    importMap: workspaceDeps.reduce((map, dep) => {
      const fileName = dep.replace('@demo/', '') + '.js';
      map[dep] = `/assets/${fileName}`;
      return map;
    }, {}),
    
    // 需要复制的包文件
    packages: workspaceDeps.map(dep => ({
      name: dep.replace('@demo/', ''),
      srcPath: `../../packages/${dep.replace('@demo/', '')}/dist/index.js`,
      srcMapPath: `../../packages/${dep.replace('@demo/', '')}/dist/index.js.map`
    }))
  };
  
  return config;
}

/**
 * 生成 import map HTML 片段
 */
export function generateImportMapHTML(importMap) {
  return `    <script type="importmap">
    {
        "imports": ${JSON.stringify(importMap, null, 11)}
    }
    </script>`;
}

export default getExternalDepsConfig();