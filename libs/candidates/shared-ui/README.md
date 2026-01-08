# Candidates Shared UI

A collection of reusable UI components for the Candidates application. This library provides presentational components that are used across different feature libraries to maintain consistency and reduce code duplication.

## Overview

This library contains standalone Angular components that handle common UI patterns such as data grids, modals, loading spinners, and error messages. All components follow the OnPush change detection strategy for optimal performance and are designed to be framework-agnostic and reusable.

## Components

### 1. CandidateGridComponent (`candidates-grid`)

A feature-rich data grid component for displaying candidate information with sorting, pagination, and column resizing capabilities.

**Features:**
- Material Design table with sorting
- Pagination (10 items per page)
- Resizable columns via drag handles
- View and delete actions per row
- Empty state display
- Fixed table layout with custom column widths

**API:**

```typescript
// Inputs
candidates = input.required<Candidate[]>(); // List of candidates to display

// Outputs
candidateSelect = output<Candidate>();     // Emits when view button is clicked
deleteCandidate = output<Candidate>();     // Emits when delete button is clicked

// Display Columns
displayedColumns = ['name', 'surname', 'seniority', 'years', 'availability', 'actions'];
```

**Usage:**

```typescript
import { CandidateGridComponent } from '@org/shared-ui';

@Component({
  template: `
    <candidates-grid
      [candidates]="candidates()"
      (candidateSelect)="onViewCandidate($event)"
      (deleteCandidate)="onDeleteCandidate($event)"
    />
  `
})
export class MyComponent {
  candidates = signal<Candidate[]>([]);

  onViewCandidate(candidate: Candidate) {
    console.log('View candidate:', candidate);
  }

  onDeleteCandidate(candidate: Candidate) {
    console.log('Delete candidate:', candidate);
  }
}
```

**Column Resizing:**

Users can resize columns by clicking and dragging the resize handles on the right edge of each column header. The minimum column width is 40px.

**Candidate Model:**

```typescript
interface Candidate {
  id: string;
  name: string;
  surname: string;
  seniority: string;
  years: number;
  availability: boolean;
}
```

---

### 2. ModalComponent (`candidates-modal`)

A customizable modal dialog component with backdrop, close button, and content projection.

**Features:**
- Backdrop overlay
- Close button with keyboard support (Enter key)
- Content projection via `<ng-content>`
- Auto-focus on backdrop for accessibility
- Click outside to close prevention (content area stops propagation)

**API:**

```typescript
// Inputs
@Input() open = false;                     // Controls modal visibility

// Outputs
@Output() closed = new EventEmitter<void>(); // Emits when close button is clicked
```

**Usage:**

```typescript
import { ModalComponent } from '@org/shared-ui';

@Component({
  template: `
    <candidates-modal [open]="isModalOpen()" (closed)="closeModal()">
      <h2>Modal Title</h2>
      <p>Modal content goes here...</p>
      <button (click)="closeModal()">Close</button>
    </candidates-modal>
  `
})
export class MyComponent {
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
```

**Accessibility:**
- Modal automatically receives focus when opened
- Close button supports Enter key activation
- Uses MutationObserver for delayed focus if needed

---

### 3. LoadingSpinnerComponent (`candidates-loading-spinner`)

A simple loading indicator with spinner animation.

**Features:**
- Animated CSS spinner
- Fixed loading message: "Creating Candidate...."
- Centered layout

**API:**

No inputs or outputs - purely presentational.

**Usage:**

```typescript
import { LoadingSpinnerComponent } from '@org/shared-ui';

@Component({
  template: `
    @if (isLoading()) {
      <candidates-loading-spinner />
    }
  `
})
export class MyComponent {
  isLoading = signal(false);
}
```

**Styling:**

The spinner is defined in CSS with keyframe animations. Customize the appearance by overriding the `.spinner` and `.spinner-container` classes.

---

### 4. ErrorMessageComponent (`candidates-error-message`)

A standardized error display component with optional retry functionality.

**Features:**
- Warning icon (⚠️)
- Customizable title and message
- Optional "Try Again" button
- Default error messages if none provided

**API:**

```typescript
// Inputs
title = input<string>();                   // Error title (default: "Oops! Something went wrong")
message = input<string>();                 // Error message (default: "An unexpected error occurred...")
showRetry = input(true);                   // Show/hide retry button

// Outputs
retry = output<void>();                    // Emits when retry button is clicked
```

**Usage:**

