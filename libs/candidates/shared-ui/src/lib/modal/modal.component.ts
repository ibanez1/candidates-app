import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'candidates-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div #backdrop class="modal-backdrop" tabindex="0">
        <div class="modal-content" tabindex="0" (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()">
          <button class="modal-close" tabindex="0" (click)="closed.emit()" (keyup.enter)="closed.emit()" (keydown.enter)="closed.emit()" aria-label="Cerrar modal">&times;</button>
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnChanges, AfterViewInit {
    ngAfterViewInit() {
      this.tryFocusBackdrop();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['open'] && changes['open'].currentValue) {
        this.tryFocusBackdrop();
      }
    }

    private tryFocusBackdrop() {
      if (this.open && this.backdropRef?.nativeElement) {
        this.backdropRef.nativeElement.focus();
        if (document.activeElement === this.backdropRef.nativeElement) return;
      }
      if (this.open) {
        const observer = new MutationObserver(() => {
          if (this.backdropRef?.nativeElement) {
            this.backdropRef.nativeElement.focus();
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('backdrop') backdropRef?: ElementRef<HTMLDivElement>;

  onBackdropClick() {
    this.closed.emit();
  }
}
