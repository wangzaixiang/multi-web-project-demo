// Vite 插件：自动处理外部依赖
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { getExternalDepsConfig, generateImportMapHTML } from './external-deps.config.js';

/**
 * Vite 插件：自动化外部依赖管理
 */
export function externalDepsPlugin(options = {}) {
  let config;
  let depsConfig;
  
  return {
    name: 'external-deps',
    
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      depsConfig = getExternalDepsConfig();
      console.log(`📦 Auto-detected ${depsConfig.external.length} workspace dependencies`);
    },
    
    config(config) {
      // 自动添加 external 配置
      if (!depsConfig) depsConfig = getExternalDepsConfig();
      
      if (!config.build) config.build = {};
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      
      // 合并 external 配置
      const existingExternal = config.build.rollupOptions.external || [];
      config.build.rollupOptions.external = [
        ...(Array.isArray(existingExternal) ? existingExternal : [existingExternal]),
        ...depsConfig.external
      ].filter(Boolean);
      
      console.log('🔧 Auto-configured external dependencies:', depsConfig.external);
    },
    
    generateBundle() {
      // 自动更新 HTML 模板中的 import map
      const htmlPath = path.resolve(config.root, 'index.html');
      if (existsSync(htmlPath)) {
        let htmlContent = readFileSync(htmlPath, 'utf8');
        const importMapHTML = generateImportMapHTML(depsConfig.importMap);
        
        // 替换 import map 部分
        const importMapRegex = /<script type="importmap">[\s\S]*?<\/script>/;
        if (importMapRegex.test(htmlContent)) {
          htmlContent = htmlContent.replace(importMapRegex, importMapHTML);
          writeFileSync(htmlPath, htmlContent);
          console.log('📝 Auto-updated import map in index.html');
        }
      }
    },
    
    writeBundle() {
      // 自动复制外部依赖文件
      const destDir = path.resolve(config.build.outDir, 'assets');
      mkdirSync(destDir, { recursive: true });
      
      let copiedCount = 0;
      depsConfig.packages.forEach(pkg => {
        const srcPath = path.resolve(config.root, pkg.srcPath);
        const srcMapPath = path.resolve(config.root, pkg.srcMapPath);
        
        try {
          copyFileSync(srcPath, path.join(destDir, `${pkg.name}.js`));
          if (existsSync(srcMapPath)) {
            copyFileSync(srcMapPath, path.join(destDir, `${pkg.name}.js.map`));
          }
          copiedCount++;
          console.log(`📦 Copied ${pkg.name}.js to assets/`);
        } catch (err) {
          console.warn(`⚠️  Failed to copy ${pkg.name}: ${err.message}`);
        }
      });
      
      console.log(`✅ Auto-copied ${copiedCount}/${depsConfig.packages.length} external dependencies`);
    }
  };
}