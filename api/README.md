# API - Candidates Management

REST API built with NestJS for managing candidates, including the ability to upload additional information via Excel files.

## 🚀 Features

- Create candidates with basic information (ID, name, surname)
- Upload and process Excel files with additional candidate information
- Comprehensive input data validation
- Excel file structure and content validation
- Modular architecture based on NestJS
- Complete unit and e2e tests

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## 🛠️ Installation

```bash
# Install dependencies (from monorepo root)
npm install
```

## 🏃 Running the Application

### Development

```bash
# From monorepo root
npm run dev:back

# or using nx directly
nx serve api
```

The API will be available at: `http://localhost:3000/api`

### Production

```bash
# Production build
nx build api --configuration=production

# Run in production
node dist/api/main.js
```

## 📡 API Endpoints

### POST /api/candidates

Creates a new candidate with additional information from an Excel file.

**Request:**
- Content-Type: `multipart/form-data`

**Body Parameters:**
- `id` (number, required): Unique candidate ID (number)
- `name` (string, required): Candidate's first name (max. 100 characters)
- `surname` (string, required): Candidate's last name (max. 100 characters)
- `excel` (file, required): Excel file with additional information

**Excel File Structure:**

The file must contain the following columns in the first row:
- `Seniority`: Experience level (junior, senior)
- `Years of Experience`: Years of experience (0-99)
- `Availability`: Availability (yes/no 1/0, true/false)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "seniority": "senior",
    "years": 5,
    "availability": true
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## 🧪 Tests

### Unit Tests

```bash
# Run all API unit tests
npm run test:api

# Run in watch mode
npm run test:api:watch

# Run with coverage
npm run test:api:cov
```

### E2E Tests

```bash
# Run API e2e tests
nx run api-e2e:e2e
```

The e2e tests include:
- ✅ Successful candidate creation with valid data
- ✅ Required field validation
- ✅ Excel file structure validation
- ✅ Seniority value validation
- ✅ Years of experience range validation
- ✅ Availability format validation

## 🔍 Validations

The API implements the following validations:

### Basic Fields
- **ID**: Required, must be a valid number
- **Name**: Required, maximum 100 characters
- **Surname**: Required, maximum 100 characters

### Excel File
- **Format**: Must be a valid Excel file (.xlsx, .xls)
- **Structure**: Must contain columns: Seniority, Years of Experience, Availability
- **Content**: Must have at least one data row in addition to the header

### Excel Data
- **Seniority**: Valid values
  - `junior`
  - `senior`
  
- **Years of Experience**: 
  - Must be a number
  - Range: 0-99
  
- **Availability**: Valid values
  - `true` / `false`
  - `1` / `0`
  - `yes` / `no`

## 📁 Project Structure

```
api/
├── src/
│   ├── app/
│   │   ├── app.controller.ts      # Main controller with endpoints
│   │   ├── app.controller.spec.ts # Controller tests
│   │   ├── app.service.ts         # Business logic and validations
│   │   ├── app.service.spec.ts    # Service tests
│   │   └── app.module.ts          # Main application module
│   ├── main.ts                    # Application entry point
│   └── main.serverless.ts         # Serverless deployment configuration
├── jest.config.cts                # Jest configuration
├── project.json                   # Nx project configuration
├── tsconfig.json                  # TypeScript configuration
└── webpack.config.js              # Webpack configuration

api-e2e/
└── src/
    └── api/
        └── api.spec.ts            # API e2e tests
```

## 🏗️ Architecture

The API follows a NestJS-based architecture with the following components:

- **Controller**: Handles HTTP requests and defines endpoints
- **Service**: Contains business logic, validations, and data processing
- **DTOs/Models**: Defined in the shared library `@org/models`

## 🔧 Technologies

- **Framework**: NestJS 11.x
- **Runtime**: Node.js
- **Language**: TypeScript
- **Testing**: Jest
- **Excel Processing**: xlsx
- **File Upload**: Multer
- **Build Tool**: Webpack + Nx

## 📦 Main Dependencies

```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0",
  "@nestjs/platform-express": "^11.0.0",
  "multer": "^2.0.2",
  "xlsx": "^0.18.5"
}
```

## 🐛 Debugging

To run the API in debug mode:

```bash
# Option 1: VS Code
# Use the debug configuration included in .vscode/launch.json

# Option 2: Terminal
node --inspect dist/api/main.js
```

The debugger will be available at `localhost:9229`

## 🚢 Deployment

### Netlify Functions (Serverless)

The API is configured to be deployed as a serverless function on Netlify:

```bash
# Production build
npm run build:prod

# Deploy
netlify deploy --prod
```

### Docker

```bash
# Build the image
nx run api:docker:build

# Run container
nx run api:docker:run
```

## 🤝 Contributing

1. Create a branch for your feature: `git checkout -b feature/new-feature`
2. Make your changes and add tests
3. Ensure all tests pass: `npm run test:api`
4. Run e2e tests: `nx run api-e2e:e2e`
5. Commit your changes: `git commit -m 'feat: description'`
6. Push to the branch: `git push origin feature/new-feature`
7. Open a Pull Request

## 📝 License

MIT

## 👥 Author

Project developed as part of the candidate management system.
