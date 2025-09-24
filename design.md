# 项目架构设计

## 概述

本项目是一个技术预研验证项目，探索多个 JavaScript package 项目的正确工作方式，重点解决 Dev 和 Build 阶段的配置问题。

## 核心原则

1. **严格避免循环依赖**: 所有包之间保持单向依赖关系
2. **接口驱动设计**: 包间通过接口依赖，而非实现依赖
3. **分层架构**: 基础层 → 业务层 → 应用层

## 架构分层

```
lit
 ↓
interfaces (接口定义包)
 ↓
h2-core (基础组件)
 ↓  
h2-extra (复杂组件，可依赖h2-core)
 ↓
o2-* 包 (业务组件，各包之间完全独立，仅依赖接口)
 ↓
apps (应用层，可选择性依赖上层包)
```

## 包结构说明

### 基础层
- **interfaces**: 纯 TypeScript 类型定义，无运行时依赖
- **h2-core**: 基于 Lit 的基础 WebComponent 组件库 (h2-input, h2-button, h2-select, h2-dialog)
- **h2-extra**: 复杂基础组件 (h2-tree, h2-datagrid)

### 业务层 (o2-* 包)
- **o2-resource**: 资源树相关业务组件
  - o2-resource-tree: 资源树组件
  - o2-resource-searcher: 资源搜索组件
- **o2-datasource**: 数据源组件
  - o2-datasource-viewer
  - o2-datasource-editor
- **o2-sql-view**: SQL视图组件
- **o2-java-view**: Java视图组件
- **o2-cube**: 多维分析组件
- **o2-dashboard**: 仪表板组件

### 应用层
- **app1**: 全打包模式应用
- **app2**: 分包模式应用
- **app3**: 其他应用实例

TODO: 
1. 每个模块均构建出一个独立的 esm 模块，包括该模块的全部代码。
   - 包括的依赖（需在构建文件中声明）
   - 不包括的依赖（默认不包括依赖）

## 目录结构

```
demo/
├── package.json                 # 根包配置，workspace管理
├── pnpm-workspace.yaml         # pnpm workspace配置  
├── tsconfig.json               # 全局TS配置
├── vite.config.js              # Dev环境配置
├── rollup.config.js            # Build环境配置
│
├── packages/
│   ├── interfaces/             # 接口定义包
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── resource.ts     # 资源相关接口
│   │   │   ├── viewer.ts       # 查看器接口  
│   │   │   ├── editor.ts       # 编辑器接口
│   │   │   ├── tree.ts         # 树节点接口
│   │   │   └── common.ts       # 通用接口
│   │   └── dist/
│   │
│   ├── h2-core/                # 基础组件库
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   └── dialog/
│   │   │   └── styles/
│   │   └── dist/
│   │
│   ├── h2-extra/               # 复杂基础组件
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── tree/
│   │   │   │   └── datagrid/
│   │   │   └── styles/
│   │   └── dist/
│   │
│   ├── o2-resource/            # 资源树业务组件
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── resource-tree/
│   │   │   │   └── resource-searcher/
│   │   │   └── services/
│   │   └── dist/
│   │
│   ├── o2-datasource/          # 数据源业务组件
│   │   ├── package.json  
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── datasource-viewer/
│   │   │   │   └── datasource-editor/
│   │   │   └── services/
│   │   └── dist/
│   │
│   ├── o2-sql-view/            # SQL视图组件
│   ├── o2-java-view/           # Java视图组件  
│   ├── o2-cube/                # 多维分析组件
│   └── o2-dashboard/           # 仪表板组件
│
└── apps/
    ├── app1/                   # 全打包应用
    │   ├── package.json
    │   ├── src/
    │   │   ├── index.html
    │   │   ├── main.ts
    │   │   └── components/
    │   ├── vite.config.js      # Dev配置
    │   ├── rollup.config.js    # Build配置(全打包)
    │   └── dist/
    │
    ├── app2/                   # 分包应用
    │   ├── package.json
    │   ├── src/
    │   │   ├── index.html
    │   │   ├── main.ts  
    │   │   └── components/
    │   ├── vite.config.js      # Dev配置
    │   ├── rollup.config.js    # Build配置(分包)
    │   └── dist/
    │
    └── app3/                   # 另一个应用实例
```

## 各包内部结构模板

