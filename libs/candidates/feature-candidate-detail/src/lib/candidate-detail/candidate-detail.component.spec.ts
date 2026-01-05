import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CandidateDetailComponent } from './candidate-detail.component';
import { CandidatesService } from '@org/candidates/data';
import { Candidate } from '@org/models';
// Use Jest globals (no import needed)

describe('CandidateDetailComponent', () => {
  let component: CandidateDetailComponent;
  let fixture: ComponentFixture<CandidateDetailComponent>;
  let mockCandidatesService: Partial<Record<keyof CandidatesService, jest.Mock>>;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  const mockCandidate: Candidate = {
    id: 1,
    name: 'Test Candidate',
    surname: 'Test Surname',
    seniority: 'senior',
    years: 4.5,
    availability: true,
  };

  beforeEach(async () => {
    mockCandidatesService = {
      getCandidateById: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: ({
        paramMap: ({
          get: jest.fn().mockReturnValue('1'),
        } as unknown) as ParamMap,
      } as unknown) as ActivatedRoute['snapshot'],
    };

    await TestBed.configureTestingModule({
      imports: [CandidateDetailComponent],
      providers: [
        { provide: CandidatesService, useValue: mockCandidatesService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidate on init', () => {
    mockCandidatesService.getCandidateById.mockReturnValue(of(mockCandidate));

    component.ngOnInit();

    expect(mockCandidatesService.getCandidateById).toHaveBeenCalledWith('1');
    expect(component.candidate()).toEqual(mockCandidate);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(null);
  });

  it('should handle error when candidate not found', () => {
    mockCandidatesService.getCandidateById.mockReturnValue(of(null));

    component.ngOnInit();

    expect(component.error()).toBe('Candidate not found');
    expect(component.loading()).toBe(false);
  });

  it('should handle error when loading fails', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockCandidatesService.getCandidateById.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.error()).toBe('Failed to load candidate details');
    expect(component.loading()).toBe(false);
    consoleSpy.mockRestore();
  });

  it('should calculate star ratings correctly', () => {
    component.candidate.set(mockCandidate);

    const stars = component.getStars();

    expect(stars).toEqual([true, true, true, true, true]);
  });

  it('should handle add to cart action', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    component.candidate.set(mockCandidate);

    component.addToCart();

    expect(consoleSpy).toHaveBeenCalledWith('Adding to cart:', '1');
    expect(alertSpy).toHaveBeenCalledWith('Candidate added to cart!');
  });
});