```typescript
import { ErrorMessageComponent } from '@org/shared-ui';

@Component({
  template: `
    @if (error()) {
      <candidates-error-message
        [title]="'Failed to Load Candidates'"
        [message]="error()"
        [showRetry]="true"
        (retry)="loadCandidates()"
      />
    }
  `
})
export class MyComponent {
  error = signal<string | null>(null);

  loadCandidates() {
    // Reload logic
  }
}
```

**Default Messages:**
- **Title**: "Oops! Something went wrong"
- **Message**: "An unexpected error occurred. Please try again later."

---

## Installation

This library is part of the Nx monorepo and is automatically available to other projects.

```typescript
// Import components in your feature module or standalone component
import { 
  CandidateGridComponent,
  ModalComponent,
  LoadingSpinnerComponent,
  ErrorMessageComponent 
} from '@org/shared-ui';
```

## Dependencies

### Required Packages:
- `@angular/core` - Core Angular framework
- `@angular/common` - Common Angular directives and pipes
- `@angular/material` - Material Design components (table, button, sort, paginator)
- `@org/models` - Shared models (Candidate interface)

### Material Design:

The `CandidateGridComponent` uses Angular Material. Ensure Material is configured in your application:

```typescript
// In your app.config.ts or main module
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig = {
  providers: [
    provideAnimations(),
    // other providers
  ]
};
```

---

## Styling

Each component has its own CSS file with scoped styles:
- [candidate-grid.component.css](libs/candidates/shared-ui/src/lib/candidate-grid/candidate-grid.component.css)
- [modal.component.css](libs/candidates/shared-ui/src/lib/modal/modal.component.css)
- [loading-spinner.component.css](libs/candidates/shared-ui/src/lib/loading-spinner/loading-spinner.component.css)
- [error-message.component.css](libs/candidates/shared-ui/src/lib/error-message/error-message.component.css)

**Global Theme:**

Material components inherit from your global Material theme. To customize:

```scss
// In your global styles.scss
@use '@angular/material' as mat;

$my-theme: mat.define-light-theme((
  color: (
    primary: mat.define-palette(mat.$indigo-palette),
    accent: mat.define-palette(mat.$pink-palette),
  )
));

@include mat.all-component-themes($my-theme);
```

---

## Testing

Run unit tests for the shared-ui library:

```bash
npx nx test shared-ui
```

### Testing Examples

**Testing CandidateGridComponent:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateGridComponent } from './candidate-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CandidateGridComponent', () => {
  let component: CandidateGridComponent;
  let fixture: ComponentFixture<CandidateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateGridComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateGridComponent);
    component = fixture.componentInstance;
  });

  it('should emit candidateSelect when view button is clicked', () => {
    const candidate = { id: '1', name: 'John', surname: 'Doe', /* ... */ };
    fixture.componentRef.setInput('candidates', [candidate]);
    
    spyOn(component.candidateSelect, 'emit');
    
    // Trigger button click
    const viewButton = fixture.nativeElement.querySelector('button[aria-label="View"]');
    viewButton.click();
    
    expect(component.candidateSelect.emit).toHaveBeenCalledWith(candidate);
  });
});
```

**Testing ModalComponent:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should emit closed when close button is clicked', () => {
    component.open = true;
    fixture.detectChanges();
    
    spyOn(component.closed, 'emit');
    
    const closeButton = fixture.nativeElement.querySelector('.modal-close');
    closeButton.click();
    
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
```

---

## Architecture

### Component Structure

```
shared-ui/
├── src/
│   ├── index.ts                           # Public API exports
│   └── lib/
│       ├── candidate-grid/
│       │   ├── candidate-grid.component.ts
│       │   └── candidate-grid.component.css
│       ├── modal/
│       │   ├── modal.component.ts
│       │   └── modal.component.css
│       ├── loading-spinner/
│       │   ├── loading-spinner.component.ts
│       │   └── loading-spinner.component.css
│       └── error-message/
│           ├── error-message.component.ts
│           └── error-message.component.css
├── project.json
└── README.md
```

### Design Principles

1. **Standalone Components**: All components are standalone for easy tree-shaking and lazy loading
2. **OnPush Change Detection**: Optimized performance with OnPush strategy
3. **Signal Inputs**: Modern Angular signals API for reactive inputs
4. **Output Events**: Typed outputs for component communication
5. **Content Projection**: Modal uses `<ng-content>` for flexibility
6. **Accessibility**: Focus management, ARIA labels, keyboard support
7. **Responsive Design**: Components adapt to different screen sizes

---

## Best Practices

### Using Shared Components

✅ **DO:**
- Use these components for consistent UI patterns across features
- Pass data via inputs and handle events via outputs
- Test components in isolation with mock data
- Override styles using specific CSS classes

