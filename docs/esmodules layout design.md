# 全局 ESModules 架构设计方案

## 🏗️ 架构概述

## 📁 目录结构设计

### 源代码目录结构
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

### 构建产物目录结构
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

## 🔧 关键设计决策

### 1. 命名约定
- **Import前缀**: `@esm/package-name`
- **物理路径**: `/esmodules/package-name/`  
- **入口文件**: 默认 `index.js`

```javascript
// 应用代码中的导入
import { LitElement } from '@esm/lit-all';
import { H2Button } from '@esm/h2-core';
import { ResourceTree } from '@esm/o2-resource';
```

### 2. 版本管理策略
**选择: 单版本模式**
- `/esmodules/lit-all/index.js` - 总是最新版本
- 简化部署和缓存策略
- 避免版本冲突问题
- 后续可扩展为多版本模式

### 3. 构建依赖处理策略
**核心原则：External vs Bundled 依赖分离**

#### 源代码依赖 vs 构建产物依赖
```javascript
// packages/esm-h2-core/package.json (源代码)
{
  "name": "@esm/h2-core",
  "dependencies": {
    "@esm/lit-all": "workspace:*",      // workspace依赖，构建时外部化
    "@esm/interfaces": "workspace:*",   // workspace依赖，构建时外部化
    "some-util-lib": "^1.0.0"           // 第三方依赖，构建时bundle到index.js中
  },
  "devDependencies": {
    "vite": "^4.0.0",          // 构建工具，不出现在产物中
    "typescript": "^5.0.0"
  }
}

// esmodules/h2-core/package.json (构建产物)
{
  "name": "@esm/h2-core",
  "version": "1.0.0", 
  "main": "index.js",
  "type": "module",
  "exports": {
    ".": "./index.js"
  },
  "dependencies": {
    // 只包含external依赖，已转换为@esm/格式
    "@esm/lit-all": "*",
    "@esm/interfaces": "*"
    // 注意：some-util-lib被bundle了，不出现在这里
    // 注意：没有devDependencies
  },
  "sideEffects": false,
  "meta": {
    "buildTime": "2024-09-24T12:00:00Z",
    "sourcePackage": "@demo/h2-core",
    "buildHash": "abc123"
  }
}
```

#### 依赖分类处理规则
| 源代码依赖             | External标记 | 构建产物依赖            | 处理方式                |
|-------------------|------------|-------------------|---------------------|
| `@esm/lit-all`    | ✅          | `@esm/lit-all`    | 映射到共享模块             |
| `@esm/interfaces` | ✅          | `@esm/interfaces` | 映射到共享模块             |
| `@esm/h2-core`    | ✅          | `@esm/h2-core`    | 映射到共享模块             |
| `some-util-lib`   | ❌          | 无                 | 被bundle到index.js    |
| `typescript`      | N/A        | 无                 | devDependency，构建时使用 |

#### 构建产物的package.json特点
1. **dependencies描述运行时依赖**：只包含构建后模块真正需要的external依赖
2. **自动依赖映射**：源代码依赖自动转换为`@esm/`格式  
3. **无devDependencies**：构建工具依赖不出现在产物中
4. **元信息支持**：提供构建时间、源包名等元信息供工具使用
5. **运行时无关**：package.json仅供静态分析工具使用，运行时通过Import Map解析

#### 依赖构建流程
```bash
# 1. 分析源代码依赖
# 2. 根据external配置决定bundle vs external
# 3. 转换external依赖为@esm/格式  
# 4. 生成构建产物的package.json
# 5. 输出到/esmodules/目录
```

### 4. 源代码包迁移策略
**基于@esm命名体系重构源代码包**

#### 迁移原则
1. **新建@esm源代码包**：为需要共享的外部依赖创建对应的@esm包
2. **优先依赖@esm包**：新的和更新的包优先依赖@esm版本
3. **开发时别名映射**：仅在工具限制时使用vite别名映射

#### 具体迁移计划
```bash
# 阶段1：创建基础@esm源代码包
packages/esm-lit-all/     # 替代外部lit依赖，重新导出lit的所有模块
packages/esm-interfaces/  # 基础接口定义包

# 阶段2：创建组件@esm源代码包  
packages/esm-h2-core/     # 基础UI组件包
packages/esm-h2-extra/    # 扩展UI组件包

# 阶段3：创建业务@esm源代码包
packages/esm-o2-resource/ # 业务组件包
packages/esm-o2-*/        # 其他业务组件包

# 阶段4：应用迁移
apps/app2/                # 更新为依赖@esm/*包
apps/app3/                # 更新为依赖@esm/*包
```

#### workspace配置更新
```json
// package.json
{
  "workspaces": [
    "packages/esm-*",       # 所有@esm源代码包
    "apps/*"                # 应用包
  ]
}
```

### 5. 构建策略
**选择: 分层构建**
```bash
# 阶段1：构建基础层（无依赖）
pnpm -r --filter="./packages/esm-lit-all" build
pnpm -r --filter="./packages/esm-interfaces" build

# 阶段2：构建组件层（依赖基础层）
pnpm -r --filter="./packages/esm-h2-*" build

# 阶段3：构建业务层（依赖组件层）  
pnpm -r --filter="./packages/esm-o2-*" build

# 阶段4：构建应用（依赖esmodules）
pnpm build:app2           # 外部化所有@esm/*依赖
pnpm build:app3           # 外部化所有@esm/*依赖

# 或者自动化构建
pnpm build:esmodules      # 自动按依赖顺序构建所有@esm包
pnpm build:apps          # 构建所有Share模式应用
```

### 6. 开发模式处理
**选择: 原生@esm依赖模式**
- **开发时**：直接使用@esm源代码包，通过workspace:*解析
- **构建时**：@esm包构建到/esmodules/，应用外部化@esm依赖
- **运行时**：通过Import Map解析@esm依赖到/esmodules/

**别名映射（仅限工具限制时使用）**
```javascript
// vite.config.js（仅在必要时使用）
resolve: {
  alias: {
    // 仅在IDE或构建工具无法正确解析时使用
    '@esm/problematic-package': './node_modules/actual-package'
  }
}
```

**注：此方案需要确认后再进行代码实施**