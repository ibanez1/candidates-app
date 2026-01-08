# Feature Candidates

Angular standalone component library for displaying and managing a list of candidates.

## Overview

This library provides a comprehensive candidates list component that displays all candidates in a grid/table format with sorting, pagination, and actions for viewing, editing, and deleting candidates. It integrates with NgRx for state management and includes modals for viewing candidate details and confirming deletions.

## Features

- **Standalone Component**: Uses Angular 21+ standalone component architecture
- **Candidate Grid**: Displays candidates in a Material Design table with sorting and pagination
- **CRUD Operations**: Create, Read, Delete candidates
- **Modal Dialogs**: View candidate details, add new candidates, confirm deletions
- **NgRx Integration**: Dispatches actions and reads from the global store
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages with retry functionality
- **Responsive Design**: Works on desktop and mobile devices

## Installation

This library is part of the Nx monorepo and is automatically available through path mapping:

```typescript
import { CandidateListComponent } from '@org/candidates/feature-candidates';
```

## Usage

### Basic Usage

```typescript
import { CandidateListComponent } from '@org/candidates/feature-candidates';

@Component({
  selector: 'app-candidates-page',
  standalone: true,
  imports: [CandidateListComponent],
  template: `<candidate-list></candidate-list>`
})
export class CandidatesPageComponent {}
```

### With Router

```typescript
import { Routes } from '@angular/router';
import { CandidateListComponent } from '@org/candidates/feature-candidates';

export const routes: Routes = [
  {
    path: 'candidates',
    component: CandidateListComponent
  }
];
```

## API

### Inputs

This component does not accept any inputs. It fetches data from the `CandidatesService`.

### Outputs

This component does not emit any outputs. All actions are handled internally through NgRx store.

### Public Signals

| Signal | Type | Description |
|--------|------|-------------|
| `candidates` | `Candidate[]` | Array of all candidates to display |
| `loading` | `boolean` | Indicates if candidates are being loaded |
| `error` | `string \| null` | Error message if loading fails |
| `showModal` | `boolean` | Controls visibility of add candidate modal |
| `selectedCandidate` | `Candidate \| null` | Currently selected candidate for viewing |
| `candidateToDelete` | `Candidate \| null` | Candidate pending deletion |

### Public Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `loadCandidates()` | - | Fetches candidates from the service |
| `onAddCandidate()` | - | Opens the add candidate modal |
| `onCandidateSelect(candidate)` | `Candidate` | Opens detail modal for selected candidate |
| `onDeleteCandidate(candidate)` | `Candidate` | Opens delete confirmation modal |
| `confirmDeleteCandidate()` | - | Dispatches delete action to store |

## Features in Detail

### Candidate Grid

The component uses `CandidateGridComponent` to display candidates in a Material Design table with:

- **Sortable Columns**: Click column headers to sort (Name, Surname, Seniority, Years, Availability)
- **Pagination**: Navigate through pages if there are many candidates
- **Action Buttons**: Each row has View and Delete buttons
- **Responsive Layout**: Adapts to different screen sizes

### Add Candidate

Clicking "Add Candidate" button opens a modal with `CandidateFormComponent`:

1. User fills in name, surname, and uploads Excel file
2. Excel file is validated for correct structure
3. On successful validation and submission:
   - Candidate is created via API
   - NgRx store is updated with new candidate
   - Modal closes automatically
   - List refreshes to show new candidate

### View Candidate Details

Clicking "View" button on any candidate:

1. Opens a modal with candidate details
2. Displays: Name, Surname, Seniority, Years of experience, Availability
3. Click outside modal or close button to dismiss

### Delete Candidate

Clicking "Delete" button on any candidate:

1. Opens a confirmation modal
2. User can cancel or confirm deletion
3. On confirmation:
   - Dispatches `deleteCandidate` action to store
   - Store effects handle API call
   - List updates automatically through store subscription

## States

### Loading

