# Demo Multi-Package JavaScript Project

This is a technical research and validation project exploring the correct working patterns for multi-package JavaScript projects with complex dependencies. The project demonstrates different approaches to Dev and Build phase configurations.

## 🏗️ Architecture Overview

The project follows a **layered architecture** with strict **unidirectional dependencies**:

```
lit
 ↓
interfaces (Pure TypeScript definitions)
 ↓
h2-core (Basic UI components)
 ↓  
h2-extra (Complex UI components)
 ↓
o2-* packages (Business components - independent of each other)
 ↓
apps (Application layer - selective dependencies)
```

## 📦 Package Structure

### Foundation Layer
- **`interfaces`** - Pure TypeScript type definitions with no runtime dependencies
- **`h2-core`** - Basic Lit WebComponents (button, input, select, dialog)
- **`h2-extra`** - Complex components (tree, datagrid)

### Business Layer (o2-* packages)
- **`o2-resource`** - Resource tree management (tree, searcher)
- **`o2-datasource`** - Database connection components (viewer, editor)
- **`o2-sql-view`** - SQL query editor
- **`o2-java-view`** - Java code editor
- **`o2-cube`** - Multi-dimensional data analysis
- **`o2-dashboard`** - Dashboard designer

### Application Layer
- **`app1`** - **Full Bundle Mode**: All dependencies bundled into single file
- **`app2`** - **Split Package Mode**: Dependencies split into separate chunks
- **`app3`** - **Minimal Setup**: Only core components

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- pnpm 8+

### Installation
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build:packages

# Start development servers
pnpm run dev
```

### Running Applications

#### App1 (Full Bundle)
```bash
cd apps/app1
pnpm run dev
# Visit http://localhost:3001

vite build && vite preview  # build mode
```

#### App2 (Split Package)
```bash
cd apps/app2
pnpm run dev
# Visit http://localhost:3002

cd ../../
pnpm run build:esmodules # 构建所有的共享模块到 /esmodules/ 目录下
cd apps/app2
vite build && vite preview  # build mode
```

#

## 🔧 Development vs Build Strategies

### Development Phase
- **Tool**: Vite development server
- **Features**: Hot Module Replacement (HMR)
- **Approach**: Direct ESM module consumption, no bundling
- **Benefits**: Fast development cycle, instant updates

### Build Phase

#### App1: Full Bundle Strategy
- **Approach**: Single JavaScript bundle containing all dependencies
- **Benefits**: Simple deployment, no external dependencies
- **Trade-offs**: Larger initial bundle, lower cache efficiency
- **Use Case**: Simple deployments, intranet applications

#### App2: Split Package Strategy  
- **Approach**: Separate chunks for different dependency groups
- **Chunks**: `lit.js`, `h2-core.js`, `h2-extra.js`, `o2-resource.js`, etc.
- **Benefits**: Better caching, faster subsequent loads, selective loading
- **Trade-offs**: More complex deployment, dependency management
- **Use Case**: Public web applications, performance-critical scenarios

#### App3: Minimal Strategy
- **Approach**: Only essential dependencies, external CDN for common libraries
- **Benefits**: Smallest bundle size, fastest initial load
- **Trade-offs**: External dependencies, potential compatibility issues
- **Use Case**: Widgets, embedded components, micro-frontends


## 📁 Project Structure

```
demo/
├── package.json                 # Root workspace configuration
├── README.md                   # Project documentation
│
├── docs/                       # Documentation
│   ├── Build-Workflow.md       # Build process documentation
│   └── esmodules layout design.md  # ESModules architecture design
│
├── scripts/                    # Build scripts
│   └── build-esmodules.js      # ESM packages build automation
│
├── packages/                   # Source packages (ESM modules)
│   ├── esm-lit-all/           # Lit framework bundle (@esm/lit-all)
│   │   ├── src/index.ts       # Re-export Lit components
│   │   ├── package.json       # Package configuration
│   │   └── vite.config.js     # Build configuration
│   ├── esm-interfaces/        # TypeScript interfaces (@esm/interfaces)
│   ├── esm-h2-core/          # Basic UI components (@esm/h2-core)
│   ├── esm-h2-extra/         # Complex UI components (@esm/h2-extra)
│   ├── esm-o2-resource/      # Resource management (@esm/o2-resource)
│   ├── esm-o2-datasource/    # Data source tools (@esm/o2-datasource)
│   ├── esm-o2-sql-view/      # SQL editor (@esm/o2-sql-view)
│   ├── esm-o2-java-view/     # Java editor (@esm/o2-java-view)
│   ├── esm-o2-cube/          # Cube analysis (@esm/o2-cube)
│   └── esm-o2-dashboard/     # Dashboard designer (@esm/o2-dashboard)
│
├── esmodules/                  # Built ESM packages (deployment artifacts)
│
└── apps/                      # Applications
    ├── app1/                  # Full bundle app (SPA mode)
    │   ├── src/main.ts        # Application entry point
    │   ├── index.html         # HTML template
    │   ├── package.json       # App dependencies
    │   └── vite.config.js     # Vite build config
    ├── app2/                  # Split package app (Share mode)
    │   ├── src/main.ts        # Application entry point
    │   ├── index.html         # HTML with Import Maps
    │   ├── vite-plugin-esm-externals.js  # Custom Vite plugin
    │   ├── package.json       # App dependencies
    │   └── vite.config.js     # Vite build config with externals
    └── app3/                  # Minimal app (planned)
```

### Key Structure Notes

- **Source Packages** (`packages/esm-*`): Development-time source code with full TypeScript support
- **Built Packages** (`esmodules/*`): Production-ready ES modules with simplified package.json
- **Applications** (`apps/*`): Different deployment strategies demonstrating the architecture
- **Scripts** (`scripts/`): Automation tools for building and managing packages
- **Documentation** (`docs/`): Detailed architecture and build process documentation