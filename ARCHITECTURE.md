# Project Architecture Documentation

## Feature-Based Folder Structure

This project follows a **feature-based architecture** that promotes clean code principles, maintainability, and scalability. Each feature is self-contained with its own components, pages, hooks, services, types, and utilities.

## 📁 Folder Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── hooks/             # Auth-specific hooks (useAuth)
│   │   ├── pages/             # Auth pages (Login, Register)
│   │   ├── services/          # Auth API services
│   │   ├── types/             # Auth TypeScript interfaces
│   │   ├── utils/             # Auth utility functions
│   │   └── index.ts           # Feature exports
│   │
│   ├── home/                  # Home feature
│   │   ├── components/        # Home-specific components
│   │   ├── hooks/             # Home-specific hooks
│   │   ├── pages/             # Home page
│   │   ├── services/          # Home API services
│   │   ├── types/             # Home TypeScript interfaces
│   │   ├── utils/             # Home utility functions
│   │   └── index.ts           # Feature exports
│   │
│   ├── about/                 # About feature
│   └── contact/               # Contact feature
│
├── shared/                     # Shared across features
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared custom hooks
│   ├── services/              # Global API services
│   ├── types/                 # Global TypeScript interfaces
│   ├── utils/                 # Utility functions
│   ├── constants/             # App constants
│   └── index.ts               # Shared exports
│
├── assets/                    # Static assets
├── App.tsx                    # Main App component
├── main.tsx                   # App entry point
├── index.css                  # Global styles
└── vite-env.d.ts             # Vite type definitions
```

## 🏗️ Architecture Principles

### 1. **Feature-Based Organization**
- Each feature is a self-contained module
- Related code is grouped together
- Easy to locate and modify feature-specific code
- Supports team scalability

### 2. **Clean Import Structure**
```typescript
// Feature exports
import { HomePage } from './features/home'
import { LoginPage, RegisterPage } from './features/auth'
import { NotFound } from './shared'
```

### 3. **Separation of Concerns**
- **Pages**: Route-level components
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks
- **Services**: API calls and business logic
- **Types**: TypeScript interfaces and types
- **Utils**: Pure utility functions

### 4. **Shared Resources**
- Common components (NotFound, Layout, etc.)
- Global hooks (useApi, useLocalStorage, etc.)
- Shared types and interfaces
- Application constants

## 🔧 Technology Stack

- **React 19** + **TypeScript** - Type-safe component development
- **React Router v7** - Client-side routing
- **Tailwind CSS v4.1** - Utility-first styling
- **Vite** - Fast development and build tool

## 📦 Feature Structure Example

Each feature follows the same internal structure:

```typescript
// features/auth/index.ts
export { LoginPage, RegisterPage } from './pages'
export { useAuth } from './hooks'
export { authService } from './services'
export type { User, AuthState } from './types'
```

## 🎯 Benefits

1. **Maintainability**: Easy to find and modify code
2. **Scalability**: Add new features without affecting existing ones
3. **Testability**: Test features in isolation
4. **Team Collaboration**: Different teams can work on different features
5. **Code Reusability**: Shared components and utilities
6. **Type Safety**: Strong TypeScript integration

## 🚀 Getting Started

1. **Add a new feature**:
   ```bash
   mkdir -p src/features/new-feature/{components,pages,hooks,services,types,utils}
   touch src/features/new-feature/index.ts
   ```

2. **Create feature exports**:
   ```typescript
   // src/features/new-feature/index.ts
   export { NewFeaturePage } from './pages'
   export { useNewFeature } from './hooks'
   export type { NewFeatureProps } from './types'
   ```

3. **Update App.tsx**:
   ```typescript
   import { NewFeaturePage } from './features/new-feature'
   ```

## 📋 Best Practices

1. **Keep features independent** - Avoid direct imports between features
2. **Use shared resources** - Put common code in `/shared`
3. **Export through index files** - Clean import paths
4. **Follow naming conventions** - Consistent file and folder names
5. **Type everything** - Leverage TypeScript for better DX
6. **Single responsibility** - One feature, one purpose

This architecture supports long-term maintenance and team collaboration while maintaining clean, readable code.
