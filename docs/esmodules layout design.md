# 全局 ESModules 架构设计方案

# 1. 规范定义

## 1.1 概述

## 1.2 源代码目录结构
```
项目根目录/
├── packages/                    # 源代码包目录
│   ├── esm-lit-all/            # @esm/lit-all 源代码包
│   │   ├── src/index.ts
│   │   ├── package.json        # name: "@esm/lit-all"
│   │   └── vite.config.js
│   ├── esm-interfaces/         # @esm/interfaces 源代码包  
│   │   ├── src/index.ts
│   │   ├── package.json        # name: "@esm/interfaces"
│   │   └── vite.config.js
│   ├── esm-h2-core/            # @esm/h2-core 源代码包
│   │   ├── src/               # h2-input, h2-button等常用基础组件
│   │   ├── package.json       # dependencies: {"@esm/lit-all": "workspace:*"}
│   │   └── vite.config.js
│   ├── esm-h2-extra/           # @esm/h2-extra 源代码包
│   │   ├── src/               # h2-datagrid, h2-tree等非常用基础组件
│   │   ├── package.json       # dependencies: {"@esm/h2-core": "workspace:*"}
│   │   └── vite.config.js
│   ├── esm-o2-resource/        # @esm/o2-resource 源代码包
│   │   ├── src/               # 资源管理业务组件
│   │   ├── package.json       # dependencies: {"@esm/h2-core": "workspace:*"}
│   │   └── vite.config.js
│   ├── esm-o2-datasource/      # @esm/o2-datasource 源代码包
│   ├── esm-o2-sql-view/        # @esm/o2-sql-view 源代码包
│   ├── esm-o2-java-view/       # @esm/o2-java-view 源代码包
│   ├── esm-o2-cube/            # @esm/o2-cube 源代码包
│   └── esm-o2-dashboard/       # @esm/o2-dashboard 源代码包
├── apps/
│   ├── app1/                   # SPA模式应用源代码
│   ├── app2/                   # Share模式应用源代码
│   └── app3/                   # Share模式应用源代码
└── esmodules/                  # 构建产物目录（下面详述）
```

## 1.3 构建产物目录结构
```
项目根目录/
├── esmodules/                   # 全局共享模块构建产物
│   ├── lit-all/
│   │   ├── index.js            # 50KB - Lit框架bundle
│   │   ├── package.json        # 运行时依赖信息，使用 @esm/xxx 格式
│   │   └── README.md           # 模块说明文档
│   ├── interfaces/
│   │   ├── index.js            # 130B - 类型定义
│   │   └── package.json
│   ├── h2-core/                # 常用基础组件bundle
│   │   ├── index.js            # 18KB - h2-input, h2-button等
│   │   └── package.json        # dependencies: {"@esm/lit-all": "*"}
│   ├── h2-extra/               # 非常用基础组件bundle
│   │   ├── index.js            # 19KB - h2-datagrid, h2-tree等
│   │   └── package.json        # dependencies: {"@esm/h2-core": "*"}
│   ├── o2-resource/            # 业务组件bundle
│   │   ├── index.js            # 34KB - 资源管理
│   │   └── package.json        # dependencies: {"@esm/h2-core": "*"}
│   ├── o2-datasource/
│   │   ├── index.js            # 18KB - 数据源
│   │   └── package.json
│   ├── o2-sql-view/
│   │   ├── index.js            # 3.7KB - SQL编辑器
│   │   └── package.json
│   ├── o2-java-view/
│   │   ├── index.js            # 3.3KB - Java编辑器
│   │   └── package.json
│   ├── o2-cube/
│   │   ├── index.js            # 3.1KB - 多维分析
│   │   └── package.json
│   └── o2-dashboard/
│       ├── index.js            # 3.4KB - 仪表盘
│       └── package.json
├── apps/
│   ├── app1/dist/              # SPA模式：自包含，不依赖esmodules
│   │   ├── index.html
│   │   └── assets/
│   │       └── index-[hash].js # ~200KB 全量打包
│   ├── app2/dist/              # Share模式：依赖esmodules，使用 @esm/xxx 访问
│   │   ├── index.html          # 包含Import Map指向/esmodules/
│   │   └── assets/             # 仅包含app2私有代码和非共享依赖
│   │       ├── index-[hash].js # ~3KB 应用特定代码
│   │       └── chunk-#-[hash].js # 可能的代码分割
│   └── app3/dist/              # Share模式：依赖esmodules
│       ├── index.html          # 包含Import Map指向/esmodules/
│       └── assets/
│           └── index-[hash].js # ~5KB 应用特定代码
```

