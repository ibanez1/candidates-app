import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CandidatesService } from './candidates.service';
import { Candidate, ApiResponse } from '@org/models';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { candidatesFeature } from '../store/candidates.store';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let httpMock: HttpTestingController;
  let store: MockStore;
  const apiUrl = 'http://localhost:3000/api';

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      years: 5,
      availability: true
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Smith',
      seniority: 'junior',
      years: 2,
      availability: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [
            {
              selector: candidatesFeature.selectCandidates,
              value: mockCandidates
            }
          ]
        }),
        CandidatesService
      ],
    });
    service = TestBed.inject(CandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCandidates', () => {
    it('should return candidates from store', (done) => {
      service.getCandidates().subscribe(response => {
        expect(response.items).toEqual(mockCandidates);
        expect(response.items.length).toBe(2);
        done();
      });
    });

    it('should return empty array when no candidates in store', (done) => {
      store.overrideSelector(candidatesFeature.selectCandidates, []);
      store.refreshState();

      service.getCandidates().subscribe(response => {
        expect(response.items).toEqual([]);
        expect(response.items.length).toBe(0);
        done();
      });
    });
  });

  describe('createCandidate', () => {
    const mockSuccessResponse: ApiResponse<Candidate> = {
      success: true,
      data: {
        id: 3,
        name: 'Bob',
        surname: 'Johnson',
        seniority: 'senior',
        years: 8,
        availability: true
      },
      message: 'Candidate created successfully'
    };

    it('should create candidate with valid data', (done) => {
      const candidateInfo = {
        id: 3,
        name: 'Bob',
        surname: 'Johnson',
        excel: new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      };

      service.createCandidate(candidateInfo).subscribe(candidate => {
        expect(candidate).toEqual(mockSuccessResponse.data);
        expect(service.loading()).toBeFalsy();
        expect(service.error()).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockSuccessResponse);
    });

    it('should set loading to true when creating candidate', () => {
      const candidateInfo = {
        id: 3,
        name: 'Bob',
        surname: 'Johnson',
        excel: new File(['test'], 'test.xlsx')
      };

      expect(service.loading()).toBeFalsy();

      service.createCandidate(candidateInfo).subscribe();
      
      // Loading should be true during request
      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      req.flush(mockSuccessResponse);

      // Loading should be false after request
      expect(service.loading()).toBeFalsy();
    });

    it('should handle error response from backend', (done) => {
      const candidateInfo = {
        id: 3,
        name: 'Bob',
        surname: 'Johnson',
        excel: new File(['test'], 'test.xlsx')
      };

      const errorResponse: ApiResponse<Candidate> = {
        success: false,
        error: 'Missing required fields',
        data: undefined as unknown as Candidate
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      service.createCandidate(candidateInfo).subscribe(candidate => {
        expect(candidate).toBeNull();
        expect(service.loading()).toBeFalsy();
        expect(service.error()).toBe('Missing required fields');
        consoleErrorSpy.mockRestore();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      req.flush(errorResponse);
    });

    it('should handle network error', (done) => {
      const candidateInfo = {
        id: 3,
        name: 'Bob',
        surname: 'Johnson',
        excel: new File(['test'], 'test.xlsx')
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      service.createCandidate(candidateInfo).subscribe(candidate => {
        expect(candidate).toBeNull();
        expect(service.loading()).toBeFalsy();
        expect(service.error()).toBeTruthy();
        expect(service.error()).toContain('Http failure response');
        consoleErrorSpy.mockRestore();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should append FormData correctly', () => {
      const candidateInfo = {
        id: 123,
        name: 'Test',
        surname: 'User',
        excel: new File(['content'], 'test.xlsx')
      };

      service.createCandidate(candidateInfo).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      const formData = req.request.body as FormData;
      
      expect(formData.get('id')).toBe('123');
      expect(formData.get('name')).toBe('Test');
      expect(formData.get('surname')).toBe('User');
      expect(formData.get('excel')).toBeTruthy();
      
      req.flush(mockSuccessResponse);
    });
  });

  describe('error signal', () => {
    it('should clear error on new request', () => {
      const candidateInfo = {
        id: 1,
        name: 'Test',
        surname: 'User',
        excel: new File(['test'], 'test.xlsx')
      };

      // First request with error
      service.createCandidate(candidateInfo).subscribe();
      const req1 = httpMock.expectOne(`${apiUrl}/candidates`);
      req1.flush({ success: false, error: 'Error 1', data: undefined as unknown as Candidate });

      expect(service.error()).toBe('Error 1');

      // Second request should clear previous error
      service.createCandidate(candidateInfo).subscribe();
      
      // Error should be cleared before making new request
      expect(service.error()).toBeNull();

      const req2 = httpMock.expectOne(`${apiUrl}/candidates`);
      req2.flush({ success: true, data: mockCandidates[0], message: 'Success' });
    });
  });

  describe('loading signal', () => {
    it('should have readonly loading signal', () => {
      expect(service.loading()).toBeFalsy();
    });

    it('should have readonly error signal', () => {
      expect(service.error()).toBeNull();
    });
  });
});
