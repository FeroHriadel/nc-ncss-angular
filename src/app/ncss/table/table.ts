import {
  afterEveryRender, afterNextRender, booleanAttribute, Component, computed, DestroyRef, ElementRef, inject, Injector, input, model, OnInit, output, signal,
  viewChild
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pill } from '../pills/pill';
import { TableControls } from './table-controls';
import { FilterColumn, TableFilterDialog } from './table-filter';
import { TableState } from './table-state';
import {
  copyText, ResolvedCell, TableCellRender, TableColumn, TableColumnInput, TableFilter, TableSort
} from './table-utils';
import { Tree } from './tree';

/** Row height assumed for rows that were never on screen, until real rows have been measured. */
const DEFAULT_ROW_HEIGHT = 37;
/** Rows drawn above and below the visible ones when virtualized, so fast scrolling doesn't show gaps. */
const OVERSCAN = 6;
/** Height of a virtualized table that has no `height`. */
const DEFAULT_VIRTUAL_HEIGHT = '500px';

/**
 * A data table made of divs with ARIA roles (no table markup), so layout stays free.
 *
 * ```html
 * <nc-table [data]="rows" />                                   <!-- columns come from the data -->
 * <nc-table [data]="rows" [(columns)]="cols" [(sort)]="sort" height="400px" />
 * ```
 *
 * Everything the user can change in the UI (sort, column order, column widths) is written back to the
 * two-way `columns` and `sort` inputs, so you can save it (see `serializeColumns` / `applyColumnState`).
 */
@Component({
  selector: 'nc-table',
  imports: [NgTemplateOutlet, Tree, TableControls, TableFilterDialog, Pill],
  templateUrl: './table.html',
  styleUrl: './table.css',
  providers: [TableState],
  host: { class: 'table-host' }
})
export class Table implements OnInit {
  protected readonly state = inject(TableState);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly injector = inject(Injector);

  /** The rows: an array of objects. */
  readonly data = input<readonly unknown[]>([]);
  /**
   * The columns to show, in order. Columns that are not listed are not shown, even if the data has them.
   * Write just a key (`'name'`) or `{ key, label, width, minWidth, maxWidth, type, render... }`.
   * Leave empty to show every key of the data. Supports two-way binding: `[(columns)]`.
   */
  readonly columns = model<TableColumnInput[]>([]);
  /**
   * Keys of columns that are hidden (the user can hide columns with the controls above the table).
   * They stay in `columns`, so they can be shown again. Supports two-way binding: `[(hiddenColumns)]`.
   */
  readonly hiddenColumns = model<string[]>([]);
  /**
   * Filter conditions (column, operator, value, join). Set by the filter dialog, or write them yourself.
   * Supports two-way binding: `[(filters)]`.
   */
  readonly filters = model<TableFilter[]>([]);
  /** The current sort, or null. Supports two-way binding: `[(sort)]`. */
  readonly sort = model<TableSort | null>(null);
  /** Shows the bar above the table: row count, reload, show/hide columns and filter. */
  readonly controls = input(true, { transform: booleanAttribute });
  /** Shows "Loading..." instead of the row count, e.g. while you fetch new data. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Every second row has a slightly different background. */
  readonly striped = input(true, { transform: booleanAttribute });
  /** Maximum height (px number or any CSS size). Taller content scrolls, the header stays visible. */
  readonly height = input<string | number | null>(null);
  /**
   * Draws only the rows that are on screen, so huge tables stay fast. Rows may have different heights: each row is
   * measured once it has been drawn. Without a `height` a virtualized table is 500px tall.
   */
  readonly virtualized = input(false, { transform: booleanAttribute });
  /** Lets the user drag a column's edge to resize it. */
  readonly resizable = input(true, { transform: booleanAttribute });
  /** Lets the user drag a header to reorder columns (or Alt+Arrow keys on a focused header). */
  readonly reorderable = input(true, { transform: booleanAttribute });
  /** Changes every cell that has no `render` of its own: `(value, row, key) => ...`. */
  readonly cellModifier = input<TableCellRender>();
  /** Render HTML cells without Angular's sanitizer. Only for HTML you wrote yourself. */
  readonly trustHtml = input(false, { transform: booleanAttribute });
  /** Text shown when there are no rows. */
  readonly emptyText = input('No data');
  /** Accessible name of the table. */
  readonly ariaLabel = input('');
  /** Accessible name of the resize handles. The column name is added after it. */
  readonly resizeLabel = input('Resize column');
  /** Short message shown in a cell after its content was copied. */
  readonly copiedLabel = input('Copied');

  /** Emits when the reload button is pressed, after the table went back to its first configuration. Fetch new data here. */
  readonly reload = output<void>();
  protected readonly filterOpen = signal(false);