## 1.4 定义
1. module level
   - tiny module: 一般指单个开发阶段的源文件，未进行任何 bundle 处理。
   - micro module: 多个 tiny module 经过 Bundle 后成为一个 micro module，例如这个示例项目中的 h2-xxx, o2-xxx 都是一个 micro-module
     
     micro module 平衡了运行时的代码代码共享、以及减少网络访问请求数量以达到最佳的性能。
   - macro module: 如果在 app 层面进行 Single-Page-App 的 bundle，那么最终构建的是一个 macro module
2. esmodule
   本方案中，在运行时，将所有的 micro module 统一到一个规划的目录：/esmodules/ 下，以实现不同应用之间的共享：
   - xxx_project: 是 xxx 的开发项目， 其可以拆分为更细的源代码粒度，但构建后作为一个独立的模块被访问。
   - xxx_project/src/*.{ts,js}   源代码粒度上的模块，偏于更好的模块划分、dev 友好
   - xxx_project 可以依赖其他的 @esm/yyy 模块，这些模块在运行时依赖
   - xxx_project 可与依赖其他的第三方库，一般在构建后 bundle 到私有代码中。
   - 不能在源代码中使用 import '@esm/yyy/path/to/file.js' 这种方式，除非该项目特别支持这种 tiny-module。
3. app
   一个使用 @esm/{xxx, yyy} 的项目
   - 支持以 dev 方式开发，开发有好
   - 支持以 build 方式构建，可以选择 SPA 模式 和 Multi-Micro-Module 模式


## 1.7 micro-module's package.json

### 1.7.1 源项目的 package.json

源项目 (packages/esm-xxx/) 的 package.json 特点：

```json
{
  "name": "@esm/h2-core",
  "version": "1.0.0",
  "description": "Core UI components for ESM modules",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "dependencies": {
    "@esm/lit-all": "workspace:*",
    "@esm/interfaces": "workspace:*"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "files": ["dist"],
  "sideEffects": true
}
```

**关键特点：**
- `dependencies` 使用 `workspace:*` 引用本地工作空间包
- 包含完整的构建脚本和开发依赖
- `sideEffects: true` 确保组件注册代码不被 Tree Shaking
- `files` 字段限制发布内容仅为 `dist` 目录
- 包含 TypeScript 类型定义

### 1.7.2 部署后的 package.json

部署后 (esmodules/xxx/) 的 package.json 特点：

```json
{
  "name": "@esm/h2-core",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./index.js"
  },
  "dependencies": {
    "@esm/lit-all": "*",
    "@esm/interfaces": "*"
  },
  "sideEffects": false,
  "meta": {
    "buildTime": "2025-09-24T08:20:37.746Z",
    "sourcePackage": "@esm/h2-core",
    "buildHash": "o9zbmj"
  }
}
```

**关键差异：**
- 移除了所有开发相关字段 (`scripts`, `devDependencies`, `files`, `description`)
- `dependencies` 版本从 `workspace:*` 改为 `*` 表示运行时依赖
- 简化的 `exports` 配置，只保留主入口
- 移除 `types` 字段，因为构建产物不包含 .d.ts 文件
- `sideEffects: false` 允许运行时优化 (注意：这里需要根据实际情况调整)
- 添加 `meta` 字段记录构建信息 (构建时间、源包名、构建哈希)

## 1.5 使用 micro-module
```javascript
// 应用代码中的导入
import { LitElement } from '@esm/lit-all';
import { H2Button } from '@esm/h2-core';
import { ResourceTree } from '@esm/o2-resource';
```

## 1.6 将第三方库封装成为 micro-module

### 1.6.1 封装原则

将第三方库封装成 micro-module 需要遵循以下原则：

1. **统一命名空间**：使用 `@esm/` 前缀，如 `@esm/lit-all`
2. **版本锁定**：精确指定第三方库版本，避免意外更新
3. **接口统一**：提供一致的导出接口，屏蔽第三方库的复杂性
4. **依赖管理**：正确处理传递依赖，避免重复打包

### 1.6.2 封装示例：@esm/lit-all

**目录结构：**
```
packages/esm-lit-all/
├── src/
│   └── index.ts          # 统一导出接口
├── package.json          # 包配置
├── vite.config.js        # 构建配置
└── README.md            # 使用说明
```

**src/index.ts：**
```typescript
// 重新导出 Lit 核心功能
export * from 'lit';
export * from 'lit/decorators.js';
export * from 'lit/directive.js';
export * from 'lit/async-directive.js';

// 重新导出常用指令
export * from 'lit/directives/class-map.js';
export * from 'lit/directives/style-map.js';
export * from 'lit/directives/when.js';
export * from 'lit/directives/repeat.js';

// 可选：提供简化的导入别名
export { html as staticHtml, svg as staticSvg } from 'lit/static-html.js';
```

**package.json：**
```json
{
  "name": "@esm/lit-all",
  "version": "1.0.0",
  "description": "Lit framework bundle for ESM modules",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "lit": "^3.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "sideEffects": false
}
```

**vite.config.js：**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [], // 将 lit 打包进 bundle
      output: {
        globals: {}
      }
    },
    sourcemap: true
  }
});
```

### 1.6.3 注意事项

1. **版本兼容性**：确保第三方库版本与项目其他依赖兼容
2. **是否打包第三方依赖** 如果这个依赖会在多个 micro-module 中使用，应考虑转换为一个共享的 micro-module, 否则可以直接私有打包。
3. **类型定义**：确保 TypeScript 类型正确导出
4. **文档同步**：维护封装后的 API 文档，说明与原库的差异 

# 2. 构建设计

## 2.1 micro-module 项目构建

### 2.1.1 基本原则

micro-module 项目构建需要遵循以下原则：

1. **依赖外部化**：将上层依赖声明为 external，避免重复打包(私有依赖可以直接打包)
2. **格式统一**：输出 ES Module 格式，保持运行时兼容性
3. **Source Map**：生成 source map 用于开发调试
4. **类型定义**：生成 TypeScript 声明文件 (.d.ts)
5. **副作用标记**：正确标记 sideEffects，支持 Tree Shaking 优化
6. **版本一致性**：确保依赖版本与其他模块兼容

### 2.1.2 Vite 构建方式

**标准 vite.config.js 配置：**

```javascript
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        dts({
            outDir: "dist",
            include: ["src/**/*"]
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'H2Core',
            formats: ['es'],
            fileName: () => 'index.js'
        },
        rollupOptions: {
            // External dependencies - these will be resolved at runtime
            external: [
                '@esm/lit-all',
                '@esm/interfaces'
            ],
            output: {
                dir: 'dist'
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true
    }
});
```

**构建命令：**
```bash
# 开发模式：监听文件变化，自动重新构建
pnpm run dev    # vite build --watch

