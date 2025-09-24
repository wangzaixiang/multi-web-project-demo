# 外部依赖自动化管理系统

## 🎯 问题解决

随着项目复杂度增长，手动维护外部依赖配置变得繁琐且容易出错：
- ❌ 需要手动维护 `vite.config.js` 中的 `external` 数组
- ❌ 需要手动维护 `index.html` 中的 `import map`
- ❌ 需要手动复制依赖文件到构建目录
- ❌ 添加新依赖时需要同时更新多个地方

## ✅ 自动化解决方案

### 核心文件

1. **`external-deps.config.js`** - 依赖配置管理器
   - 自动扫描 `package.json` 中的 workspace 依赖
   - 生成 external、import map 和文件复制配置

2. **`vite-plugin-external-deps.js`** - Vite 自动化插件
   - 自动配置 external 依赖
   - 自动更新 HTML 中的 import map
   - 自动复制依赖文件到构建目录

3. **`vite.config.js`** - 简化的 Vite 配置
   - 只需引入插件，无需手动配置依赖列表

## 🚀 使用方法

### 1. 添加新的 workspace 依赖

只需在 `package.json` 中添加依赖：

\`\`\`json
{
  "dependencies": {
    "@demo/new-package": "workspace:*"
  }
}
\`\`\`

### 2. 构建应用

\`\`\`bash
pnpm run build
\`\`\`

系统会自动：
- ✅ 检测到新依赖 `@demo/new-package`
- ✅ 将其添加到 external 配置
- ✅ 更新 HTML 中的 import map
- ✅ 复制 `new-package.js` 到 `assets/` 目录

### 3. 构建日志示例

\`\`\`
🔧 Auto-configured external dependencies: [
  '@demo/lit-all',
  '@demo/h2-core', 
  '@demo/new-package'  // ← 自动检测的新依赖
]
📦 Auto-detected 11 workspace dependencies
📝 Auto-updated import map in index.html
📦 Copied new-package.js to assets/
✅ Auto-copied 11/11 external dependencies
\`\`\`

## 📁 文件结构

\`\`\`
apps/app2/
├── external-deps.config.js     # 依赖配置管理器
├── vite-plugin-external-deps.js # Vite 自动化插件
├── vite.config.js              # 简化的构建配置
├── index.html                  # HTML 模板（自动更新）
└── dist/
    ├── index.html              # 包含自动生成的 import map
    └── assets/
        ├── h2-core.js          # 自动复制的依赖文件
        ├── h2-extra.js
        ├── new-package.js      # 新依赖自动复制
        └── ...
\`\`\`

## ⚙️ 高级配置

### 排除特定依赖

如果需要排除某些 workspace 依赖不作为外部依赖：

\`\`\`javascript
// external-deps.config.js
const workspaceDeps = Object.keys(packageJson.dependencies || {})
  .filter(dep => dep.startsWith('@demo/'))
  .filter(dep => dep !== '@demo/workspace')
  .filter(dep => dep !== '@demo/internal-only'); // 排除内部包
\`\`\`

### 自定义文件路径

修改 `external-deps.config.js` 中的路径模式：

\`\`\`javascript
packages: workspaceDeps.map(dep => ({
  name: dep.replace('@demo/', ''),
  srcPath: \`../../packages/\${dep.replace('@demo/', '')}/dist/index.js\`,
  // 可以自定义其他路径模式
}))
\`\`\`

## 🎉 优势总结

1. **零维护** - 添加新依赖时无需手动配置
2. **自动同步** - 依赖配置自动保持一致性
3. **错误减少** - 避免手动配置导致的错误
4. **开发效率** - 专注于业务逻辑而非构建配置
5. **可扩展** - 易于添加新的自动化功能

## 🔧 迁移指南

### 从手动配置迁移

1. 将现有的 `external` 数组从 `vite.config.js` 中删除
2. 复制 `external-deps.config.js` 和 `vite-plugin-external-deps.js` 到项目中
3. 在 `vite.config.js` 中引入插件
4. 运行构建，验证自动化配置是否正确

这个自动化系统让复杂的多包项目管理变得简单高效！