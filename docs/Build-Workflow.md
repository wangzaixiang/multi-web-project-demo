# Build Workflow

## Overview
Simple build system for ESModules micro-frontend architecture.

## Key Commands

### Clean
```bash
pnpm run clean
```
- 清理所有构建输出和缓存文件
- 删除 `/esmodules/` 全局共享模块目录
- 删除所有 `packages/*/dist` 和 `apps/*/dist` 目录
- 调用各子项目的清理脚本

### Build ESM Packages
```bash
pnpm build:esmodules
```
- Builds all @esm/* packages individually
- Copies built files to `/esmodules/` directory follows the [esmodules layout design.md](esmodules%20layout%20design.md)
- Includes sourcemaps automatically

### Build Apps
```bash
# App2 (split package mode)
cd apps/app2 && pnpm run build

# App1 (full bundle mode) 
cd apps/app1 && pnpm run build
```

## How It Works

### 1. ESM Package Build
- Script: `scripts/build-esmodules.js`
- Process: Build → Copy → Generate package.json
- Output: `/esmodules/package-name/index.js` + sourcemap

### 2. App Build
- Plugin: `vite-plugin-esm-externals.js`
- Auto-detects @esm/* dependencies
- Externalizes them from bundle
- Generates Import Map in HTML

### 3. Result
- **App bundle**: Small (10KB for app2)
- **Dependencies**: Shared ESModules in `/esmodules/`
- **Import Map**: Browser resolves @esm/* to /esmodules/
- **Sourcemaps**: Available for debugging

## File Structure
```
/esmodules/                 # Global shared modules
├── lit-all/
├── h2-core/
├── o2-resource/
└── ...

apps/app2/dist/             # App build output
├── index.html             # Contains Import Map
└── assets/index-*.js      # App bundle
```

## Benefits
- **Caching**: Shared modules cached across apps
- **Performance**: Small app bundles
- **Development**: Fast rebuilds with sourcemaps
- **Deployment**: Single command builds everything