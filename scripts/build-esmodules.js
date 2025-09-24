#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// ESM packages configuration
const ESM_PACKAGES = [
  // Foundation layer (no dependencies)
  { name: 'esm-lit-all', esmName: 'lit-all', dependencies: [] },
  { name: 'esm-interfaces', esmName: 'interfaces', dependencies: [] },
  
  // Component layer (depends on foundation)
  { name: 'esm-h2-core', esmName: 'h2-core', dependencies: ['@esm/lit-all', '@esm/interfaces'] },
  { name: 'esm-h2-extra', esmName: 'h2-extra', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/interfaces'] },
  
  // Business layer (depends on components)
  { name: 'esm-o2-resource', esmName: 'o2-resource', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/h2-extra', '@esm/interfaces'] },
  { name: 'esm-o2-datasource', esmName: 'o2-datasource', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/h2-extra', '@esm/interfaces'] },
  { name: 'esm-o2-sql-view', esmName: 'o2-sql-view', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/interfaces'] },
  { name: 'esm-o2-java-view', esmName: 'o2-java-view', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/interfaces'] },
  { name: 'esm-o2-cube', esmName: 'o2-cube', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/interfaces'] },
  { name: 'esm-o2-dashboard', esmName: 'o2-dashboard', dependencies: ['@esm/lit-all', '@esm/h2-core', '@esm/interfaces'] }
];

function generatePackageJson(packageConfig, sourcePackageJson) {
  return {
    name: `@esm/${packageConfig.esmName}`,
    version: sourcePackageJson.version || '1.0.0',
    main: 'index.js',
    type: 'module',
    exports: {
      '.': './index.js'
    },
    dependencies: packageConfig.dependencies.reduce((deps, dep) => {
      deps[dep] = '*';
      return deps;
    }, {}),
    sideEffects: false,
    meta: {
      buildTime: new Date().toISOString(),
      sourcePackage: sourcePackageJson.name,
      buildHash: Math.random().toString(36).substring(2, 8)
    }
  };
}

function buildPackage(packageConfig) {
  const sourcePath = resolve(rootDir, 'packages', packageConfig.name);
  
  console.log(`🔨 Building ${packageConfig.name}...`);
  
  try {
    execSync(`pnpm --filter="./packages/${packageConfig.name}" build`, {
      cwd: rootDir,
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${packageConfig.name}:`, error.message);
    return false;
  }
}

function copyToEsmodules(packageConfig) {
  const sourcePath = resolve(rootDir, 'packages', packageConfig.name);
  const distPath = resolve(sourcePath, 'dist');
  const targetPath = resolve(rootDir, 'esmodules', packageConfig.esmName);
  
  console.log(`📦 Processing ${packageConfig.name}...`);
  
  // Build the package first
  if (!buildPackage(packageConfig)) {
    return false;
  }
  
  // Check if built files exist after building
  if (!existsSync(resolve(distPath, 'index.js'))) {
    console.warn(`⚠️  Built files not found for ${packageConfig.name} after building, skipping...`);
    return false;
  }
  
  // Create target directory
  mkdirSync(targetPath, { recursive: true });
  
  // Copy built JavaScript file
  copyFileSync(resolve(distPath, 'index.js'), resolve(targetPath, 'index.js'));
  
  // Copy source map if exists
  if (existsSync(resolve(distPath, 'index.js.map'))) {
    copyFileSync(resolve(distPath, 'index.js.map'), resolve(targetPath, 'index.js.map'));
  }
  
  // Copy TypeScript declaration file if exists
  if (existsSync(resolve(distPath, 'index.d.ts'))) {
    copyFileSync(resolve(distPath, 'index.d.ts'), resolve(targetPath, 'index.d.ts'));
  }
  
  // Copy TypeScript declaration source map if exists
  if (existsSync(resolve(distPath, 'index.d.ts.map'))) {
    copyFileSync(resolve(distPath, 'index.d.ts.map'), resolve(targetPath, 'index.d.ts.map'));
  }
  
  // Read source package.json
  const sourcePackageJson = JSON.parse(readFileSync(resolve(sourcePath, 'package.json'), 'utf8'));
  
  // Generate and write ESM package.json
  const esmPackageJson = generatePackageJson(packageConfig, sourcePackageJson);
  writeFileSync(
    resolve(targetPath, 'package.json'),
    JSON.stringify(esmPackageJson, null, 2)
  );
  
  console.log(`✅ ${packageConfig.name} → /esmodules/${packageConfig.esmName}/`);
  return true;
}

function main() {
  console.log('🚀 Building ESModules...');
  
  // Ensure esmodules directory exists
  const esmodulesDir = resolve(rootDir, 'esmodules');
  mkdirSync(esmodulesDir, { recursive: true });
  
  let successCount = 0;
  let totalCount = ESM_PACKAGES.length;
  
  // Process packages in dependency order (each will be built before copying)
  for (const packageConfig of ESM_PACKAGES) {
    if (copyToEsmodules(packageConfig)) {
      successCount++;
    }
  }
  
  console.log(`\\n🎉 ESModules build complete!`);
  console.log(`✅ Successfully processed ${successCount}/${totalCount} packages`);
  console.log(`📁 Output directory: ${esmodulesDir}`);
  
  if (successCount < totalCount) {
    console.log(`\\n❌ Some packages failed to build or copy`);
    process.exit(1);
  }
}

main();