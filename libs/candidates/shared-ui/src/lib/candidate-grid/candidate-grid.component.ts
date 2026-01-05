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

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header data-col="id">
            ID
            <div class="resize-handle" (pointerdown)="startResize($event, 'id')"></div>
          </th>
          <td mat-cell *matCellDef="let c" [attr.data-col]="'id'">{{ c.id }}</td>
        </ng-container>

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
            <button mat-button (click)="candidateSelect.emit(c)">Select</button>
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
  styles: [`
    .candidate-grid {
      padding: 24px 0;
    }

    .no-candidates {
      text-align: center;
      padding: 48px 0;
      color: #666;
      font-size: 1.1rem;
    }

    /* Make header text bold with increased specificity to override Material defaults */
    th.mat-header-cell,
    .mat-header-row th.mat-header-cell,
    .mat-sort-header,
    .mat-sort-header-button,
    .mat-sort-header .mat-sort-header-container {
      font-weight: 700 !important;
    }

    table.mat-elevation-z1 {
      width: 100%;
      border-collapse: collapse;
      margin-left: 10px;
      margin-right: 10px;
    }

    /* column separators */
    th.mat-header-cell,
    td[data-col] {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
    }

    /* remove separator on last column */
    th.mat-header-cell:last-child,
    td[data-col]:last-child {
      border-right: none;
    }
    /* resize handle: hidden by default, visible on header hover */
    th.mat-header-cell { position: relative; }
    .resize-handle {
      position: absolute;
      right: -6px;
      top: 0;
      height: 100%;
      width: 12px;
      cursor: col-resize;
      z-index: 20;
      opacity: 0;
      transition: opacity 120ms ease-in-out, background 120ms;
      background: transparent;
      pointer-events: auto;
    }
    th.mat-header-cell:hover .resize-handle,
    th.mat-header-cell:active .resize-handle {
      opacity: 1;
      background: rgba(0,0,0,0.06);
    }
    .paginator-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    .paginator-wrap.bottom { margin-top: 8px; }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateGridComponent implements AfterViewInit {
  readonly candidates = input.required<Candidate[]>();
  readonly candidateSelect = output<Candidate>();

  readonly displayedColumns = ['id', 'name', 'surname', 'seniority', 'years', 'availability', 'actions'];

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