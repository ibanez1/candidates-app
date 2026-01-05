import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  styles: [`
        mat-error {
          color: #e53935 !important;
          font-size: 0.97rem;
          margin-left: 0;
          padding-left: 0;
          text-align: left;
          width: 100%;
          display: block;
        }
    form {
      max-width: 400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .form-field {
      width: 100%;
      margin-bottom: 0;
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
      margin-left: 0;
    }
    .add-candidate-btn:hover {
      background: #b71c1c;
    }
    :host ::ng-deep .form-field-error-wrapper,
    :host ::ng-deep .mat-mdc-form-field-error-wrapper {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .form-title {
      margin-top: 10px;
    }
  `]
})
export class CandidateFormComponent {
  private readonly fb = new FormBuilder();
  readonly form = signal(this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
  }));
  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.form().valid) {
      alert('Submitted: ' + JSON.stringify(this.form().value));
    } else {
      this.form().markAllAsTouched();
    }
  }
}