  /** What the table was given first: Reload goes back to this. */
  private initial: { columns: TableColumnInput[]; hidden: string[]; filters: TableFilter[]; sort: TableSort | null } | null = null;

  protected readonly columnOptions = computed(() => this.state.allColumns().map(column => ({ value: column.key, label: this.state.label(column) })));
  protected readonly filterColumns = computed<FilterColumn[]>(() =>
    this.state.allColumns().map(column => ({ value: column.key, label: this.state.label(column), kind: this.state.filterColumns().get(column.key)?.kind ?? 'text' }))
  );
  protected readonly visibleKeys = computed(() => this.state.columns().map(column => column.key));

  protected readonly maxHeight = computed(() => {
    const height = this.height() ?? (this.virtualized() ? DEFAULT_VIRTUAL_HEIGHT : null);
    return typeof height === 'number' ? `${height}px` : height;
  });

  // ---------- Virtualization ----------

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly scrollTop = signal(0);
  private readonly viewportHeight = signal(0);
  /** Real heights of rows that have been drawn, by original row index (so they survive sorting and filtering). */
  private readonly measured = new Map<number, number>();
  private measuredSum = 0;
  private readonly measureVersion = signal(0);

  /** `offsets[i]` is where row `i` starts in the body; the last entry is the total height. Unmeasured rows use the average. */
  private readonly offsets = computed(() => {
    this.measureVersion();
    const rows = this.state.rows();
    const offsets = new Float64Array(this.virtualized() ? rows.length + 1 : 0);
    if (!offsets.length) return offsets;
    const estimate = this.measured.size ? this.measuredSum / this.measured.size : DEFAULT_ROW_HEIGHT;
    for (let i = 0; i < rows.length; i++) offsets[i + 1] = offsets[i] + (this.measured.get(rows[i].index) ?? estimate);
    return offsets;
  });

  /** Which rows are drawn, and how much empty space stands in for the others. */
  protected readonly window = computed(() => {
    const count = this.state.rows().length;
    if (!this.virtualized()) return { start: 0, end: count, before: 0, after: 0 };
    const offsets = this.offsets();
    const top = this.scrollTop();
    const bottom = top + (this.viewportHeight() || 500);
    const start = Math.max(0, this.indexAt(offsets, top) - OVERSCAN);
    const end = Math.min(count, this.indexAt(offsets, bottom) + 1 + OVERSCAN);
    return { start, end, before: offsets[start], after: offsets[count] - offsets[end] };
  });

  protected readonly renderedRows = computed(() => {
    const { start, end } = this.window();
    return start === 0 && end === this.state.rows().length ? this.state.rows() : this.state.rows().slice(start, end);
  });

