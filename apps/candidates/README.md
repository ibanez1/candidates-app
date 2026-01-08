# Candidates - Frontend Application

Angular application for managing candidates with a modern, responsive interface built with Angular 21 and Angular Material.

## 🚀 Features

- **Candidate Management**: View, create, and manage candidate profiles
- **Excel Upload**: Upload candidate information via Excel files
- **Angular Material**: Angular Material components
- **State Management**: NgRx Store for predictable state management
- **Server-Side Rendering (SSR)**: Improved performance and SEO
- **Modular Architecture**: Feature-based organization with shared libraries
- **Type Safety**: Full TypeScript implementation with strict mode
- **Material Design**: Modern UI with Angular Material components

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI 21.x (optional, uses Nx)

## 🛠️ Installation

```bash
# Install dependencies (from monorepo root)
npm install
```

## 🏃 Running the Application

### Development

```bash
# From monorepo root
npm run dev:front

# or using Nx directly
nx serve candidates

# or npm script
npm start
```

The application will be available at: `http://localhost:4200`

**Note**: The dev server includes proxy configuration to connect to the backend API at `http://localhost:3000/api`

### Production

```bash
# Production build
nx build candidates --configuration=production

# Build output will be in: dist/apps/candidates
```

### Preview Production Build

```bash
# Build and serve production version
nx build candidates --configuration=production
npx http-server dist/apps/candidates/browser -p 4200
```

## 🧪 Tests

### Unit Tests

```bash
# Run all frontend unit tests
npm run test:unit:front

# Run specific tests
nx test candidates

# Run in watch mode
npm run test:unit:front:watch

# Run with coverage
nx test candidates --codeCoverage
```

### E2E Tests

```bash
# Run Playwright E2E tests
npm run test:e2e

# or
nx run candidates-e2e:e2e

# Install Playwright browsers (first time)
npm run e2e:install
```

The E2E tests include:
- ✅ Homepage validation
- ✅ Candidate listing functionality
- ✅ Navigation flow
- ✅ Form interactions
- ✅ API integration

## 📁 Project Structure

```
apps/candidates/
├── src/
│   ├── app/
│   │   ├── app.ts                  # Root component
│   │   ├── app.html                # Root template
│   │   ├── app.css                 # Root styles
│   │   ├── app.spec.ts             # Root component tests
│   │   ├── app.config.ts           # App configuration
│   │   ├── app.config.server.ts    # SSR configuration
│   │   ├── app.routes.ts           # Application routes
│   │   └── app.routes.server.ts    # Server routes for SSR
│   ├── main.ts                     # Browser bootstrap
│   ├── main.server.ts              # Server bootstrap
│   ├── server.ts                   # Express server for SSR
│   ├── index.html                  # HTML template
│   └── styles.css                  # Global styles
├── public/
│   └── favicon.svg                 # Application icon
├── jest.config.ts                  # Jest configuration
├── project.json                    # Nx project configuration
├── proxy.conf.json                 # Dev server proxy config
└── tsconfig.json                   # TypeScript configuration

apps/candidates-e2e/
└── src/
    ├── candidate-listing.spec.ts   # Listing E2E tests
    ├── candidates-homepage.spec.ts # Homepage E2E tests
    └── navigation-flow.spec.ts     # Navigation E2E tests
```

## 🏗️ Architecture

### Feature Libraries

The application uses a modular architecture with shared feature libraries:

- **@org/candidates/feature-candidates**: Main candidate listing and management feature
- **@org/candidates/feature-candidate-form**: Candidate creation form
- **@org/candidates/data**: Data access layer with services and state management
- **@org/candidates/shared-ui**: Reusable UI components
- **@org/shared/models**: Shared TypeScript interfaces and models

### State Management

- **NgRx Store**: For global state management
- **Component State**: For local UI state
- **Services**: For data fetching and business logic

### Routing

The application uses Angular's standalone routing with lazy loading:

```typescript
// app.routes.ts
export const appRoutes: Route[] = [
  {
    path: 'candidates',
    loadComponent: () => import('...feature')
  }
];
```

## 🔧 Technologies

- **Framework**: Angular 21.x
- **State Management**: NgRx 21.x
- **UI Components**: Angular Material 21.x
- **Testing**: Jest + Playwright
- **Build Tool**: Angular CLI + Nx
- **Server-Side Rendering**: Angular SSR
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router

## 📦 Main Dependencies

```json
{
  "@angular/core": "^21.0.6",
  "@angular/material": "^21.0.0",
  "@angular/router": "^21.0.6",
  "@angular/ssr": "^21.0.3",
  "@ngrx/store": "^21.0.1",
  "@ngrx/effects": "^21.0.1",
  "rxjs": "~7.8.0"
}
```

## 🎨 Styling

- **CSS Framework**: Custom CSS with CSS variables
- **Component Library**: Angular Material

## 🔗 API Integration

The frontend connects to the NestJS backend API:

- **Base URL**: `http://localhost:3000/api` (dev)
- **Proxy Configuration**: See `proxy.conf.json`
- **Endpoints**:
  - `POST /api/candidates`: Create new candidate

## 🌐 Server-Side Rendering (SSR)

The application supports SSR for improved performance and SEO:

```bash
# Build for SSR
nx build candidates --configuration=production

# The build outputs both browser and server bundles
# Browser: dist/apps/candidates/browser
# Server: dist/apps/candidates/server
```

## 🚢 Deployment

### Static Deployment (SPA)

```bash
# Build for production
nx build candidates --configuration=production

# Deploy the browser folder
# dist/apps/candidates/browser
```

### SSR Deployment

```bash
# Build with SSR
nx build candidates --configuration=production

# Deploy both browser and server folders
# Start the Express server: node dist/apps/candidates/server/server.mjs
```

### Netlify

The application is configured for Netlify deployment with SSR support.

## 📊 Performance

- **Build Size Budgets**:
  - Initial bundle: max 1MB
  - Component styles: max 8KB
- **Lazy Loading**: Feature modules loaded on demand
- **Change Detection**: OnPush strategy for optimal performance
- **Tree Shaking**: Unused code eliminated in production builds

## 🐛 Debugging

### Chrome DevTools

```bash
# Serve with source maps
nx serve candidates
```

### VS Code

Use the included launch configuration in `.vscode/launch.json`

### Angular DevTools

Install the Angular DevTools browser extension for component inspection and profiling.

## 🔍 Code Quality

### Linting

```bash
# Lint the application
nx lint candidates

# Fix auto-fixable issues
nx lint candidates --fix
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit -p apps/candidates/tsconfig.app.json
```

## 🤝 Contributing

1. Create a branch for your feature: `git checkout -b feature/new-feature`
2. Make your changes and add tests
3. Ensure all tests pass: `npm run test:unit:front`
4. Run E2E tests: `npm run test:e2e`
5. Lint your code: `nx lint candidates`
6. Commit your changes: `git commit -m 'feat: description'`
7. Push to the branch: `git push origin feature/new-feature`
8. Open a Pull Request

## 📝 License

MIT

## 👥 Author

Project developed as part of the candidate management system by Alejandro Ibáñez.

## 🔗 Related Projects

- **API**: Backend REST API in `/api`
- **Shared Libraries**: Common models and utilities in `/libs`
- **E2E Tests**: Playwright tests in `/apps/candidates-e2e`
