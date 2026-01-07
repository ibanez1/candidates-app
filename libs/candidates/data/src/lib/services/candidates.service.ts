import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, catchError, of } from 'rxjs';
import { Candidate, ApiResponse } from '@org/models';
import { Store } from '@ngrx/store';
import { candidatesFeature } from '../store/candidates.store';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = this.getApiUrl();
  private readonly store = inject(Store);

  // Signals for state management
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  private getApiUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
      }
    }
    return 'https://candidates-api-ottt.onrender.com/api';
  }

  getCandidates() {
    return this.store.select(candidatesFeature.selectCandidates).pipe(
      map(candidates => ({ items: candidates }))
    );
  }

  createCandidate(candidateInfo: any): Observable<Candidate | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Create FormData to send file properly
    const formData = new FormData();
    formData.append('id', candidateInfo.id.toString());
    formData.append('name', candidateInfo.name);
    formData.append('surname', candidateInfo.surname);
    
    if (candidateInfo.excel) {
      formData.append('excel', candidateInfo.excel, candidateInfo.excel.name);
    }

    return this.http
      .post<ApiResponse<Candidate>>(`${this.apiUrl}/candidates`, formData)
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
          // Extract error message from backend response
          const errorMessage = error.error?.error || error.message || 'An error occurred while creating the candidate';
          this.errorSignal.set(errorMessage);
          console.error('Error creating candidate:', error);
          return of(null);                  
        }),
      );
  }
}