  /** The row that contains vertical position `y` (binary search over `offsets`). */
  private indexAt(offsets: Float64Array, y: number): number {
    let low = 0;
    let high = offsets.length - 2;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (offsets[mid] <= y) low = mid;
      else high = mid - 1;
    }
    return Math.max(0, low);
  }

  protected onScroll(): void {
    if (this.virtualized()) this.scrollTop.set(this.scroller()?.nativeElement.scrollTop ?? 0);
  }

  /** Reads the real height of the drawn rows. Changed heights move everything below them, so the offsets are recalculated. */
  private measureRows(): void {
    const body = this.scroller()?.nativeElement.querySelector('.table-body');
    if (!this.virtualized() || !body) return;
    let changed = false;
    for (const row of Array.from(body.children) as HTMLElement[]) {
      const key = row.dataset['row'];
      if (key === undefined) continue;
      const height = row.getBoundingClientRect().height;
      const previous = this.measured.get(+key);
      if (height > 0 && Math.abs(height - (previous ?? -1)) > 0.5) {
        this.measuredSum += height - (previous ?? 0);
        this.measured.set(+key, height);
        changed = true;
      }
    }
    if (changed) this.measureVersion.update(version => version + 1);
  }

  protected readonly dragKey = signal<string | null>(null);
  protected readonly dropKey = signal<string | null>(null);
  protected readonly copied = signal<string | null>(null);
  private readonly safeHtml = new WeakMap<ResolvedCell, SafeHtml>();
  private resizing: { startX: number; startWidth: number } | null = null;
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.state.connect({ data: this.data, columns: this.columns, hiddenColumns: this.hiddenColumns, filters: this.filters, sort: this.sort, cellModifier: this.cellModifier });
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => clearTimeout(this.copiedTimer));

    afterEveryRender(() => this.measureRows());
    afterNextRender(() => {
      const element = this.scroller()?.nativeElement;
      if (!element) return;
      // Rows can change height without any render (column or window resized): look again when the viewport or content size changes.
      const observer = new ResizeObserver(() => {
        this.viewportHeight.set(element.clientHeight);
        this.measureRows();
      });
      observer.observe(element);
      const body = element.querySelector('.table-body');
      if (body) observer.observe(body);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  ngOnInit(): void {
    this.initial = { columns: this.columns(), hidden: this.hiddenColumns(), filters: this.filters(), sort: this.sort() };
  }

  /** Puts columns (order, widths, visibility) and sort back as they were first given. Same as the reload button. */
  resetTable(): void {
    if (this.initial) {
      this.columns.set(this.initial.columns);
      this.hiddenColumns.set(this.initial.hidden);
      this.filters.set(this.initial.filters);
      this.sort.set(this.initial.sort);
    }
    this.state.status.set('Table reset');
  }

  protected onReload(): void {
    this.resetTable();
    this.reload.emit();
  }

  protected ariaSort(column: TableColumn): string | null {
    if (column.sortable === false) return null;
    const sort = this.state.sort();
    return sort?.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
  }

  /** The HTML of a cell: sanitized by Angular, unless `trustHtml` is on. */
  protected html(cell: ResolvedCell): string | SafeHtml {
    if (!this.trustHtml()) return cell.html ?? '';
    let safe = this.safeHtml.get(cell);
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustHtml(cell.html ?? '');
      this.safeHtml.set(cell, safe);
    }
    return safe;
  }

  // ---------- Copy ----------

  protected async copy(cell: ResolvedCell, id: string): Promise<void> {
    if (cell.kind === 'template') return; // the template owns its clicks, and has no text to copy
    const text = copyText(cell);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      this.copyFallback(text);
    }
    window.getSelection()?.removeAllRanges();
    this.copied.set(id);
    this.state.status.set(this.copiedLabel());
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(null), 1200);
  }

  /** For pages without clipboard access (http, old browsers). */
  private copyFallback(text: string): void {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  // ---------- Resize ----------

  protected resizeStart(event: PointerEvent, header: HTMLElement): void {
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.resizing = { startX: event.clientX, startWidth: header.getBoundingClientRect().width };
  }

  protected resizeMove(event: PointerEvent, column: TableColumn): void {
    if (this.resizing) this.state.resizeLive(column, this.resizing.startWidth + event.clientX - this.resizing.startX);
  }

  protected resizeEnd(column: TableColumn): void {
    if (!this.resizing) return;
    this.resizing = null;
    this.state.commitWidth(column);
  }

  protected resizeKey(event: KeyboardEvent, column: TableColumn, header: HTMLElement): void {
    if (event.altKey) return; // Alt+Arrow moves the column, see headerKey
    const step = event.shiftKey ? 50 : 10;
    const width = header.getBoundingClientRect().width;
    if (event.key === 'ArrowLeft') this.state.setWidth(column, width - step);
    else if (event.key === 'ArrowRight') this.state.setWidth(column, width + step);
    else if (event.key === 'Escape' || event.key === 'Delete') this.state.setWidth(column, undefined);
    else return;
    event.preventDefault();
  }

  // ---------- Reorder ----------

  protected dragStart(event: DragEvent, column: TableColumn): void {
    if (this.resizing || !this.reorderable()) {
      event.preventDefault();
      return;
    }
    this.dragKey.set(column.key);
    event.dataTransfer?.setData('text/plain', column.key);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  protected dragOver(event: DragEvent, column: TableColumn): void {
    if (!this.dragKey()) return;
    event.preventDefault();
    this.dropKey.set(column.key);
  }

  protected drop(event: DragEvent, column: TableColumn): void {
    event.preventDefault();
    const from = this.dragKey();
    if (from && from !== column.key) {
      this.state.moveTo(from, this.state.columns().findIndex(item => item.key === column.key));
    }
    this.dragEnd();
  }

  protected dragEnd(): void {
    this.dragKey.set(null);
    this.dropKey.set(null);
  }

  /** Where a dragged column would land relative to this header, for the drop marker. */
  protected dropSide(column: TableColumn): 'before' | 'after' | null {
    const from = this.dragKey();
    if (!from || this.dropKey() !== column.key || from === column.key) return null;
    const keys = this.state.columns().map(item => item.key);
    return keys.indexOf(from) < keys.indexOf(column.key) ? 'after' : 'before';
  }

  protected headerKey(event: KeyboardEvent, column: TableColumn): void {
    if (!event.altKey || !this.reorderable()) return;
    const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!delta) return;
    event.preventDefault();
    const target = event.target as HTMLElement;
    this.state.moveBy(column.key, delta);
    // Moving the element in the DOM drops focus, so put it back.
    afterNextRender(() => target.focus(), { injector: this.injector });
  }
}
