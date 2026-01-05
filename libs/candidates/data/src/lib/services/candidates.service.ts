import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Candidate, ApiResponse } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  // Signals for state management
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getCandidates() {
    return of({
      items: [
        { id: 1, name: 'John', surname: 'Doe', seniority: 'junior', years: 1, availability: true },
        { id: 2, name: 'Jane', surname: 'Smith', seniority: 'mid', years: 3, availability: false },
        { id: 3, name: 'Alice', surname: 'Johnson', seniority: 'senior', years: 7, availability: true },
        { id: 4, name: 'Bob', surname: 'Williams', seniority: 'junior', years: 2, availability: false },
        { id: 5, name: 'Charlie', surname: 'Brown', seniority: 'mid', years: 4, availability: true },
        { id: 6, name: 'Diana', surname: 'Evans', seniority: 'senior', years: 10, availability: true },
        { id: 7, name: 'Eve', surname: 'Miller', seniority: 'junior', years: 1, availability: false },
        { id: 8, name: 'Frank', surname: 'Moore', seniority: 'mid', years: 5, availability: true },
        { id: 9, name: 'Grace', surname: 'Taylor', seniority: 'senior', years: 8, availability: false },
        { id: 10, name: 'Hank', surname: 'Anderson', seniority: 'junior', years: 2, availability: true },
        { id: 11, name: 'Ivy', surname: 'Thomas', seniority: 'mid', years: 6, availability: true },
        { id: 12, name: 'Jack', surname: 'Jackson', seniority: 'senior', years: 12, availability: false },
        { id: 13, name: 'Karen', surname: 'White', seniority: 'junior', years: 1, availability: true },
        { id: 14, name: 'Leo', surname: 'Harris', seniority: 'mid', years: 4, availability: false },
        { id: 15, name: 'Mona', surname: 'Martin', seniority: 'senior', years: 9, availability: true },
      ],
    });
  }

  getCandidateById(id: string): Observable<Candidate | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .get<ApiResponse<Candidate>>(`${this.apiUrl}/candidates/${id}`)
      .pipe(
        map((response) => {
          this.loadingSignal.set(false);
          if (!response.success) {
            throw new Error(response.error || 'Failed to load candidate');
          }
          return response.data;
        }),
        catchError((error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(
            error.message || 'An error occurred while loading the candidate',
          );
          console.error('Error loading candidate:', error);
          return of(null);
        }),
      );
  }

  createCandidate(candidate: Candidate): Observable<Candidate | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .post<ApiResponse<Candidate>>(`${this.apiUrl}/candidates`, candidate)
      .pipe(
        map((response) => {
          this.loadingSignal.set(false);
          if (!response.success) {
            throw new Error(response.error || 'Failed to create candidate');
          }
          return response.data;
        }),
        catchError((error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(
            error.message || 'An error occurred while creating the candidate',
          );
          console.error('Error creating candidate:', error);
          return of(null);
        }),
      );
  }
}