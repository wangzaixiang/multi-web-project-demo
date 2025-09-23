本项目是一个技术预研验证项目，目的是探索多个 javascript package 项目正确的工作方式。

核心问题：
1. 多个 package 且存在依赖关系时，如何进行 Dev 和 Build 阶段的配置。
2. 在 Dev 阶段，能够支持平滑的开发体验，即代码修改后，即可进行测试，而无需一个复杂的构建过程。
3. 在 Build 阶段，平衡构建输出的大小、网页打开时的请求数、延迟等。

场景：
1. h2-core: 基于 Lit 的 WebComponent 组件库，包括 h2-input, h2-button, h2-select, h2-dialog 等一系列非业务性的常用基础组件。
2. h2-extra: 基于 Lit 的 webcomponent 组件库，包括 h2-tree, h2-datagrid 等加复杂的非技术性组件
3. o2-resource: 资源树相关业务组件(资源树是一个类似于文件系统的对象树，包括datasource, sql_view, java_view, cube, dashboard 等都是具体的业务对象)
   - o2-resource-tree 资源树组件（类似于文件系统），可以以树的方式显示对象资源，并提供对对象的基本操作，如：查看属性、改名、move, copy，权限管理等。
   - o2-resource-searcher 资源树搜索组件
4. o2-datasource
   - o2-datasource-viewer
   - o2-datasource-editor
5. o2-sql-view
6. o2-java-view
7. o2-cube
8. o2-dashboard
9. app{1,2,3}: 应用层组件，基于 o2-xxx 组装成为最终的满足特定 application 需求的 UI。
    - 本项目近为技术预研项目，不需要实际进行复杂的业务设计，各个组件可以简单实现。重点在评估依赖关系及 Dev/Build 阶段的配置

技术考虑点：
1. Dev 阶段避免打包依赖，支持 HRM 开发。
2. Build 阶段：
   - app1: 对依赖的所有js 进行 package，形成一个 bundler。不再外部依赖 lit, h2-core, h2-extra, o2-xxx 等。
   - app2: 该应用依赖于 h2-xxx, o2-xxx，每个依赖的项目打一个包，例如 h2-core.js, o2-resource.js(不包含 h2-xx的内容), lit-all.js