# 生产构建：一次性构建
pnpm run build  # vite build
```

### 2.1.3 rollup 构建方式
请参考 Vite 的构建方式补充

### 2.1.3 构建流程

**自动化构建脚本 (scripts/build-esmodules.js)：**

1. **清理输出目录**：删除之前的构建产物
2. **并行构建**：同时构建所有 packages/esm-* 包
3. **复制文件**：将构建产物复制到 esmodules/ 目录
4. **生成 package.json**：创建运行时的简化版 package.json
5. **添加元信息**：记录构建时间、源包信息、构建哈希

**构建优化：**

代办: 为了防止 external 等配置出错，考虑增强 vite.config.js 如 rollupOptions.manualChunks 进行检查。


### 2.1.4 构建产物规范

**目录结构：**
```
esmodules/xxx/
├── index.js          # 主入口文件 (ES Module)
├── index.js.map      # Source Map 文件
├── package.json      # 运行时包信息，目前，使用 scripts/build-esmodules.js 生成
└── README.md        # 模块说明文档 (可选)
```

## 2.2 app 项目构建

### 2.2.1 基本原则

app 项目构建支持两种模式，需要遵循以下原则：

1. **模式选择**：根据部署需求选择 SPA 模式或 Share 模式
2. **依赖处理**：正确处理 micro-module 依赖关系
3. **路径解析**：配置正确的模块解析路径
4. **代码分割**：合理进行代码分割，优化加载性能
5. **Import Maps**：在 Share 模式下生成正确的 Import Maps
6. **环境区分**：开发环境和生产环境使用不同的构建策略

### 2.2.2 SPA 模式 (app1)

**特点：**
- 所有依赖打包到单个 bundle
- 无外部依赖，可独立部署
- Bundle 较大，但部署简单

**vite.config.js 配置：**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@esm/lit-all': path.resolve(__dirname, '../../packages/esm-lit-all/src'),
      '@esm/h2-core': path.resolve(__dirname, '../../packages/esm-h2-core/src'),
      '@esm/o2-resource': path.resolve(__dirname, '../../packages/esm-o2-resource/src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 可选：手动代码分割
          'vendor': ['lit'],
          'components': ['@esm/h2-core', '@esm/h2-extra']
        }
      }
    },
    sourcemap: true
  }
});
```