Shows a loading spinner while fetching candidates from the API. The entire page content is replaced with the spinner.

### Error

If loading fails, shows an error message with:
- Error description
- Retry button to attempt loading again

### Loaded

Shows the candidate grid with all functionality enabled:
- Add Candidate button
- Sortable table with candidates
- Action buttons on each row

### Empty

If no candidates exist, the grid component handles the empty state display.

## Data Flow

```
┌─────────────────────────────────────────────────┐
│         CandidateListComponent                  │
│                                                 │
│  ngOnInit() → loadCandidates()                 │
│                    ↓                            │
│         CandidatesService.getCandidates()       │
│                    ↓                            │
│         Store (via selector)                    │
│                    ↓                            │
│         candidates signal updated               │
│                    ↓                            │
│         CandidateGridComponent displays         │
└─────────────────────────────────────────────────┘

User Actions:
├─ Add Candidate → showModal = true → CandidateFormComponent
├─ View Candidate → selectedCandidate = candidate → Detail Modal
└─ Delete Candidate → candidateToDelete = candidate → Confirmation Modal
                    → confirmDeleteCandidate() → dispatch(deleteCandidate)
```

## NgRx Integration

### Actions Dispatched

```typescript
import { deleteCandidate } from '@org/candidates/data';

// When user confirms deletion
this.store.dispatch(deleteCandidate({ id: candidate.id }));
```

### Selectors Used

The component subscribes to candidates through `CandidatesService.getCandidates()`, which internally uses NgRx selectors:

```typescript
this.candidatesService.getCandidates().subscribe({
  next: (response) => {
    this.candidates.set(response.items);
    this.loading.set(false);
  }
});
```

## Component Structure

```
feature-candidates/
├── src/
│   ├── lib/
│   │   └── candidates-list/
│   │       ├── candidates-list.component.ts
│   │       ├── candidates-list.component.css
│   │       └── candidates-list.component.spec.ts
│   ├── index.ts
│   └── test-setup.ts
├── jest.config.ts
├── project.json
├── tsconfig.json
└── README.md
```

## Dependencies

### Required Libraries

- `@angular/core` (v21+)
- `@angular/common`
- `@angular/forms`
- `@ngrx/store`
- `@angular/material/*` (via shared-ui components)
- `rxjs`

### Internal Dependencies

- `@org/candidates/data` - Service and NgRx store
- `@org/candidates/shared-ui` - Grid, Modal, Spinner, Error components
- `@org/candidates/feature-candidate-form` - Form component for creating candidates
- `@org/models` - Candidate interface

## Testing

Run unit tests:

```bash
npx nx test feature-candidates
```

### Test Coverage

The component has comprehensive test coverage including:

- ✅ Component creation
- ✅ Loading candidates on init
- ✅ Loading state management
- ✅ Error handling and display
- ✅ Opening add candidate modal
- ✅ Closing modal after successful submission
- ✅ Selecting candidate for viewing
- ✅ Closing candidate detail modal
- ✅ Triggering delete confirmation
- ✅ Cancelling deletion
- ✅ Confirming deletion and dispatching action
- ✅ Not dispatching when no candidate selected

### Running Specific Tests

```bash
# Run only this library's tests
npx nx test feature-candidates

# Run tests in watch mode
npx nx test feature-candidates --watch

# Run with coverage
npx nx test feature-candidates --coverage
```

## Styling

The component uses a combination of:

- **Material Design**: Via Angular Material components
- **Custom CSS**: For layout, spacing, and custom elements
- **Responsive Design**: Mobile-first approach with flexbox

Key style classes:

```css
.candidate-list-container  /* Main container */
.page-header              /* Header with title */
.add-candidate-row        /* Row with Add button */
.candidates-grid-margin   /* Grid spacing */
.modal-content-custom     /* Modal content styling */
.modal-delete-text        /* Delete confirmation text */
.modal-btn-row           /* Modal button layout */
```

## Error Handling

