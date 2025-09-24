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
// FIXME 在这里补充 micro-module 源项目的 package.json 及 部署后的 package.json 的差异

## 1.5 使用 micro-module
```javascript
// 应用代码中的导入
import { LitElement } from '@esm/lit-all';
import { H2Button } from '@esm/h2-core';
import { ResourceTree } from '@esm/o2-resource';
```

## 1.6 将第三方库封装成为 micro-module
//FIXME 

# 2. 构建设计

## 2.1 micro-module 项目构建
// FIXME：补充基本原子

### 2.1.1 Vite 构建够方式

### 2.1.2 rollup 构建方式

## 2.2 app 项目构建
// FIXME：补充基本原则

### 2.2.1 Vite 构建方式

### 2.2.2 rollup 构建方式