**构建命令：**
```bash
pnpm run build  # 生成完整的自包含应用
```

### 2.2.3 Share 模式 (app2, app3)

**特点：**
- 依赖外部 micro-module
- 使用 Import Maps 解析模块
- Bundle 较小，支持模块复用

**vite.config.js 配置：**

参考 app2/ 的构建方式：
```javascript
import { defineConfig } from 'vite';
import esmExternals from './vite-plugin-esm-externals.js';

export default defineConfig({
  plugins: [
    esmExternals({
      externals: [
        '@esm/lit-all',
        '@esm/h2-core', 
        '@esm/h2-extra',
        '@esm/o2-resource',
        '@esm/o2-datasource'
      ],
      importMaps: {
        '@esm/lit-all': '/esmodules/lit-all/index.js',
        '@esm/h2-core': '/esmodules/h2-core/index.js',
        '@esm/h2-extra': '/esmodules/h2-extra/index.js'
      }
    })
  ],
  resolve: {
    alias: {
      // 开发时指向源码
      '@esm/lit-all': path.resolve(__dirname, '../../packages/esm-lit-all/src'),
      '@esm/h2-core': path.resolve(__dirname, '../../packages/esm-h2-core/src')
    }
  },
  build: {
    rollupOptions: {
      external: [
        '@esm/lit-all',
        '@esm/h2-core',
        '@esm/h2-extra',
        '@esm/o2-resource'
      ]
    }
  }
});
```

**生成的 index.html：**

```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "@esm/lit-all": "/esmodules/lit-all/index.js",
      "@esm/h2-core": "/esmodules/h2-core/index.js",
      "@esm/h2-extra": "/esmodules/h2-extra/index.js",
      "@esm/o2-resource": "/esmodules/o2-resource/index.js"
    }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>
```

### 2.2.4 开发环境配置

**开发服务器特点：**
- 使用源码进行开发，支持 HMR
- 通过 alias 直接指向 packages/esm-*/src
- 无需构建 micro-module，直接使用源码

**开发命令：**
```bash
# SPA 模式开发
cd apps/app1 && pnpm run dev

# Share 模式开发
cd apps/app2 && pnpm run dev
```

### 2.2.5 生产环境部署

**SPA 模式部署：**
```
/app1/
├── index.html
└── assets/
    ├── index-[hash].js    # ~200KB 完整应用
    └── index-[hash].css   # 样式文件
```

**Share 模式部署：**
```
/
├── esmodules/             # 共享模块
│   ├── lit-all/
│   ├── h2-core/
│   └── o2-resource/
├── app2/
│   ├── index.html         # 包含 Import Maps
│   └── assets/
│       └── index-[hash].js # ~3KB 应用特定代码
└── app3/
    ├── index.html
    └── assets/
        └── index-[hash].js # ~5KB 应用特定代码
```

### 2.2.6 构建脚本

**package.json 脚本配置：**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:analyze": "vite build --mode analyze"
  }
}
```

**自动化部署脚本：**
```bash
#!/bin/bash
# 1. 构建所有 micro-modules
pnpm run build:esmodules

# 2. 构建 app1 (SPA 模式)
pnpm -w run build:app1

# 3. 构建 app2, app3 (Share 模式)
pnpm -w run build:app2
pnpm -w run build:app3

# 4. 复制到部署目录
cp -r esmodules/ dist/
cp -r apps/app1/dist/ dist/app1/
cp -r apps/app2/dist/ dist/app2/
cp -r apps/app3/dist/ dist/app3/
```



