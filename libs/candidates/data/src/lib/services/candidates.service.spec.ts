import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CandidatesService } from './candidates.service';
import { Candidate, ApiResponse } from '@org/models';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3333/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CandidatesService
      ],
    });
    service = TestBed.inject(CandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('getCandidates', () => {
  //   const mockProductsResponse: ApiResponse<PaginatedResponse<Product>> = {
  //     success: true,
  //     data: {
  //       items: [
  //         {
  //           id: '1',
  //           name: 'Product 1',
  //           description: 'Description 1',
  //           price: 100,
  //           imageUrl: 'image1.jpg',
  //           category: 'Electronics',
  //           inStock: true,
  //           rating: 4.5,
  //           reviewCount: 10,
  //         },
  //         {
  //           id: '2',
  //           name: 'Product 2',
  //           description: 'Description 2',
  //           price: 200,
  //           imageUrl: 'image2.jpg',
  //           category: 'Clothing',
  //           inStock: false,
  //           rating: 3.5,
  //           reviewCount: 5,
  //         },
  //       ],
  //       total: 2,
  //       page: 1,
  //       pageSize: 12,
  //       totalPages: 1,
  //     },
  //   };

  //   it('should return products with default pagination', () => {
  //     service.getProducts().subscribe((response) => {
  //       expect(response.items.length).toBe(2);
  //       expect(response.total).toBe(2);
  //       expect(response.page).toBe(1);
  //       expect(service.loading()).toBeFalsy();
  //       expect(service.error()).toBeNull();
  //     });

  //     const req = httpMock.expectOne(`${apiUrl}/products?page=1&pageSize=12`);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mockProductsResponse);
  //   });

  //   it('should apply filters when provided', () => {
  //     const filter: ProductFilter = {
  //       category: 'Electronics',
  //       minPrice: 50,
  //       maxPrice: 150,
  //       inStock: true,
  //       searchTerm: 'test',
  //     };

  //     service.getProducts(filter, 2, 20).subscribe((response) => {
  //       expect(response).toBeTruthy();
  //     });

  //     const req = httpMock.expectOne(
  //       `${apiUrl}/products?page=2&pageSize=20&category=Electronics&minPrice=50&maxPrice=150&inStock=true&searchTerm=test`
  //     );
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mockProductsResponse);
  //   });

  //   it('should handle error response', () => {
  //     const errorResponse: ApiResponse<PaginatedResponse<Product>> = {
  //       success: false,
  //       error: 'Server error',
  //       data: undefined as unknown
  //     };

  //     // Silence console.error for this test
  //     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  //     service.getProducts().subscribe((response) => {
  //       expect(response.items).toEqual([]);
  //       expect(response.total).toBe(0);
  //       expect(service.error()).toContain('Server error');
  //     });

  //     const req = httpMock.expectOne(`${apiUrl}/products?page=1&pageSize=12`);
  //     req.flush(errorResponse);

  //     consoleErrorSpy.mockRestore();
  //   });

  //   it('should handle network error', () => {
  //     // Silence console.error for this test
  //     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  //     service.getProducts().subscribe((response) => {
  //       expect(response.items).toEqual([]);
  //       expect(response.total).toBe(0);
  //       expect(service.error()).toBeTruthy();
  //     });

  //     const req = httpMock.expectOne(`${apiUrl}/products?page=1&pageSize=12`);
  //     req.error(new ProgressEvent('Network error'));

  //     consoleErrorSpy.mockRestore();
  //   });
  // });

  describe('getCandidateById', () => {
    const mockCandidate: Candidate = {
      id: 1,
      name: 'Candidate 1',
      surname: 'Surname 1', 
      seniority: 'junior',
      years: 2,
      availability: true
    };

    it('should return a candidate by id', () => {
      const mockResponse: ApiResponse<Candidate> = {
        success: true,
        data: mockCandidate,
      };

      service.getCandidateById('1').subscribe((candidate) => {
        expect(candidate).toEqual(mockCandidate);
        expect(service.loading()).toBeFalsy();
        expect(service.error()).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null on error', () => {
      // Silence console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      service.getCandidateById('1').subscribe((candidate) => {
        expect(candidate).toBeNull();
        expect(service.error()).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates/1`);
      req.error(new ProgressEvent('Network error'));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('loading and error signals', () => {
    it('should set loading to true when fetching candidates', () => {
      expect(service.loading()).toBeFalsy();

      // service.getCandidates().subscribe();
      expect(service.loading()).toBeTruthy();

      const req = httpMock.expectOne(`${apiUrl}/candidates`);
      req.flush({ success: true, data: { items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 } });

      expect(service.loading()).toBeFalsy();
    });

    it('should set error message on failure', () => {
      // Silence console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      expect(service.error()).toBeNull();

      service.getCandidateById('1').subscribe(() => {
        expect(service.error()).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/candidates/1`);
      req.error(new ProgressEvent('Network error'));

      consoleErrorSpy.mockRestore();
    });
  });
});
