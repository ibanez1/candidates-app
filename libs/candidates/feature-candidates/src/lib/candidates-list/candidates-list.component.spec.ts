import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CandidateListComponent } from './candidates-list.component';
import { CandidatesService } from '@org/candidates/data';
import { Candidate } from '@org/models';
import { signal } from 'node_modules/@angular/core/types/_chrome_dev_tools_performance-chunk';
// Jest provides globals; remove vitest import

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;
  let mockCandidatesService: Partial<CandidatesService>;
  let mockRouter: Partial<Router>;

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Test Candidate',
      surname: 'Test Surname',
      seniority: 'senior',
      years: 4.5,
      availability: true
    },
    {
      id: 2,
      name: 'Test Candidate',
      surname: 'Test Surname',
      seniority: 'senior',
      years: 4.5,
      availability: true
    },
  ];

  const loadingSignal = signal(false);

  beforeEach(async () => {
    mockCandidatesService = {
    loading: loadingSignal.asReadonly(),
    error: signal<string | null>(null).asReadonly(),
    createCandidate: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CandidateListComponent],
      providers: [
        { provide: CandidatesService, useValue: mockCandidatesService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load Candidates and categories on init', () => {
  //   mockCandidatesService.getCandidates.mockReturnValue(of({
  //     items: mockCandidates,
  //     total: 2,
  //     page: 1,
  //     pageSize: 10,
  //     totalPages: 1,
  //   }));
  //   mockCandidatesService.getCategories.mockReturnValue(of(['Electronics', 'Clothing']));

  //   component.ngOnInit();

  //   expect(mockCandidatesService.getCandidates).toHaveBeenCalled();
  //   expect(mockCandidatesService.getCategories).toHaveBeenCalled();
  //   expect(component.Candidates()).toEqual(mockCandidates);
  // });

  it('should navigate to candidate detail when candidate is selected', () => {
    const candidate = mockCandidates[0];

    component.onCandidateSelect(candidate);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/candidates', candidate.name]);
  });

});