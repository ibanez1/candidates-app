# Shared Models

A TypeScript library containing shared data models, interfaces, and types used across the Candidates application. This library provides the single source of truth for all data structures in the application.

## Overview

This library defines the core data models for the Candidates application. All features and services depend on these models to ensure type safety and consistency across the codebase.

## Models

### 1. Candidate Interface

Represents a candidate in the application with their professional information.

```typescript
export interface Candidate {
  id: number;
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
}
```

**Properties:**
- **id**: Unique numeric identifier for the candidate
- **name**: First name of the candidate
- **surname**: Last name of the candidate
- **seniority**: Level of experience - either `'junior'` or `'senior'`
- **years**: Number of years of experience as a number
- **availability**: Boolean flag indicating if the candidate is available for hiring

**Usage:**

```typescript
import { Candidate } from '@org/models';

const candidate: Candidate = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  seniority: 'senior',
  years: 5,
  availability: true
};

// In components
candidates: Candidate[] = [candidate];
selectedCandidate: Candidate | null = null;
```

---

### 2. CandidateInfo Interface

Used for creating or updating candidate records, includes Excel file data for skills/qualifications.

```typescript
export interface CandidateInfo {
  id: number;
  name: string;
  surname: string;
  excel: File | Buffer;
}
```

**Properties:**
- **id**: Numeric identifier (same as Candidate)
- **name**: First name of the candidate
- **surname**: Last name of the candidate
- **excel**: File or Buffer object containing candidate qualifications/skills in Excel format

**Usage:**

```typescript
import { CandidateInfo } from '@org/models';

// In form submission
const formData = new FormData();
const candidateInfo: CandidateInfo = {
  id: 1,
  name: formValue.name,
  surname: formValue.surname,
  excel: excelFile
};

formData.append('id', candidateInfo.id);
formData.append('name', candidateInfo.name);
formData.append('surname', candidateInfo.surname);
formData.append('excel', candidateInfo.excel);
```

---

### 3. ApiResponse Interface

Generic wrapper for API responses ensuring consistent response format across all endpoints.

```typescript
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
```

**Generic Parameter:**
- **T**: The type of data contained in the response

**Properties:**
- **data**: Generic payload containing the actual response data (type T)
- **success**: Boolean indicating whether the API call was successful
- **message**: Optional success message or additional information
- **error**: Optional error message if `success` is false

**Usage:**

```typescript
import { ApiResponse, Candidate } from '@org/models';

// Single candidate response
const response: ApiResponse<Candidate> = {
  data: { id: 1, name: 'John', surname: 'Doe', /* ... */ },
  success: true,
  message: 'Candidate retrieved successfully'
};

// Multiple candidates response
const listResponse: ApiResponse<Candidate[]> = {
  data: [candidate1, candidate2],
  success: true,
  message: 'Candidates loaded'
};

// Error response
const errorResponse: ApiResponse<null> = {
  data: null,
  success: false,
  error: 'Failed to load candidates'
};
```

**In Services:**

```typescript
import { ApiResponse, Candidate } from '@org/models';
import { Observable } from 'rxjs';

@Injectable()
export class CandidatesService {
  constructor(private http: HttpClient) {}

  getCandidates(): Observable<ApiResponse<Candidate[]>> {
    return this.http.get<ApiResponse<Candidate[]>>('/api/candidates');
  }

  getCandidateById(id: number): Observable<ApiResponse<Candidate>> {
    return this.http.get<ApiResponse<Candidate>>(`/api/candidates/${id}`);
  }
}
```

---

## Installation

This library is part of the Nx monorepo and is automatically available to other projects.

```typescript
// Import models in your services, components, or other files
import { Candidate, CandidateInfo, ApiResponse } from '@org/models';
```

## Dependencies

This is a **zero-dependency** library - it only contains TypeScript interfaces and types.

**Peer Dependencies:**
- `typescript` - For type checking and compilation

---

## Usage Examples

### Example 1: Using Candidate Model in a Component

```typescript
import { Component, signal } from '@angular/core';
import { Candidate } from '@org/models';
import { CandidatesService } from '@org/candidates/data';

@Component({
  selector: 'app-candidates-list',
  template: `
    <div>
      @for (candidate of candidates()) {
        <div>
          <h3>{{ candidate.name }} {{ candidate.surname }}</h3>
          <p>Experience: {{ candidate.years }} years</p>
          <p>Level: {{ candidate.seniority }}</p>
          <p>Available: {{ candidate.availability ? 'Yes' : 'No' }}</p>
        </div>
      }
    </div>
  `
})
export class CandidatesListComponent {
  candidates = signal<Candidate[]>([]);

  constructor(private service: CandidatesService) {
    this.loadCandidates();
  }

  loadCandidates() {
    this.service.getCandidates().subscribe(response => {
      if (response.success) {
        this.candidates.set(response.data);
      }
    });
  }
}
```

### Example 2: Using CandidateInfo in a Form

```typescript
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CandidateInfo } from '@org/models';
import { CandidatesService } from '@org/candidates/data';

@Component({
  selector: 'app-candidate-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="surname" placeholder="Surname" />
      <input type="file" #excelFile accept=".xlsx,.xls" />
      <button type="submit">Create Candidate</button>
    </form>
  `
})
export class CandidateFormComponent {
  form = this.fb.group({
    name: [''],
    surname: ['']
  });

  constructor(
    private fb: FormBuilder,
    private service: CandidatesService
  ) {}

  onSubmit() {
    const excelFile = (document.querySelector('#excel') as HTMLInputElement)?.files?.[0];
    
    if (!excelFile) {
      alert('Please select an Excel file');
      return;
    }

    const candidateInfo: CandidateInfo = {
      id: 0, // Will be assigned by backend
      name: this.form.value.name || '',
      surname: this.form.value.surname || '',
      excel: excelFile
    };
  }
}
```

### Example 3: Type-Safe API Responses

```typescript
import { ApiResponse, Candidate } from '@org/models';

// Type-safe response handling
const handleResponse = (response: ApiResponse<Candidate>) => {
  if (response.success) {
    // TypeScript knows response.data is Candidate
    console.log(`${response.data.name} ${response.data.surname}`);
    console.log(response.message); // Success message
  } else {
    // Handle error
    console.error(response.error); // Error message
  }
};
```

---

## Best Practices

### ✅ DO:
- Import models from `@org/models` in all services and components
- Use `ApiResponse<T>` wrapper for all HTTP responses
- Extend models with feature-specific interfaces if needed
- Keep models in sync across frontend and backend
- Add JSDoc comments to model properties for documentation

### ❌ DON'T:
- Create duplicate interfaces in feature libraries
- Use `any` type instead of specific model types
- Modify models for temporary fixes (create new interfaces instead)
- Store API responses in incorrect format
- Use models from `@org/models` directly in NgRx actions without mapping

---
