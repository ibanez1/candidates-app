import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'candidates-error-message',
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ title() || 'Oops! Something went wrong' }}</h3>
      <p>{{ message() || 'An unexpected error occurred. Please try again later.' }}</p>
      @if (showRetry()) {
        <button class="retry-button" (click)="retry.emit()">
          Try Again
        </button>
      }
    </div>
  `,
  styleUrls: ['./error-message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  readonly title = input<string>();
  readonly message = input<string>();
  readonly showRetry = input(true);
  readonly retry = output<void>();
}