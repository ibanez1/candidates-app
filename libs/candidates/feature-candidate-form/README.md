# Feature Candidate Form

Angular standalone component library for creating and managing candidate forms with Excel file validation.

## Overview

This library provides a comprehensive form component for adding new candidates to the system. It includes form validation, Excel file upload with strict validation rules, loading states, and error handling.

## Features

- **Standalone Component**: Uses Angular 21+ standalone component architecture
- **Reactive Forms**: Built with Angular Reactive Forms for robust validation
- **Material Design**: Integrated with Angular Material components
- **Excel Validation**: Comprehensive validation of Excel file structure and content
- **NgRx Integration**: Dispatches actions to update the global store
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Detailed error messages from backend API
- **Success Feedback**: Visual confirmation when candidate is created successfully

## Installation

This library is part of the Nx monorepo and is automatically available through path mapping:

```typescript
import { CandidateFormComponent } from '@org/candidates/feature-candidate-form';
```

## Usage

### Basic Usage

```typescript
import { CandidateFormComponent } from '@org/candidates/feature-candidate-form';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CandidateFormComponent],
  template: `
    <candidates-candidate-form 
      (submittedSuccessfully)="onCandidateCreated()">
    </candidates-candidate-form>
  `
})
export class MyComponent {
  onCandidateCreated() {
    console.log('Candidate created successfully!');
  }
}
```

### With Modal

```typescript
import { CandidateFormComponent } from '@org/candidates/feature-candidate-form';

@Component({
  template: `
    <button (click)="openForm()">Add Candidate</button>
    
    @if (showForm) {
      <div class="modal">
        <candidates-candidate-form 
          (submittedSuccessfully)="closeForm()">
        </candidates-candidate-form>
      </div>
    }
  `
})
export class MyComponent {
  showForm = false;
  
  openForm() {
    this.showForm = true;
  }
  
  closeForm() {
    this.showForm = false;
  }
}
```

## API

### Inputs

This component does not accept any inputs.

### Outputs

| Name | Type | Description |
|------|------|-------------|
| `submittedSuccessfully` | `EventEmitter<void>` | Emits when a candidate is successfully created and saved |

### Public Signals

| Signal | Type | Description |
|--------|------|-------------|
| `isLoading` | `boolean` | Indicates if the form is submitting |
| `submitStatus` | `'idle' \| 'success' \| 'error'` | Current submission status |
| `errorMessage` | `string` | Error message when submission fails |
| `selectedFileName` | `string` | Name of the selected Excel file |
| `fileValidationMessage` | `string` | Validation message for the Excel file |
| `fileValidationSuccess` | `boolean` | Indicates if file validation passed |

## Form Fields

### Name
- **Type**: Text input
- **Validation**: Required, max 100 characters
- **Error Messages**:
  - "Name is required"
  - "Name must be 100 characters or less"

### Surname
- **Type**: Text input
- **Validation**: Required, max 100 characters
- **Error Messages**:
  - "Surname is required"
  - "Surname must be 100 characters or less"

### Excel File
- **Type**: File upload
- **Accepted Formats**: `.xlsx`, `.xls`
- **Required**: Yes
- **Validation Rules**:
  - Must have exactly 3 columns: "Seniority", "Years of experience", "Availability"
  - Must have exactly 1 data row (plus header row)
  - All cells must be filled
  - **Seniority**: Must be "junior" or "senior" (case-insensitive)
  - **Years of experience**: Must be a whole number between 0 and 99
  - **Availability**: Must be true/false, 1/0, or yes/no

## Excel File Format

### Required Structure

```
| Seniority | Years of experience | Availability |
|-----------|---------------------|--------------|
| junior    | 5                   | true         |
```

### Valid Examples

**Example 1: Junior Developer**
```
| Seniority | Years of experience | Availability |
|-----------|---------------------|--------------|
| junior    | 2                   | true         |
```

**Example 2: Senior Developer**
```
| Seniority | Years of experience | Availability |
|-----------|---------------------|--------------|
| senior    | 8                   | false        |
```

### Invalid Examples

❌ **Wrong column count**
```
| Seniority | Years of experience |
|-----------|---------------------|
| junior    | 5                   |
```

❌ **Invalid seniority value**
```
| Seniority | Years of experience | Availability |
|-----------|---------------------|--------------|
| mid-level | 5                   | true         |
```

