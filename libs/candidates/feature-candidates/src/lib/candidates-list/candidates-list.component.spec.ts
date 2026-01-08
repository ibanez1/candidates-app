import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError, Observable } from 'rxjs';
import { CandidateListComponent } from './candidates-list.component';
import { CandidatesService } from '@org/candidates/data';
import { Candidate } from '@org/models';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteCandidate } from '@org/candidates/data';

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;
  let mockCandidatesService: Partial<CandidatesService>;
  let mockStore: Partial<Store>;

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Test Candidate',
      surname: 'Test Surname',
      seniority: 'senior',
      years: 4,
      availability: true
    },
    {
      id: 2,
      name: 'Another Candidate',
      surname: 'Another Surname',
      seniority: 'junior',
      years: 2,
      availability: false
    },
  ];

  const loadingSignal = signal(false);

  beforeEach(async () => {
    mockCandidatesService = {
      loading: loadingSignal.asReadonly(),
      error: signal<string | null>(null).asReadonly(),
      getCandidates: jest.fn().mockReturnValue(of({ items: mockCandidates })),
    };

    mockStore = {
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CandidateListComponent],
      providers: [
        { provide: CandidatesService, useValue: mockCandidatesService },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidates on init', () => {
    component.ngOnInit();

    expect(mockCandidatesService.getCandidates).toHaveBeenCalled();
    expect(component.candidates()).toEqual(mockCandidates);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should set loading to true while loading candidates', () => {
    // Use a delayed observable to test loading state
    let resolveObservable: any;
    const delayedObservable = new Observable((observer) => {
      resolveObservable = () => {
        observer.next({ items: mockCandidates });
        observer.complete();
      };
    });
    
    mockCandidatesService.getCandidates = jest.fn().mockReturnValue(delayedObservable);
    
    expect(component.loading()).toBe(false);
    component.loadCandidates();
    
    // Should be true while request is in progress
    expect(component.loading()).toBe(true);
    
    // Complete the observable
    resolveObservable();
    
    // Should be false after completion
    expect(component.loading()).toBe(false);
  });

  it('should handle error when loading candidates fails', () => {
    mockCandidatesService.getCandidates = jest.fn().mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    component.loadCandidates();

    expect(component.error()).toBe('Failed to load candidates. Please try again.');
    expect(component.loading()).toBe(false);
  });

  it('should open modal when add candidate is clicked', () => {
    expect(component.showModal()).toBe(false);
    component.onAddCandidate();
    expect(component.showModal()).toBe(true);
  });

  it('should close modal when modal closed event is triggered', () => {
    component.showModal.set(true);
    component.onModalClosed();
    expect(component.showModal()).toBe(false);
  });

  it('should set selected candidate when candidate is selected', () => {
    const candidate = mockCandidates[0];
    
    component.onCandidateSelect(candidate);
    
    expect(component.selectedCandidate()).toEqual(candidate);
  });

  it('should close candidate modal when closed', () => {
    component.selectedCandidate.set(mockCandidates[0]);
    component.onCandidateModalClosed();
    expect(component.selectedCandidate()).toBeNull();
  });

  it('should set candidate to delete when delete is triggered', () => {
    const candidate = mockCandidates[0];
    
    component.onDeleteCandidate(candidate);
    
    expect(component.candidateToDelete()).toEqual(candidate);
  });

  it('should close delete modal when cancelled', () => {
    component.candidateToDelete.set(mockCandidates[0]);
    component.onDeleteModalClosed();
    expect(component.candidateToDelete()).toBeNull();
  });

  it('should dispatch delete action when delete is confirmed', () => {
    const candidate = mockCandidates[0];
    component.candidateToDelete.set(candidate);
    
    component.confirmDeleteCandidate();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      deleteCandidate({ id: candidate.id })
    );
    expect(component.candidateToDelete()).toBeNull();
  });

  it('should not dispatch delete action if no candidate to delete', () => {
    component.candidateToDelete.set(null);
    
    component.confirmDeleteCandidate();
    
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});