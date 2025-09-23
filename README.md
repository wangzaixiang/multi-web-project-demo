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
```

#### App2 (Split Package)
```bash
cd apps/app2
pnpm run dev
# Visit http://localhost:3002
```

#### App3 (Minimal)
```bash
cd apps/app3
pnpm run dev
# Visit http://localhost:3003
```

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

## 🛠️ Build Commands

```bash
# Build all packages
pnpm run build

# Build only packages (not apps)
pnpm run build:packages

# Build only applications
pnpm run build:apps

# Clean all build outputs
pnpm run clean

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

## 📁 Project Structure

```
demo/
├── package.json                 # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace setup
├── tsconfig.json               # Global TypeScript config
├── vite.config.js              # Global Vite config
├── CLAUDE.md                   # Claude Code guidance
│
├── packages/                   # Shared packages
│   ├── interfaces/             # TypeScript interfaces
│   ├── h2-core/               # Basic components
│   ├── h2-extra/              # Complex components
│   ├── o2-resource/           # Resource management
│   ├── o2-datasource/         # Data source tools
│   ├── o2-sql-view/           # SQL editor
│   ├── o2-java-view/          # Java editor
│   ├── o2-cube/               # Cube analysis
│   └── o2-dashboard/          # Dashboard designer
│
└── apps/                      # Applications
    ├── app1/                  # Full bundle app
    ├── app2/                  # Split package app
    └── app3/                  # Minimal app
```

## 🔍 Key Features Demonstrated

### Interface-Driven Design
- All packages depend on interfaces, not implementations
- Clear contracts between layers
- Easy testing and mocking

### Dependency Management
- Strict unidirectional dependencies
- No circular dependencies
- Version consistency across packages

### Build Optimization
- Tree-shaking support
- Selective dependency loading
- Multiple bundling strategies

### Development Experience
- Hot module replacement
- TypeScript support
- Modular development

## 🎯 Technical Considerations

### Performance
- **App1**: Larger initial bundle, faster subsequent navigation
- **App2**: Smaller initial bundle, optimized caching, lazy loading
- **App3**: Minimal bundle, external dependencies

### Maintainability
- Clear separation of concerns
- Interface-based contracts
- Independent package development

### Scalability
- Easy to add new packages
- Flexible dependency management
- Multiple deployment strategies

## 🧪 Testing the Architecture

1. **Dependency Validation**: Ensure no circular dependencies
2. **Build Verification**: Test all three build strategies
3. **Performance Testing**: Compare bundle sizes and load times
4. **Development Workflow**: Verify HMR and development experience

## 📊 Bundle Analysis

After building, you can analyze bundle sizes:

```bash
# App1 (Full Bundle)
cd apps/app1 && pnpm run build
ls -la dist/

# App2 (Split Package)  
cd apps/app2 && pnpm run build
ls -la dist/

# App3 (Minimal)
cd apps/app3 && pnpm run build
ls -la dist/
```

## 🤝 Contributing

This is a research project. Key principles:

1. Maintain strict dependency hierarchy
2. Follow interface-driven design
3. Test all build strategies
4. Document architectural decisions

## 📄 License

This project is for technical research and demonstration purposes.