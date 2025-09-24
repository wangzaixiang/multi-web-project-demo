import { readFileSync, writeFileSync, existsSync, symlinkSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';

/**
 * Vite plugin for ESM externalization
 * 
 * 这个插件的主要功能：
 * 1. **自动依赖检测**: 扫描 package.json 中所有 @esm/* 开头的依赖包
 * 2. **外部化配置**: 将检测到的 @esm/* 依赖标记为 external，不打包到主 bundle 中
 * 3. **Import Map 生成**: 自动生成 Import Map 映射，将 @esm/* 模块指向 /esmodules/ 目录
 * 4. **HTML 注入**: 在构建时将生成的 Import Map 注入到 HTML 文件的 <head> 中
 * 5. **浏览器模块解析**: 让浏览器能够通过 Import Map 正确解析和加载共享的 ESM 模块
 * 
 * 工作流程：
 * - 构建阶段：分析依赖 → 外部化 @esm/* → 生成小体积主 bundle
 * - HTML 处理：生成 Import Map → 注入到 HTML → 浏览器运行时解析
 * 
 * 优势：
 * - 主应用 bundle 体积小（约 10KB vs 160KB）
 * - 共享模块可以被多个应用缓存复用
 * - 支持独立更新和版本管理
 *
 * 
 * 运行时支持：
 * - 构建时自动在 dist/ 目录创建指向根目录 esmodules/ 的符号链接
 * - 确保应用运行时能正确访问 /esmodules/ 路径下的共享模块
 */
export function esmExternalsPlugin() {
  let config;
  let isProduction = false;
  let importMap = null;
  
  return {
    name: 'esm-externals',
    
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isProduction = resolvedConfig.command === 'build';
    },
    
    config(config) {
      if (!config.build) config.build = {};
      if (!config.build.rollupOptions) config.build.rollupOptions = {};
      
      // Auto-detect @esm/* dependencies from package.json
      const packageJsonPath = resolve(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      const esmDependencies = Object.keys(packageJson.dependencies || {})
        .filter(dep => dep.startsWith('@esm/'));
      
      console.log(`📦 Auto-detected ${esmDependencies.length} ESM dependencies:`, esmDependencies);
      
      // Configure external dependencies
      config.build.rollupOptions.external = [
        ...(config.build.rollupOptions.external || []),
        ...esmDependencies
      ];
      
      console.log('🔧 Auto-configured external dependencies for ESM modules');
    },
    
    generateBundle(options, bundle) {
      if (!isProduction) return;
      
      // Generate Import Map
      const packageJsonPath = resolve(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      const esmDependencies = Object.keys(packageJson.dependencies || {})
        .filter(dep => dep.startsWith('@esm/'));
      
      const generatedImportMap = {
        imports: {}
      };
      
      esmDependencies.forEach(dep => {
        const esmName = dep.replace('@esm/', '');
        generatedImportMap.imports[dep] = `/esmodules/${esmName}/index.js`;
      });
      
      console.log('📝 Generated Import Map:', generatedImportMap);
      
      // Store import map for HTML transformation
      importMap = generatedImportMap;
    },
    
    transformIndexHtml(html, ctx) {
      if (!isProduction || !importMap) return html;
      
      // Generate new import map script
      const importMapScript = `<script type="importmap">
${JSON.stringify(importMap, null, 2)}
</script>`;
      
      // Replace existing import map or insert new one
      if (html.includes('<script type="importmap">')) {
        // Replace existing import map
        return html.replace(
          /<script type="importmap">[\s\S]*?<\/script>/,
          importMapScript
        );
      } else {
        // Insert new import map before head closing tag
        return html.replace(
          /<\/head>/,
          `  ${importMapScript}
</head>`
        );
      }
    },
    
    writeBundle() {
      if (!isProduction) return;
      
      // 创建指向根目录 esmodules 的符号链接
      try {
        const distDir = resolve(config.build?.outDir || 'dist');
        const symlinkPath = resolve(distDir, 'esmodules');
        const rootEsmodulesPath = resolve(process.cwd(), '../../esmodules');
        
        // 如果符号链接已存在，先删除
        if (existsSync(symlinkPath)) {
          unlinkSync(symlinkPath);
        }
        
        // 创建符号链接
        symlinkSync(rootEsmodulesPath, symlinkPath, 'dir');
        console.log(`🔗 Created symlink: ${symlinkPath} → ${rootEsmodulesPath}`);
        
      } catch (error) {
        console.warn('⚠️  Failed to create esmodules symlink:', error.message);
      }
      
      console.log('✅ ESM externals plugin completed successfully');
    }
  };
}