### packages结构模板
```
packages/[package-name]/
├── package.json              # 包配置
├── tsconfig.json            # 本包TS配置
├── vite.config.js           # Dev构建配置
├── rollup.config.js         # Prod构建配置
├── src/
│   ├── index.ts             # 主入口，导出所有公共API
│   ├── components/          # 组件目录
│   │   └── [component-name]/
│   │       ├── index.ts     # 组件导出
│   │       ├── [component].ts # 组件实现
│   │       ├── [component].css # 组件样式
│   │       └── types.ts     # 组件类型定义
│   ├── services/            # 业务逻辑(仅o2-*包)
│   ├── utils/               # 工具函数
│   └── types/               # 内部类型定义
├── dist/                    # 构建输出
│   ├── index.js             # UMD格式
│   ├── index.esm.js         # ESM格式
│   └── index.d.ts           # 类型声明
└── README.md                # 包文档
```

### apps结构模板  
```
apps/[app-name]/
├── package.json             # 应用配置
├── index.html               # 入口HTML
├── vite.config.js           # Dev服务配置
├── rollup.config.js         # Build配置
├── src/
│   ├── main.ts              # 应用入口
│   ├── app.ts               # 应用主组件
│   ├── components/          # 应用特有组件
│   ├── pages/               # 页面组件
│   └── styles/              # 应用样式
└── dist/                    # 构建输出
```

## 接口层设计

### 核心接口定义

```typescript
// packages/interfaces/src/common.ts
export interface IComponent {
  render(): void;
  destroy(): void;
}

export interface IEventEmitter {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, ...args: any[]): void;
}

// packages/interfaces/src/resource.ts
export interface IResourceNode {
  id: string;
  name: string;
  type: 'datasource' | 'sql_view' | 'java_view' | 'cube' | 'dashboard' | 'folder';
  parentId?: string;
  children?: IResourceNode[];
}

export interface IResourceOperation {
  rename(id: string, name: string): Promise<void>;
  move(id: string, targetId: string): Promise<void>;
  copy(id: string, targetId: string): Promise<string>;
  delete(id: string): Promise<void>;
  getProperties(id: string): Promise<Record<string, any>>;
}

// packages/interfaces/src/viewer.ts
export interface IViewer<T = any> extends IComponent {
  load(data: T): Promise<void>;
  refresh(): Promise<void>;
  getViewData(): T;
}

// packages/interfaces/src/editor.ts  
export interface IEditor<T = any> extends IComponent {
  load(data: T): Promise<void>;
  save(): Promise<T>;
  isDirty(): boolean;
  validate(): boolean;
}

// packages/interfaces/src/tree.ts
export interface ITreeNode {
  id: string;
  label: string;
  children?: ITreeNode[];
  expanded?: boolean;
  selected?: boolean;
}

export interface ITreeComponent extends IComponent {
  setData(nodes: ITreeNode[]): void;
  getSelectedNodes(): ITreeNode[];
  expandNode(id: string): void;
  collapseNode(id: string): void;
}
```

## 构建策略

### Dev 阶段
- 使用 **Vite** 作为开发服务器
- 支持 HMR (Hot Module Replacement)
- 避免打包依赖，直接使用 ESM 模块

### Build 阶段

#### App1 (全打包模式)
- 使用 Rollup 将所有依赖打包成单一 bundle
- 不再外部依赖 lit, h2-core, h2-extra, o2-xxx 等
- 优点: 部署简单，无外部依赖
- 缺点: bundle 较大，缓存效率低

#### App2 (分包模式)
- 依赖于 h2-core.js, h2-extra.js, o2-resource.js 等独立包
- 每个依赖包独立打包，不包含下层依赖内容
- 优点: 更好的缓存策略和加载性能
- 缺点: 需要管理多个包的版本依赖

## 技术栈

- **包管理**: pnpm workspaces
- **构建工具**: Vite (Dev) + Rollup (Build)
- **版本管理**: changeset
- **组件库**: Lit (WebComponents)
- **类型检查**: TypeScript
- **开发服务**: Vite 多入口 + 代理

## 依赖管理原则

1. **单向依赖**: 严格保持自上而下的依赖关系
2. **接口隔离**: 通过 interfaces 包定义契约
3. **版本锁定**: 使用精确版本号避免意外更新
4. **按需导入**: 支持 tree-shaking 优化