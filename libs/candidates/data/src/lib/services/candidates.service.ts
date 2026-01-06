import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Candidate, ApiResponse } from '@org/models';
import { Store } from '@ngrx/store';
import { candidatesFeature } from '../store/candidates.store';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly store = inject(Store);

  // Signals for state management
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getCandidates() {
    return this.store.select(candidatesFeature.selectCandidates).pipe(
      map(candidates => ({ items: candidates }))
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