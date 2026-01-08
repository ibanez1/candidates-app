# Candidates App

A comprehensive Angular 21+ application for managing candidate information with Excel file integration, featuring a full-stack architecture with NestJS backend, Material Design UI, NgRx state management, and comprehensive testing infrastructure.

## 🎯 Project Overview

The Candidates App is a monorepo built with Nx that provides a modern, type-safe solution for candidate management. It combines a feature-rich frontend with a robust backend API, supporting candidate creation, listing, viewing, and deletion with Excel file validation.

**Key Technologies:**
- **Frontend**: Angular 21+, Standalone Components, Angular Material
- **Backend**: NestJS, Express.js
- **State Management**: NgRx with Angular Signals
- **Testing**: Jest (unit), Playwright (e2e)
- **Build System**: Nx monorepo
- **Styling**: Material Design, Custom CSS
- **File Processing**: XLSX library for Excel validation
- **Server-Side Rendering**: Angular 21+ SSR support

## 📁 Project Structure

```
candidates-app/
├── apps/
│   ├── candidates/                 # Main Angular application (SSR)
│   └── candidates-e2e/            # Playwright e2e tests
├── api/                           # NestJS backend server
├── libs/
│   ├── candidates/
│   │   ├── data/                 # Data access layer (HTTP services)
│   │   ├── feature-candidate-form/  # Candidate creation form feature
│   │   ├── feature-candidates/      # Candidate list management feature
│   │   └── shared-ui/            # Reusable UI components
│   └── shared/
│       └── models/               # Shared data models & interfaces
├── scripts/                       # Utility scripts
├── nx.json                       # Nx configuration
├── tsconfig.base.json           # TypeScript base configuration
├── jest.config.ts               # Jest configuration
└── netlify.toml                 # Netlify deployment config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **TypeScript**: v5.2+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd candidates-app

# Install dependencies
npm install
```

### Development Server

**Start the backend API (port 3000):**

```bash
npx nx serve api
```

**In a new terminal, start the frontend application (port 4200):**

```bash
npx nx serve candidates
```

Visit `http://localhost:4200` in your browser. The application will automatically reload when you change source files.

### Building for Production

**Build the frontend:**

```bash
npx nx build candidates
```

**Build the backend:**

```bash
npx nx build api
```

Build artifacts will be generated in the `dist/` directory.

## 📚 Library Documentation

### Frontend Libraries

#### [Candidates Feature - Candidate List Management](libs/candidates/feature-candidates/README.md)
Complete documentation for displaying, managing, and interacting with candidate lists. Includes component API, usage examples, testing guide, and state management patterns.

**Key Features:**
- Display candidates in Material table with sorting and pagination
- Modal for viewing, adding, and deleting candidates
- Loading states and error handling
- NgRx store integration for state management

#### [Candidate Form Feature - Candidate Creation](libs/candidates/feature-candidate-form/README.md)
Comprehensive guide for the candidate creation form with Excel file validation. Documents form fields, validation rules, submission flow, and error handling.

**Key Features:**
- Reactive form with validation
- Excel file upload and validation
- Form state management with NgRx
- Error recovery and user feedback

#### [Shared UI Components](libs/candidates/shared-ui/README.md)
Reusable UI component library used across features. Documents all components, their APIs, and usage patterns.

**Components:**
- **CandidateGridComponent** - Data grid with sorting, pagination, and resizing
- **ModalComponent** - Modal dialog with content projection
- **LoadingSpinnerComponent** - Loading indicator
- **ErrorMessageComponent** - Error display with retry

#### [Candidates Data Layer](libs/candidates/data/README.md)
Data access layer providing HTTP services for candidate operations and state management setup.

**Provides:**
- `CandidatesService` - HTTP API communication
- `CandidatesStore` - Signals-based state management
- Type-safe API calls and responses

### Shared Libraries

#### [Shared Models](libs/shared/models/README.md)
Core data models and interfaces used throughout the application.

**Models:**
- **Candidate** - Candidate information with professional details
- **CandidateInfo** - Form data for creating/updating candidates with Excel files
- **ApiResponse<T>** - Generic API response wrapper for type-safe responses

### Backend

#### [NestJS API Server](api/README.md)
Backend API providing candidate management endpoints.

**Endpoints:**
- `POST /api/candidates` - Create new candidate

## 🧪 Testing

### Unit Tests

Run unit tests for all libraries:

```bash
# Test all projects
npx nx run-many --target=test --all

# Test specific library
npx nx test feature-candidates
npx nx test feature-candidate-form
npx nx test shared-ui
npx nx test models
npx nx test api
```

**Test Coverage:**
- **feature-candidates**: 12 tests covering list display, loading, error handling, and CRUD operations
- **feature-candidate-form**: 5 tests covering form rendering, validation, submission, and error handling
- **shared-ui**: Component tests for grid, modal, spinner, and error message
- **models**: Type safety validation tests
- **api**: Controller and service tests for all endpoints

### E2E Tests

Run end-to-end tests with Playwright:

```bash
# Start the frontend server first (in one terminal)
npx nx serve candidates

# In another terminal, run e2e tests
npx nx e2e candidates-e2e
```

**E2E Test Suite:**
- Navigation flow testing
- User interaction simulation
- Form submission flows
- Data grid operations

**Note:** E2E tests require the frontend server to be running. The webServer configuration in `playwright.config.ts` requires manual server startup for reliable test execution.

### Running Tests with Coverage

```bash
# Run tests with coverage report
npx nx test feature-candidates --coverage
npx nx test feature-candidate-form --coverage

# View coverage reports
open coverage/index.html
```

## 📖 Architecture

### Frontend Architecture