❌ **Multiple data rows**
```
| Seniority | Years of experience | Availability |
|-----------|---------------------|--------------|
| junior    | 5                   | true         |
| senior    | 10                  | false        |
```

## Validation Messages

### File Validation

- ✓ "Valid file" - File passes all validations
- ❌ "Only Excel files are allowed (.xlsx, .xls)" - Wrong file type
- ❌ "Excel file is empty" - No sheets in the file
- ❌ "Excel file has no data" - No rows in the sheet
- ❌ "Excel file must have exactly 3 columns" - Wrong number of columns
- ❌ "Excel must have columns: Seniority, Years of experience, Availability" - Wrong column names
- ❌ "Excel must have exactly 1 data row (plus headers)" - Too many or too few data rows
- ❌ "Data row must have exactly 3 values in the correct columns" - Missing values
- ❌ "All data cells must be filled" - Empty cells detected
- ❌ "Seniority must be 'junior' or 'senior'" - Invalid seniority value
- ❌ "Years of experience must be a whole number between 0 and 99" - Invalid years value
- ❌ "Availability must be true/false, 1/0, or yes/no" - Invalid availability value

## States

### Idle
The form is ready for input.

### Loading
Shows a loading spinner while the candidate is being created (minimum 1.5 seconds for UX).

### Success
Shows a success message with a checkmark icon for 2 seconds, then emits `submittedSuccessfully` event.

### Error
Shows an error message with a close button. User can click "Close" to return to the form.

## Dependencies

- `@angular/core` (v21+)
- `@angular/common`
- `@angular/forms`
- `@angular/material/form-field`
- `@angular/material/input`
- `@angular/material/button`
- `@ngrx/store`
- `xlsx` - For Excel file reading and validation
- `rxjs` - For reactive programming

## Testing

Run unit tests:

```bash
npx nx test feature-candidate-form
```

### Test Coverage

- ✅ Form rendering
- ✅ Required field validation
- ✅ Form submission with valid data
- ✅ Success flow with NgRx dispatch
- ✅ Error handling and display

## Architecture

### Component Structure

```
feature-candidate-form/
├── src/
│   ├── lib/
│   │   └── candidate-form/
│   │       ├── candidate-form.component.ts
│   │       ├── candidate-form.component.css
│   │       └── candidate-form.component.spec.ts
│   ├── index.ts
│   └── test-setup.ts
├── jest.config.ts
├── project.json
├── tsconfig.json
└── README.md
```

### Data Flow

1. User fills in name and surname
2. User selects an Excel file
3. File is validated using XLSX library
4. If valid, user submits the form
5. Component creates `CandidateInfo` object
6. Service sends FormData to API
7. On success: Dispatches `createCandidate` action to store
8. Shows success message and emits event
9. On error: Shows error message from service

### NgRx Integration

The component dispatches the following actions:

```typescript
import { createCandidate } from '@org/candidates/data';

// On successful API response
this.store.dispatch(createCandidate({ candidate: result }));
```

## Styling

The component includes Material Design styles and custom CSS for:
- Form layout and spacing
- File upload button and validation messages
- Loading spinner overlay
- Success/error status messages
- Responsive design

## Error Handling

Errors are handled at multiple levels:

1. **Form Validation Errors**: Displayed inline under each field
2. **File Validation Errors**: Displayed under the file upload button
3. **API Errors**: Displayed in full-screen error state with error message from backend
4. **Network Errors**: Caught and displayed with generic message

## Best Practices

1. Always provide feedback to the user during async operations
2. Validate files before submission to reduce API calls
3. Clear form after successful submission
4. Emit events for parent components to react to success
5. Handle all error cases gracefully

## Future Enhancements

- [ ] Support for multiple file formats (CSV, JSON)
- [ ] Drag-and-drop file upload
- [ ] Preview of parsed Excel data before submission
- [ ] Bulk candidate upload
- [ ] Form autosave to localStorage
- [ ] Progressive validation as user types

## License

Part of the Candidates App monorepo.

## Contributing

This library follows the Nx workspace structure. To add features:

1. Make changes to the component
2. Add/update tests
3. Update this README if API changes
4. Run tests: `npx nx test feature-candidate-form`
5. Run linting: `npx nx lint feature-candidate-form`

## Support

For issues or questions, please contact the development team.
