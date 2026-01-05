import { Component, input, output, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { Candidate } from '@org/models';

@Component({
  selector: 'candidates-grid',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSortModule, MatPaginatorModule],
  template: `
    <div class="candidate-grid">
      <table #tableRef mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1" style="width:100%; table-layout: fixed;">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="name">
            Name
            <div class="resize-handle" (pointerdown)="startResize($event, 'name')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'name'">{{ c.name }}</td>
        </ng-container>

        <ng-container matColumnDef="surname">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="surname">
            Surname
            <div class="resize-handle" (pointerdown)="startResize($event, 'surname')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'surname'">{{ c.surname }}</td>
        </ng-container>

        <ng-container matColumnDef="seniority">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="seniority">
            Seniority
            <div class="resize-handle" (pointerdown)="startResize($event, 'seniority')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'seniority'">{{ c.seniority }}</td>
        </ng-container>

        <ng-container matColumnDef="years">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="years">
            Years
            <div class="resize-handle" (pointerdown)="startResize($event, 'years')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'years'">{{ c.years }}</td>
        </ng-container>

        <ng-container matColumnDef="availability">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="availability">
            Available
            <div class="resize-handle" (pointerdown)="startResize($event, 'availability')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'availability'">{{ c.availability ? 'Yes' : 'No' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef data-col="actions"></th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'actions'">
            <button mat-button (click)="candidateSelect.emit(c)" aria-label="View" style="margin-right: 4px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#333" stroke-width="2" fill="none"/>
                <circle cx="12" cy="12" r="3.5" stroke="#333" stroke-width="2" fill="none"/>
              </svg>
            </button>
            <button mat-button (click)="deleteCandidate.emit(c)" color="warn" aria-label="Delete">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18" stroke="#e53935" stroke-width="2"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#e53935" stroke-width="2"/>
                <rect x="5" y="6" width="14" height="14" rx="2" stroke="#e53935" stroke-width="2"/>
                <path d="M10 11v6" stroke="#e53935" stroke-width="2"/>
                <path d="M14 11v6" stroke="#e53935" stroke-width="2"/>
              </svg>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>


      </table>

      <div class="paginator-wrap bottom">
        <mat-paginator [pageSizeOptions]="[10]" [pageSize]="10" showFirstLastButtons></mat-paginator>
      </div>
  
      @if (!candidates() || candidates().length === 0) {
        <div class="no-candidates">
          <p>No candidates found</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./candidate-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateGridComponent implements AfterViewInit {
  readonly candidates = input.required<Candidate[]>();
  readonly candidateSelect = output<Candidate>();
  readonly deleteCandidate = output<Candidate>();

  readonly displayedColumns = ['name', 'surname', 'seniority', 'years', 'availability', 'actions'];

  dataSource = new MatTableDataSource<Candidate>([]);

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild('tableRef', { read: ElementRef }) tableRef?: ElementRef<HTMLTableElement>;


  // resizing internal state
  private _resizing = false;
  private _currentCol?: string;
  private _startX = 0;
  private _startWidth = 0;

  // bound handlers for add/remove listener
  private _onPointerMove = (ev: PointerEvent) => this._handlePointerMove(ev);
  private _onPointerUp = (ev: PointerEvent) => this._handlePointerUp(ev);
  
  constructor() {
    effect(() => {
      const data = this.candidates() || [];
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }


  startResize(ev: PointerEvent, col: string): void {
    ev.preventDefault();
    this._resizing = true;
    this._currentCol = col;
    this._startX = ev.clientX;
    const th = this.tableRef?.nativeElement.querySelector(`th[data-col="${col}"]`) as HTMLElement | null;
    this._startWidth = th?.offsetWidth || 0;
    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp);
  }

  private _handlePointerMove(ev: PointerEvent): void {
    if (!this._resizing || !this._currentCol) return;
    const dx = ev.clientX - this._startX;
    const newWidth = Math.max(40, this._startWidth + dx);
    this._setColumnWidth(this._currentCol, newWidth);
  }

  private _handlePointerUp(_ev: PointerEvent): void {
    this._resizing = false;
    this._currentCol = undefined;
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
  }

  private _setColumnWidth(col: string, px: number): void {
    const ths = this.tableRef?.nativeElement.querySelectorAll(`th[data-col="${col}"]`) || [];
    const tds = this.tableRef?.nativeElement.querySelectorAll(`td[data-col="${col}"]`) || [];
    ths.forEach((n: Element) => (n as HTMLElement).style.width = px + 'px');
    tds.forEach((n: Element) => (n as HTMLElement).style.width = px + 'px');
  }
}