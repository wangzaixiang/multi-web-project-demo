# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a technical research and validation project exploring the correct working patterns for multi-package JavaScript projects with complex dependencies. The project focuses on solving Dev and Build phase configuration challenges.

## Architecture Design

### Core Principles
1. **Strict avoidance of circular dependencies**: All packages maintain unidirectional dependency relationships
2. **Interface-driven design**: Packages depend on interfaces, not implementations
3. **Layered architecture**: Foundation layer → Business layer → Application layer

### Dependency Hierarchy
```
lit
 ↓
interfaces (Interface definition package)
 ↓
h2-core (Basic components)
 ↓  
h2-extra (Complex components, can depend on h2-core)
 ↓
o2-* packages (Business components, completely independent from each other, only depend on interfaces)
 ↓
apps (Application layer, can selectively depend on upper layer packages)
```

### Package Structure
- **interfaces**: Pure TypeScript type definitions with no runtime dependencies
- **h2-core**: Lit-based basic WebComponent library (h2-input, h2-button, h2-select, h2-dialog)
- **h2-extra**: Complex basic components (h2-tree, h2-datagrid)
- **o2-resource**: Resource tree business components (resource-tree, resource-searcher)
- **o2-datasource**: Data source components (viewer, editor)
- **o2-sql-view**: SQL view components
- **o2-java-view**: Java view components
- **o2-cube**: Multi-dimensional analysis components
- **o2-dashboard**: Dashboard components
- **apps**: Application instances (app1: full bundle mode, app2: split package mode, app3: other instances)

## Development Approach

### Dev Phase Strategy
- Use **Vite** as development server
- Support HMR (Hot Module Replacement)
- Avoid bundling dependencies, use ESM modules directly

### Build Phase Strategy
#### App1 (Full Bundle Mode)
- Use Rollup to bundle all dependencies into a single bundle
- No external dependencies on lit, h2-core, h2-extra, o2-xxx
- Pros: Simple deployment, no external dependencies
- Cons: Larger bundle size, lower cache efficiency

#### App2 (Split Package Mode)
- Depends on independent packages like h2-core.js, h2-extra.js, o2-resource.js
- Each dependency package is bundled independently without including lower layer dependencies
- Pros: Better caching strategy and loading performance
- Cons: Need to manage version dependencies of multiple packages

## Tech Stack
- **Package management**: pnpm workspaces
- **Build tools**: Vite (Dev) + Rollup (Build)
- **Version management**: changeset
- **Component library**: Lit (WebComponents)
- **Type checking**: TypeScript
- **Development server**: Vite multi-entry + proxy

## Key Interface Definitions

The project uses interface-driven design with core interfaces including:
- `IComponent`: Basic component lifecycle (render, destroy)
- `IEventEmitter`: Event handling system
- `IResourceNode`: Resource tree node structure
- `IResourceOperation`: Resource operations (rename, move, copy, delete)
- `IViewer<T>`: Data viewer interface
- `IEditor<T>`: Data editor interface
- `ITreeComponent`: Tree component interface

## Dependency Management Principles
1. **Unidirectional dependencies**: Strictly maintain top-down dependency relationships
2. **Interface isolation**: Define contracts through the interfaces package
3. **Version locking**: Use exact version numbers to avoid unexpected updates
4. **On-demand imports**: Support tree-shaking optimization

## Important Notes
This is currently a design and planning repository. The actual package implementations following this architecture are not yet created. When implementing packages, follow the strict layered architecture and interface-driven design principles outlined in design.md.