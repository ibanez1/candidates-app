import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidatesService } from '@org/candidates/data';
import { Candidate } from '@org/models';
import {
  CandidateGridComponent,
  LoadingSpinnerComponent,
  ErrorMessageComponent,
  ModalComponent,
} from '@org/candidates/shared-ui';
import { CandidateFormComponent } from '@org/candidates/feature-candidate-form';

@Component({
  selector: 'candidate-list',
  imports: [
    CommonModule,
    FormsModule,
    CandidateGridComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ModalComponent,
    CandidateFormComponent
  ],
  template: `
    <div class="candidate-list-container">
      <header class="page-header">
        <h1>Candidates</h1>
      </header>

      @if (loading()) {
        <candidates-loading-spinner />
      } @else if (error()) {
        <candidates-error-message
          [message]="error() || undefined"
          (retry)="loadCandidates()"
        />
      } @else {

        <div class="add-candidate-row">
          <button class="add-candidate-btn" (click)="onAddCandidate()">Add Candidate</button>
        </div>
        <!-- Modal se mueve fuera del flujo de la grid para overlay correcto -->

        <div class="candidates-grid-margin">
          <candidates-grid
            [candidates]="candidates()"
            (candidateSelect)="onCandidateSelect($event)"
            (deleteCandidate)="onDeleteCandidate($event)"
          />
        </div>
      }

      <!-- Modal para crear candidato -->
      <candidates-modal [open]="showModal() && !selectedCandidate() && !candidateToDelete()" (closed)="onModalClosed()">
        <candidates-candidate-form (submittedSuccessfully)="onModalClosed()" />
      </candidates-modal>

      <!-- Modal para ver detalle de candidato -->
      <candidates-modal [open]="!!selectedCandidate()" (closed)="onCandidateModalClosed()">
        <div *ngIf="selectedCandidate() as c" class="modal-content-custom">
          <h2 class="modal-title">{{ c.name }} {{ c.surname }}</h2>
          <p><strong>Seniority:</strong> {{ c.seniority }}</p>
          <p><strong>Years:</strong> {{ c.years }}</p>
          <p><strong>Available:</strong> {{ c.availability ? 'Yes' : 'No' }}</p>
        </div>
      </candidates-modal>

      <!-- Modal de confirmación de borrado -->
      <candidates-modal [open]="!!candidateToDelete()" (closed)="onDeleteModalClosed()">
        <div *ngIf="candidateToDelete() as c" class="modal-content-custom">
          <h2 class="modal-title">
            <span>{{ c.name }} {{ c.surname }}</span>
          </h2>
          <p class="modal-delete-text">¿Estás seguro de que quieres eliminar el usuario?</p>
          <div class="modal-btn-row">
            <button class="add-candidate-btn modal-cancel-btn" (click)="onDeleteModalClosed()">Cancelar</button>
            <button class="add-candidate-btn modal-delete-btn" (click)="confirmDeleteCandidate()">Borrar</button>
          </div>
        </div>
      </candidates-modal>

        @if (hasMorePages()) {
          <div class="pagination">
            <button
              class="btn-secondary"
              [disabled]="currentPage() === 1"
              (click)="previousPage()"
            >
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button
              class="btn-secondary"
              [disabled]="currentPage() === totalPages()"
              (click)="nextPage()"
            >
              Next
            </button>
          </div>
        }
    </div>
  `,
  styles: [`
    .add-candidate-row {
      display: flex;
      justify-content: flex-start;
    }
    .add-candidate-btn {
      background: #e53935;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 10px 28px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(229, 57, 53, 0.08);
      transition: background 0.2s;
      margin-left: 30px;
      min-width: 120px;
    }
    .add-candidate-btn:hover {
      background: #b71c1c;
    }
    .modal-content-custom {
      padding: 24px;
      min-width: 320px;
    }
    .modal-title {
      margin-top: 0;
    }
    .modal-delete-text {
      margin-top: 16px;
      font-size: 1.1rem;
    }
    .modal-btn-row {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    }
    .modal-cancel-btn {
      background: #fff !important;
      color: #e53935 !important;
      border: 2px solid #e53935 !important;
    }
    .modal-delete-btn {
      background: #e53935 !important;
      color: #fff !important;
      border: none !important;
    }
    .candidates-grid-margin {
      margin-left: 32px;
      margin-right: 40px;
    }
    .candidates-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 20px;
      margin-top: 40px;
      position: relative;
    }
    .header-icon {
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 1.3rem;
      color: #1976d2;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      color: #333;
    }

    .page-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .filters-section {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 32px;
    }

    .search-box {
      margin-bottom: 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3498db;
    }

    .filter-controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 8px 16px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 1rem;
    }

    .checkbox-label input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .results-info {
      color: #666;
      margin-bottom: 16px;
      font-size: 0.95rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .page-info {
      color: #666;
      font-size: 1rem;
    }

    .btn-secondary {
      padding: 8px 16px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .candidates-list-container {
        padding: 16px;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  private readonly candidatesService = inject(CandidatesService);
  private readonly router = inject(Router);

  // State signals
  readonly candidates = signal<Candidate[]>([]);
  readonly totalCandidates = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Filter state
  searchTerm = '';
  selectedCategory = '';
  inStockOnly = false;

  // Computed values
  readonly hasMorePages = computed(() => this.totalPages() > 1);

  // Modal state
  readonly showModal = signal(false);
  readonly selectedCandidate = signal<Candidate | null>(null);
  readonly candidateToDelete = signal<Candidate | null>(null);
  onDeleteCandidate(candidate: Candidate) {
    this.candidateToDelete.set(candidate);
  }

  onDeleteModalClosed() {
    this.candidateToDelete.set(null);
  }

  confirmDeleteCandidate() {
    // Aquí iría la lógica para borrar el candidato
    this.candidateToDelete.set(null);
  }

  ngOnInit() {
    // this.loadCategories();
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading.set(true);
    this.error.set(null);

    this.candidatesService.getCandidates().subscribe({
      next: (response) => {
        this.candidates.set(response.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load candidates. Please try again.');
        this.loading.set(false);
        console.error('Error loading candidates:', err);
      },
    });
  }

  onAddCandidate() {
    this.showModal.set(true);
  }

  onModalClosed() {
    this.showModal.set(false);
  }

  onCandidateSelect(candidate: Candidate) {
    this.selectedCandidate.set(candidate);
  }

  onCandidateModalClosed() {
    this.selectedCandidate.set(null);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      // this.currentPage.update(page => page + 1);
      // this.loadCandidates();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      // this.currentPage.update(page => page - 1);
      // this.loadCandidates();
    }
  }
}