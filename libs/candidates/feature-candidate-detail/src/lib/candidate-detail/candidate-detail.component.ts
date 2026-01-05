import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CandidatesService } from '@org/candidates/data';
import { Candidate } from '@org/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@org/candidates/shared-ui';

@Component({
  selector: 'candidate-detail',
  imports: [
    CommonModule,
    RouterLink,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="candidate-detail-container">
      @if (loading()) {
        
        <candidates-loading-spinner />
      } @else if (error()) {
        <candidates-error-message
          [title]="'Candidate Not Found'"
          [message]="error() || undefined"
          (retry)="loadCandidate()"
        />
      } @else if (candidate()) {
        <div class="breadcrumb">
          <a routerLink="/candidates">← Back to Candidates</a>
        </div>

        <div class="candidate-detail">

          <div class="candidate-info-section">
            <h1 class="candidate-name">{{ candidate()!.name }}</h1>


            <div class="candidate-description">
              <h2>Surname</h2>
              <p>{{ candidate()!.surname }}</p>
            </div>

            <div class="candidate-info">
              <h3>Candidate Information</h3>
              <dl>
                <dt>Candidate ID:</dt>
                <dd>{{ candidate()!.id }}</dd>
                <dt>Name:</dt>
                <dd>{{ candidate()!.name }}</dd>
                <dt>seniority:</dt>
                <dd>{{ candidate()!.seniority }}</dd>
              </dl>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .candidate-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .breadcrumb {
      margin-bottom: 24px;
    }

    .breadcrumb a {
      color: #3498db;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.3s;
    }

    .breadcrumb a:hover {
      color: #2980b9;
      text-decoration: underline;
    }

    .candidate-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .candidate-image-section {
      position: relative;
    }

    .candidate-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .out-of-stock-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(220, 53, 69, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
    }

    .candidate-info-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .candidate-category {
      color: #6c757d;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .candidate-name {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }

    .candidate-rating {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stars {
      color: #ddd;
      font-size: 1.25rem;
    }

    .stars .filled {
      color: #ffd700;
    }

    .rating-text {
      font-weight: 600;
      color: #333;
    }

    .review-count {
      color: #666;
      font-size: 0.95rem;
    }

    .candidate-price {
      font-size: 2rem;
      font-weight: bold;
      color: #28a745;
    }

    .candidate-description {
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
    }

    .candidate-description h2 {
      font-size: 1.25rem;
      margin-bottom: 12px;
      color: #333;
    }

    .candidate-description p {
      color: #666;
      line-height: 1.6;
    }

    .candidate-actions {
      display: flex;
      gap: 16px;
    }

    .btn-primary {
      flex: 1;
      padding: 12px 24px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      flex: 1;
      padding: 12px 24px;
      background: transparent;
      color: #3498db;
      border: 2px solid #3498db;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #3498db;
      color: white;
    }

    .btn-disabled {
      flex: 1;
      padding: 12px 24px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .candidate-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .candidate-info h3 {
      font-size: 1.1rem;
      margin-bottom: 16px;
      color: #333;
    }

    .candidate-info dl {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      margin: 0;
    }

    .candidate-info dt {
      font-weight: 600;
      color: #666;
    }

    .candidate-info dd {
      margin: 0;
      color: #333;
    }

    @media (max-width: 768px) {
      .candidate-detail {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .candidate-name {
        font-size: 1.5rem;
      }

      .candidate-price {
        font-size: 1.5rem;
      }

      .candidate-actions {
        flex-direction: column;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly candidatesService = inject(CandidatesService);

  // State signals
  readonly candidate = signal<Candidate | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.loadCandidate();
  }

  loadCandidate() {
    const candidateId = this.route.snapshot.paramMap.get('id');

    if (!candidateId) {
      this.error.set('Candidate ID not provided');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.candidatesService.getCandidateById(candidateId).subscribe({
      next: (candidate) => {
        if (candidate) {
          this.candidate.set(candidate);
        } else {
          this.error.set('Candidate not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load candidate details');
        this.loading.set(false);
        console.error('Error loading candidate:', err);
      },
    });
  }

  getStars(): boolean[] {
    const candidate = this.candidate();
    if (!candidate) return [];

    const rating = candidate.years;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array(5).fill(false).map((_, index) => {
      if (index < fullStars) return true;
      if (index === fullStars && hasHalfStar) return true;
      return false;
    });
  }

  addToCart() {
    // This would typically call a cart service
    console.log('Adding to cart:', this.candidate()?.name);
    alert('Candidate added to cart!');
  }

  addToWishlist() {
    // This would typically call a wishlist service
    console.log('Adding to wishlist:', this.candidate()?.name);
    alert('Candidate added to wishlist!');
  }
}