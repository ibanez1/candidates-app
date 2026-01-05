import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'candidates-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div #backdrop class="modal-backdrop" tabindex="0" (keyup.enter)="onBackdropClick()" (click)="onBackdropClick()">
        <div class="modal-content" tabindex="0" (keyup.enter)="$event.stopPropagation()" (click)="$event.stopPropagation()">
          <button class="modal-close" tabindex="0" (click)="closed.emit()" (keyup.enter)="closed.emit()" (keydown.enter)="closed.emit()" aria-label="Cerrar modal">&times;</button>
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      padding: 32px 24px 24px 24px;
      min-width: 320px;
      max-width: 90vw;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      position: relative;
      animation: modalIn 0.18s cubic-bezier(.4,0,.2,1);
    }
    .modal-close {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      font-size: 2rem;
      color: #888;
      cursor: pointer;
      transition: color 0.2s;
    }
    .modal-close:hover {
      color: #e53935;
    }
    @keyframes modalIn {
      from { transform: translateY(40px) scale(0.98); opacity: 0; }
      to { transform: none; opacity: 1; }
    }
  `]
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
