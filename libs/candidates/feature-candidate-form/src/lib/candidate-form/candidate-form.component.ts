import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { CandidatesService, createCandidate } from '@org/candidates/data';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CandidateInfo } from '@org/models';
import { LoadingSpinnerComponent } from '@org/candidates/shared-ui';
import * as XLSX from 'xlsx';
import { forkJoin, timer, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'candidates-candidate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, LoadingSpinnerComponent],
  template: `
    @if (isLoading()) {
      <candidates-loading-spinner />
    } @else if (submitStatus() === 'success') {
      <div class="status-message success-message">
        <div class="status-icon success-icon">✓</div>
        <h2 class="status-title">Success</h2>
        <p class="status-text">Candidate created!</p>
      </div>
    } @else if (submitStatus() === 'error') {
      <div class="status-message error-message">
        <div class="status-icon error-icon">✕</div>
        <h2 class="status-title">Error</h2>
        <p class="status-text">{{ errorMessage() }}</p>
        <button class="error-close-btn" (click)="closeError()">Close</button>
      </div>
    } @else {
      <form [formGroup]="form()" (ngSubmit)="onSubmit()" novalidate>
      <h2 class="form-title">Add Candidate</h2>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Name</mat-label>
        <input matInput id="name" formControlName="name" type="text" />
        @if (submitted && form().get('name')?.invalid) {
          @if (form().get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
          @if (form().get('name')?.hasError('maxlength')) {
            <mat-error>Name must be 100 characters or less</mat-error>
          }
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Surname</mat-label>
        <input matInput id="surname" formControlName="surname" type="text" />
        @if (submitted && form().get('surname')?.invalid) {
          @if (form().get('surname')?.hasError('required')) {
            <mat-error>Surname is required</mat-error>
          }
          @if (form().get('surname')?.hasError('maxlength')) {
            <mat-error>Surname must be 100 characters or less</mat-error>
          }
        }
      </mat-form-field>
      
      <div class="file-upload-field">
        <label class="file-upload-label">Excel File:</label>
        <p class="file-upload-instructions">
          Upload an Excel file with 3 columns and only 1 data row:
        </p>
        <ul class="file-upload-list">
          <li><strong>Seniority:</strong> must be "junior" or "senior"</li>
          <li><strong>Years of experience:</strong> a number</li>
          <li><strong>Availability:</strong> true or false</li>
        </ul>
        <input 
          #fileInput
          type="file" 
          id="excelFile" 
          accept=".xlsx,.xls"
          (change)="onFileChange($event)"
          class="file-input-hidden"
        />
        <button 
          type="button" 
          mat-raised-button 
          class="file-upload-btn"
          (click)="fileInput.click()"
        >
          Select File
        </button>
        @if (submitted && !excelFile) {
          <div class="file-validation-message error">
            Excel file with user info is required
          </div>
        }
        @if (fileValidationMessage()) {
          <div class="file-validation-message" [class.success]="fileValidationSuccess()" [class.error]="!fileValidationSuccess()">
            {{ fileValidationMessage() }}
          </div>
        }
        @if (selectedFileName()) {
          <div class="selected-file">{{ selectedFileName() }}</div>
        }
      </div>

      <button type="submit" class="add-candidate-btn">Submit</button>
    </form>
    }
  `,
  styleUrls: ['./candidate-form.component.css']
})

export class CandidateFormComponent {
  
