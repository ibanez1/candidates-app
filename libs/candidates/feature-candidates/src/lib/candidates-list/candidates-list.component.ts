import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CandidatesService, deleteCandidate } from '@org/candidates/data';
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

        <div class="candidates-grid-margin">
          <candidates-grid
            [candidates]="candidates()"
            (candidateSelect)="onCandidateSelect($event)"
            (deleteCandidate)="onDeleteCandidate($event)"
          />
        </div>
      }

      <candidates-modal [open]="showModal() && !selectedCandidate() && !candidateToDelete()" (closed)="onModalClosed()">
        <candidates-candidate-form (submittedSuccessfully)="onModalClosed()" />
      </candidates-modal>

      <candidates-modal [open]="!!selectedCandidate()" (closed)="onCandidateModalClosed()">
        <div *ngIf="selectedCandidate() as c" class="modal-content-custom">
          <h2 class="modal-title">{{ c.name }} {{ c.surname }}</h2>
          <p><strong>Seniority:</strong> {{ c.seniority }}</p>
          <p><strong>Years:</strong> {{ c.years }}</p>
          <p><strong>Available:</strong> {{ c.availability ? 'Yes' : 'No' }}</p>
        </div>
      </candidates-modal>

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

    </div>
  `,
  styleUrls: ['./candidates-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  private readonly candidatesService = inject(CandidatesService);
  private readonly store = inject(Store);

  readonly candidates = signal<Candidate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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
    const candidate = this.candidateToDelete();
    if (candidate) {
      this.store.dispatch(deleteCandidate({ id: candidate.id }));
    }
    this.candidateToDelete.set(null);
  }

  ngOnInit() {
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
      error: () => {
        this.error.set('Failed to load candidates. Please try again.');
        this.loading.set(false);
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
}