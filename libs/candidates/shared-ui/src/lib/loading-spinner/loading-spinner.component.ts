import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'candidates-loading-spinner',
  imports: [CommonModule],
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}