  @Output() submittedSuccessfully = new EventEmitter<void>();
  private readonly fb = new FormBuilder();
  private readonly candidatesService = inject(CandidatesService);
  private readonly store = inject(Store);
  readonly form = signal(this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    surname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
  }));
  submitted = false;
  
  readonly selectedFileName = signal<string>('');
  readonly fileValidationMessage = signal<string>('');
  readonly fileValidationSuccess = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly errorMessage = signal<string>('');
  excelFile: File | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.resetFileValidation();
      return;
    }

    // Validate extension
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      this.fileValidationMessage.set('❌ Only Excel files are allowed(.xlsx, .xls)');
      this.fileValidationSuccess.set(false);
      this.selectedFileName.set('');
      this.excelFile = null;
      input.value = '';
      return;
    }

    // Read and validate file content
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Validate that it has at least one sheet
        if (workbook.SheetNames.length === 0) {
          this.fileValidationMessage.set('❌ Excel file is empty');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Read the first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Validate that it has content
        if (jsonData.length === 0) {
          this.fileValidationMessage.set('❌ Excel file has no data');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that it has exactly 3 columns
        const firstRow = jsonData[0] as any[];
        if (!firstRow || firstRow.length !== 3) {
          this.fileValidationMessage.set('❌ Excel file must have exactly 3 columns');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that the columns are correct
        const requiredColumns = ['seniority', 'years of experience', 'availability'];
        const actualColumns = firstRow.map((col: any) => 
          String(col || '').toLowerCase().trim()
        );
        
        const hasAllColumns = requiredColumns.every(reqCol => 
          actualColumns.includes(reqCol)
        );

        if (!hasAllColumns) {
          this.fileValidationMessage.set('❌ Excel must have columns: Seniority, Years of experience, Availability');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that it has exactly 2 rows (1 header + 1 data row)
        if (jsonData.length !== 2) {
          this.fileValidationMessage.set('❌ Excel must have exactly 1 data row (plus headers)');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that the data row has exactly 3 values
        const dataRow = jsonData[1] as any[];
        if (!dataRow || dataRow.length !== 3) {
          this.fileValidationMessage.set('❌ Data row must have exactly 3 values in the correct columns');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that all data cells are filled
        const hasEmptyValues = dataRow.some((value: any) => 
          value === null || value === undefined || String(value).trim() === ''
        );

        if (hasEmptyValues) {
          this.fileValidationMessage.set('❌ All data cells must be filled');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that Seniority is "junior" or "senior"
        const seniorityIndex = actualColumns.indexOf('seniority');
        const seniorityValue = String(dataRow[seniorityIndex] || '').toLowerCase().trim();
        
        if (seniorityValue !== 'junior' && seniorityValue !== 'senior') {
          this.fileValidationMessage.set('❌ Seniority must be "junior" or "senior"');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that Years of experience is a number between 0 and 99
        const yearsIndex = actualColumns.indexOf('years of experience');
        const yearsValue = dataRow[yearsIndex];
        const yearsNumber = Number(yearsValue);
        
        if (isNaN(yearsNumber) || yearsNumber < 0 || yearsNumber > 99 || !Number.isInteger(yearsNumber)) {
          this.fileValidationMessage.set('❌ Years of experience must be a whole number between 0 and 99');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // Validate that Availability is a valid boolean value
        const availabilityIndex = actualColumns.indexOf('availability');
        const availabilityValue = String(dataRow[availabilityIndex] || '').toLowerCase().trim();
        const validBooleanValues = ['true', 'false', '1', '0', 'yes', 'no'];
        
        if (!validBooleanValues.includes(availabilityValue)) {
          this.fileValidationMessage.set('❌ Availability must be true/false, 1/0, or yes/no');
          this.fileValidationSuccess.set(false);
          this.selectedFileName.set('');
          this.excelFile = null;
          input.value = '';
          return;
        }

        // If it passes all validations
        this.excelFile = file;
        this.selectedFileName.set(file.name);
        this.fileValidationMessage.set('✓ Valid file');
        this.fileValidationSuccess.set(true);

      } catch (error) {
        this.fileValidationMessage.set('❌ Error reading Excel file');
        this.fileValidationSuccess.set(false);
        this.selectedFileName.set('');
        this.excelFile = null;
        input.value = '';
      }
    };

    reader.onerror = () => {
      this.fileValidationMessage.set('❌ Error reading file');
      this.fileValidationSuccess.set(false);
      this.selectedFileName.set('');
      this.excelFile = null;
      input.value = '';
    };

    reader.readAsBinaryString(file);
  }

  private resetFileValidation(): void {
    this.selectedFileName.set('');
    this.fileValidationMessage.set('');
    this.fileValidationSuccess.set(false);
    this.excelFile = null;
  }

  closeError(): void {
    this.submitStatus.set('idle');
    this.errorMessage.set('');
  }

  onSubmit() {
    this.submitted = true;
    if (this.form().valid && this.excelFile) {
      this.isLoading.set(true);
      this.submitStatus.set('idle');
      const { name, surname } = this.form().value;
      const newCandidate: CandidateInfo = {
        id: Date.now(),
        name: name as string ?? '',
        surname: surname as string ?? '',
        excel: this.excelFile
      };
      
      const createRequest = this.candidatesService.createCandidate(newCandidate as any).pipe(
        catchError(err => of({ error: err, success: false }))
      );
      const minDelay = timer(1500);
      
      forkJoin([createRequest, minDelay]).subscribe({
        next: ([result]) => {
          this.isLoading.set(false);
          
          if (!result || (result && 'error' in result && !result.success)) {
            // Error case - result is null or has error property
            const serviceError = this.candidatesService.error();
            const componentError = result && 'error' in result ? result.error : null;
            
            this.submitStatus.set('error');
            
            // Priority: 1) Service error signal, 2) Component catchError, 3) Generic message
            if (serviceError) {
              this.errorMessage.set(serviceError);
            } else if (componentError) {
              this.errorMessage.set(componentError.error?.error || componentError.message || 'An error occurred while creating the candidate');
            } else {
              this.errorMessage.set('An error occurred while creating the candidate');
            }
            
            console.error('Error creating candidate:', componentError || serviceError);
          } else {
            // Success case
            this.store.dispatch(createCandidate({ candidate: result as any }));
            this.submitStatus.set('success');
            this.form().reset();
            this.submitted = false;
            this.resetFileValidation();
            
            setTimeout(() => {
              this.submitStatus.set('idle');
              this.submittedSuccessfully.emit();
            }, 2000);
          }
        }
      });
    } else {
      this.form().markAllAsTouched();
    }
  }
}