```
apps/candidates (SSR Angular App)
├── app.config.ts             # App configuration & providers
├── app.routes.ts             # Application routing
└── app.component.ts          # Root component

libs/candidates/
├── feature-candidates/       # Candidate list feature
│   └── candidates-list.component.ts
├── feature-candidate-form/   # Candidate form feature
│   └── candidate-form.component.ts
├── data/                     # Data access
│   ├── candidates.service.ts
│   └── candidates.store.ts
└── shared-ui/               # Shared components
    ├── candidate-grid/
    ├── modal/
    ├── loading-spinner/
    └── error-message/

libs/shared/
└── models/                   # Shared types
    └── candidate.model.ts
```

### Data Flow

```
Component
    ↓
[User Action]
    ↓
CandidatesService (HTTP)
    ↓
API (http://localhost:3000/api)
    ↓
NestJS Backend
    ↓
[Response]
    ↓
CandidatesStore (Signals)
    ↓
Components Update
```

### State Management

The application uses NgRx with Angular Signals for state management:

```typescript
// Store provides signals for reactive updates
loading$ = this.store.selectSignal(selectLoading);
candidates$ = this.store.selectSignal(selectCandidates);
error$ = this.store.selectSignal(selectError);

// Dispatch actions to update state
this.store.dispatch(loadCandidates());
this.store.dispatch(addCandidate({ candidate }));
this.store.dispatch(removeCandidate({ id }));
```

## 🎨 Styling

The application uses Material Design with custom CSS for additional styling.

**Theme Configuration:**

```scss
// Global styles apply Material theme
@import '@angular/material/prebuilt-themes/indigo-pink.css';

// Custom variables for brand colors
$primary-color: #3f51b5;
$accent-color: #ff4081;
```

**Responsive Design:**
- Mobile-first approach
- Breakpoints for tablet (600px) and desktop (960px)
- Material components automatically adapt to screen size

## 🔧 Configuration

### TypeScript Configuration

Base configuration in `tsconfig.base.json` with path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@org/candidates/*": ["libs/candidates/*"],
      "@org/shared-ui": ["libs/candidates/shared-ui"],
      "@org/models": ["libs/shared/models"],
      "@org/api": ["api/src"]
    }
  }
}
```

### Nx Configuration

Key settings in `nx.json`:

```json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nx/js:node",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "e2e"]
      }
    }
  }
}
```

### Environment Configuration

Frontend environment variables (apps/candidates/):

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api'
};
```

## 📦 Dependencies

### Production Dependencies

**Frontend:**
- `@angular/core` - Angular framework
- `@angular/material` - Material Design components
- `@ngrx/store` - State management
- `@ngrx/effects` - Side effects management
- `rxjs` - Reactive programming

**Backend:**
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common utilities
- `express` - Web server

### Development Dependencies

- `typescript` - Language
- `jest` - Unit testing
- `playwright` - E2E testing
- `eslint` - Code linting
- `prettier` - Code formatting
- `nx` - Monorepo management

## 🐛 Troubleshooting

### E2E Tests Not Running

**Problem**: E2E tests fail with "Cannot navigate to invalid URL"

**Solution**: 
1. Ensure the frontend server is running on port 4200
2. Start server separately: `npx nx serve candidates`
3. Run tests in another terminal: `npx nx e2e candidates-e2e`

### Port Already in Use

**Problem**: "Port 3000/4200 is already in use"

**Solution**:
```bash
# Find process using port
lsof -i :3000
lsof -i :4200

# Kill process (macOS/Linux)
kill -9 <PID>

# Or use different ports
npx nx serve candidates --port 4201
npx nx serve api --port 3001
```

### TypeScript Compilation Errors

**Problem**: "Type 'any' is not assignable to type 'X'"

**Solution**: Check that all models are properly imported:
```typescript
import { Candidate, CandidateInfo } from '@org/models';
```

### Material Theme Not Applied

**Problem**: Styles missing or default theme showing

**Solution**:
1. Ensure Material theme is imported in `styles.css`
2. Check that `provideAnimations()` is in app config
3. Verify Material modules are imported in components

## 🚀 Deployment

### Build Optimization

```bash
# Production build with tree-shaking and minification
npx nx build candidates --configuration=production

# Analyze bundle size
npx nx build candidates --stats-json
```

### Deployment Targets

**Netlify Configuration** (netlify.toml):

```toml
[build]
  command = "npm run build"
  publish = "dist/apps/candidates"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables:**
- Set `API_URL` to production API endpoint
- Configure CORS for production domain

## 📊 Performance

### Best Practices

- **OnPush Change Detection**: All components use OnPush strategy
- **Signals**: Reactive data flow with automatic optimization
- **Lazy Loading**: Feature modules loaded on demand
- **Tree-Shaking**: Unused code automatically removed in production
- **Virtual Scrolling**: Handle large datasets efficiently (future enhancement)

### Metrics

- **Initial Load**: ~2-3 seconds (optimized bundle)
- **Time to Interactive**: ~4-5 seconds
- **Core Web Vitals**: LCP, FID, CLS optimized

## 🔗 Quick Links

- [Feature Candidates Library](libs/candidates/feature-candidates/README.md)
- [Candidate Form Library](libs/candidates/feature-candidate-form/README.md)
- [Shared UI Components](libs/candidates/shared-ui/README.md)
- [Data Access Layer](libs/candidates/data/README.md)
- [Shared Models](libs/shared/models/README.md)
- [Backend API](api/README.md)
- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

Developed with modern Angular and NestJS best practices by Alejandro Ibáñez.

---

**Last Updated**: January 2026  
**Node Version**: v18+  
**Angular Version**: 21+  
**NestJS Version**: 10+
