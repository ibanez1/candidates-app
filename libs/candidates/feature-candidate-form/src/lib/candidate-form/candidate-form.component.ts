import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { createCandidate } from '@org/candidates/data';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Candidate } from '@org/models';

@Component({
  selector: 'candidates-candidate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="onSubmit()" novalidate>
      <h2 class="form-title">Add Candidate</h2>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Name</mat-label>
        <input matInput id="name" formControlName="name" type="text" />
        @if (submitted && form().get('name')?.invalid) {
          <mat-error>Name is required</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Surname</mat-label>
        <input matInput id="surname" formControlName="surname" type="text" />
        @if (submitted && form().get('surname')?.invalid) {
          <mat-error>Surname is required</mat-error>
        }
      </mat-form-field>
      <button type="submit" class="add-candidate-btn">Submit</button>
    </form>
  `,
  styleUrls: ['./candidate-form.component.css']
})

export class CandidateFormComponent {
  
  @Output() submittedSuccessfully = new EventEmitter<void>();
  private readonly fb = new FormBuilder();
  private readonly store = inject(Store);
  readonly form = signal(this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
  }));
  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.form().valid) {
      const { name, surname } = this.form().value;
      const newCandidate: Candidate = {
        id: Date.now(),
        name: name as string ?? '',
        surname: surname as string ?? '',
        seniority: 'junior', // valor por defecto
        years: 1,            // valor por defecto
        availability: true   // valor por defecto
      };
      this.store.dispatch(createCandidate({ candidate: newCandidate }));
      this.form().reset();
      this.submitted = false;
      this.submittedSuccessfully.emit();
    } else {
      this.form().markAllAsTouched();
    }
  }
}