The component handles errors at multiple levels:

1. **Loading Errors**: Caught when fetching candidates fails
   - Shows error message with retry button
   - Error details logged to console

2. **Service Errors**: Service-level errors (network, API)
   - Handled by error callback in subscription
   - User-friendly message displayed

3. **Store Errors**: NgRx effects handle API errors
   - Component doesn't need to handle these directly
   - Effects update store with error state

## Best Practices

### Performance

- Uses `ChangeDetectionStrategy.OnPush` for optimal performance
- Signals for reactive state management
- Lazy loading through router when possible

### Accessibility

- Semantic HTML structure
- Proper ARIA labels (via Material components)
- Keyboard navigation support
- Focus management in modals

### State Management

- All state changes go through NgRx store
- Component state (modals, selection) kept local
- Service layer abstracts store complexity

### Component Design

- Single responsibility: List management only
- Composition: Uses child components for grid and form
- Reactive: Uses RxJS observables and signals
- Testable: All logic is unit tested

## User Interactions

### Add New Candidate

1. User clicks "Add Candidate" button
2. Modal opens with form component
3. User fills form and uploads Excel
4. Form validates and submits
5. On success, modal closes and list updates
6. On error, form shows error message

### View Candidate

1. User clicks "View" on a candidate row
2. Modal opens showing candidate details
3. User can view all information
4. Click outside or close to dismiss

### Delete Candidate

1. User clicks "Delete" on a candidate row
2. Confirmation modal appears
3. User can cancel or confirm
4. On confirm:
   - Delete action dispatched
   - Store effects handle API call
   - On success, candidate removed from list
   - On error, error notification shown (via effects)

## Future Enhancements

- [ ] Filtering by seniority, availability
- [ ] Search by name functionality
- [ ] Bulk operations (select multiple, delete multiple)
- [ ] Export to CSV/Excel
- [ ] Candidate comparison view
- [ ] Sorting persistence in URL params
- [ ] Infinite scroll option
- [ ] Column visibility toggle
- [ ] Advanced filters panel
- [ ] Candidate detail page (separate route)

## Troubleshooting

### Candidates Not Loading

1. Check console for errors
2. Verify API is running (http://localhost:3000/api)
3. Check NgRx DevTools for store state
4. Verify CandidatesService is properly injected

### Modal Not Closing

1. Check if `submittedSuccessfully` event is emitted from form
2. Verify modal's `(closed)` output is wired correctly
3. Check signal values in component

### Deletion Not Working

1. Verify delete action is dispatched
2. Check NgRx effects for API call success
3. Verify store is updated after deletion
4. Check if component re-subscribes to candidates

## Performance Considerations

### Optimization Techniques Used

- **OnPush Change Detection**: Reduces checks
- **Signals**: Efficient reactive state
- **Lazy Loading**: Load component only when route accessed
- **Material Virtual Scroll**: Can be added for large lists
- **Pagination**: Limits rendered items

### Recommended Limits

- Pagination: 10-50 items per page
- Total candidates: Tested with up to 1000 items
- For larger datasets: Implement server-side pagination

## License

Part of the Candidates App monorepo.

## Contributing

This library follows the Nx workspace structure. To add features:

1. Make changes to the component
2. Add/update tests (maintain 100% coverage)
3. Update this README if API changes
4. Run tests: `npx nx test feature-candidates`
5. Run linting: `npx nx lint feature-candidates`
6. Test e2e: `npx nx e2e candidates-e2e`

## Related Libraries

- **@org/candidates/data** - Data service and NgRx store
- **@org/candidates/feature-candidate-form** - Form for creating candidates
- **@org/candidates/shared-ui** - Shared UI components
- **@org/models** - Shared data models

## Support

For issues or questions, please contact the development team.

## Changelog

### v1.0.0 (Current)
- Initial release with full CRUD operations
- Material Design table with sorting
- Modal-based interactions
- NgRx store integration
- Comprehensive test coverage