❌ **DON'T:**
- Modify shared components for feature-specific needs (create feature-specific wrappers instead)
- Couple shared components to specific business logic or state management
- Use ElementRef to manipulate shared component internals

### Example: Creating a Feature-Specific Wrapper

```typescript
// Feature-specific wrapper for CandidateGridComponent
@Component({
  selector: 'app-admin-candidate-grid',
  template: `
    <candidates-grid
      [candidates]="candidates()"
      (candidateSelect)="viewCandidate($event)"
      (deleteCandidate)="confirmDelete($event)"
    />
  `
})
export class AdminCandidateGridComponent {
  private store = inject(Store);
  candidates = this.store.selectSignal(selectAllCandidates);

  viewCandidate(candidate: Candidate) {
    this.store.dispatch(openCandidateDetail({ candidate }));
  }

  confirmDelete(candidate: Candidate) {
    // Feature-specific confirmation logic
    if (confirm(`Delete ${candidate.name}?`)) {
      this.store.dispatch(deleteCandidate({ id: candidate.id }));
    }
  }
}
```

---

## Performance Considerations

### CandidateGridComponent
- Uses `OnPush` change detection for efficient rendering
- Material table with virtual scrolling for large datasets (future enhancement)
- Column resizing uses direct DOM manipulation to avoid change detection cycles
- Pagination limits rendered rows to 10 at a time

### ModalComponent
- Conditionally renders based on `open` input (`@if` block)
- Uses `stopPropagation()` to prevent event bubbling
- MutationObserver is disconnected after focus to prevent memory leaks

### General Tips
- All components use standalone imports for better tree-shaking
- CSS animations use GPU-accelerated properties (transform, opacity)
- No heavy computations in templates

---

## Troubleshooting

### Material Table Not Sorting

**Problem**: Clicking sort headers doesn't sort the table.

**Solution**: Ensure `MatSort` is properly connected in `ngAfterViewInit`:

```typescript
ngAfterViewInit(): void {
  if (this.sort) {
    this.dataSource.sort = this.sort;
  }
}
```

### Modal Not Focusing on Open

**Problem**: Modal backdrop doesn't receive focus when opened.

**Solution**: The component uses `MutationObserver` to handle delayed DOM insertion. If focus still fails, check that no other element is programmatically stealing focus.

### Column Resizing Not Working

**Problem**: Dragging resize handles doesn't change column width.

**Solution**: Ensure the table has `table-layout: fixed` and columns have explicit `data-col` attributes:

```html
<th mat-header-cell *matHeaderCellDef data-col="name">
  Name
  <div class="resize-handle" (pointerdown)="startResize($event, 'name')"></div>
</th>
```

### Styles Not Applied

**Problem**: Component styles are missing or incorrect.

**Solution**: 
1. Check that CSS files are listed in `styleUrls` property
2. For Material components, ensure animations are provided in app config
3. Verify Angular Material theme is imported in global styles

---

## Future Enhancements

### Planned Features
- [ ] **CandidateGridComponent**
  - Virtual scrolling for 1000+ candidates
  - Column visibility toggle
  - Customizable column order
  - Export to CSV functionality
  - Inline editing capabilities

- [ ] **ModalComponent**
  - Configurable sizes (small, medium, large, full-screen)
  - Animation options (fade, slide, zoom)
  - Stacked modal support
  - Draggable header

- [ ] **LoadingSpinnerComponent**
  - Customizable message input
  - Progress bar variant
  - Skeleton screen option

- [ ] **ErrorMessageComponent**
  - Icon customization
  - Action button array for multiple actions
  - Dismissible error option
  - Error type variants (warning, error, info)

### Contributing

When adding new shared components:
1. Create a new directory under `src/lib/`
2. Export component in `src/index.ts`
3. Add comprehensive JSDoc comments
4. Include unit tests
5. Update this README with component documentation
6. Follow the established patterns (standalone, OnPush, signals)

---

## Related Libraries

- **@org/models**: Shared data models and interfaces
- **@org/candidates/data**: Data access layer for candidate operations
- **@org/candidates/feature-candidate-form**: Candidate creation form feature
- **@org/candidates/feature-candidates**: Candidate list management feature

---

## Running Unit Tests

Run `nx test shared-ui` to execute the unit tests via Jest.

## Building

Run `nx build shared-ui` to build the library. The build artifacts will be stored in the `dist/` directory.

---

## Support

For issues, questions, or contributions related to shared UI components, please refer to the main project documentation or contact the development team.
