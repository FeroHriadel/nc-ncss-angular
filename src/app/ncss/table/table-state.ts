import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  clampWidth, columnKind, compareValues, DEFAULT_MIN_WIDTH, deriveColumns, describeFilter, getValue, isEmpty, matchesFilters, normalizeColumn, ResolvedCell,
  resolveCell, TableCellRender, TableColumn, TableColumnInput, TableFilter, TableFilterKind, TableSort
} from './table-utils';

/** What the table component hands to its state: its own inputs and models. */
export interface TableSource {
  data: Signal<readonly unknown[]>;
  columns: WritableSignal<TableColumnInput[]>;
  /** Keys of columns the user (or you) hid. They stay in `columns`, so they can be shown again. */
  hiddenColumns: WritableSignal<string[]>;
  /** Applied filter conditions. */
  filters: WritableSignal<TableFilter[]>;
  sort: WritableSignal<TableSort | null>;
  cellModifier: Signal<TableCellRender | undefined>;
}

/** A row ready to be drawn. `index` is its position in the original data. */
export interface TableRowView {
  index: number;
  cells: ResolvedCell[];
}

/**
 * The brain of one `<nc-table>`. It is provided by the component (`providers: [TableState]`), not by the root,
 * so every table on a page has its own state. Filtering and other features will be added here.
 *
 * It never keeps its own copy of what the user can change: sort and columns live in the component's `model()`s,
 * so the parent always sees them and can save them.
 */
@Injectable()
export class TableState {
  private readonly source = signal<TableSource | null>(null);

  /** Widths while a column is being dragged. Written to `columns` when the drag ends. */
  private readonly liveWidths = signal<Record<string, number>>({});

  /** A short message for screen readers ("Name sorted ascending"). */
  readonly status = signal('');

  connect(source: TableSource): void {
    this.source.set(source);
  }

  /** Every column the table can show, in order, hidden ones included. Without any `columns` they come from the data. */
  readonly allColumns = computed<TableColumn[]>(() => {
    const source = this.source();
    if (!source) return [];
    const given = source.columns();
    return given.length ? given.map(normalizeColumn) : deriveColumns(source.data());
  });

  /** The columns on screen, in order. */
  readonly columns = computed<TableColumn[]>(() => {
    const hidden = this.source()?.hiddenColumns() ?? [];
    return hidden.length ? this.allColumns().filter(column => !hidden.includes(column.key)) : this.allColumns();
  });

  /** Number of rows in the data. */
  readonly totalCount = computed(() => this.source()?.data().length ?? 0);

  /** Number of rows that match the filters. */
  readonly rowCount = computed(() => this.rows().length);

  /** The applied filters. */
  readonly filters = computed(() => this.source()?.filters() ?? []);

  /** Every column the filter can use (hidden ones too) with how its values are compared. */
  readonly filterColumns = computed(() => {
    const data = this.source()?.data() ?? [];
    return new Map(this.allColumns().map(column => [column.key, { column, kind: columnKind(data, column) as TableFilterKind }]));
  });

  /** Set while rows are being worked on (loading or, later, filtering). Shown by the controls. */
  readonly busy = signal(false);

  readonly sort = computed(() => this.source()?.sort() ?? null);

  /** CSS `grid-template-columns`: fixed px for sized columns, flexible for the rest. */
  readonly gridTemplate = computed(() =>
    this.columns()
      .map(column => {
        const min = column.minWidth ?? DEFAULT_MIN_WIDTH;
        const width = this.widthOf(column);
        if (width !== undefined) return `${width}px`;
        return column.maxWidth === undefined ? `minmax(${min}px, 1fr)` : `minmax(${min}px, ${Math.max(column.maxWidth, min)}px)`;
      })
      .join(' ')
  );

  /** Narrowest the table can get before it scrolls sideways. */
  readonly minWidth = computed(() =>
    this.columns().reduce((sum, column) => sum + (this.widthOf(column) ?? column.minWidth ?? DEFAULT_MIN_WIDTH), 0)
  );

  /** Right-aligned for columns that only hold numbers, unless the column says otherwise. */
  readonly alignments = computed(() => {
    const data = this.source()?.data() ?? [];
    const result: Record<string, 'start' | 'end' | 'center'> = {};
    for (const column of this.columns()) {
      if (column.align) {
        result[column.key] = column.align;
        continue;
      }
      result[column.key] = columnKind(data, column) === 'number' ? 'end' : 'start';
    }
    return result;
  });

  /** The rows in display order, with every cell already worked out. */
  readonly rows = computed<TableRowView[]>(() => {
    const source = this.source();
    if (!source) return [];
    const columns = this.columns();
    const modifier = source.cellModifier();
    const sort = this.sort();
    const sortColumn = sort ? columns.find(column => column.key === sort.key && column.sortable !== false) : undefined;

    const filters = this.filters();
    const kinds = this.filterColumns();
    const visible = filters.length
      ? source.data().map((row, index) => ({ row, index })).filter(({ row }) => matchesFilters(filters, row, kinds, modifier))
      : source.data().map((row, index) => ({ row, index }));

    let entries = visible.map(({ row, index }) => ({ row, index, sortValue: sortColumn ? getValue(row, sortColumn.key) : undefined }));
    if (sort && sortColumn) {
      const direction = sort.dir === 'asc' ? 1 : -1;
      entries = [...entries].sort((a, b) => {
        const aEmpty = isEmpty(a.sortValue);
        const bEmpty = isEmpty(b.sortValue);
        if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1; // null, undefined and NaN always last
        return direction * compareValues(a.sortValue, b.sortValue);
      });
    }

    return entries.map(({ row, index }) => ({
      index,
      cells: columns.map(column => resolveCell(getValue(row, column.key), row, column, modifier))
    }));
  });

  // ---------- Actions (everything the UI can change) ----------

  /** Text of a condition for its pill, e.g. `name contains "pe"`. */
  describe(filter: TableFilter): string {
    const column = this.allColumns().find(item => item.key === filter.column);
    return describeFilter(filter, column ? this.label(column) : filter.column);
  }

  /** Removes one applied condition. */
  removeFilter(index: number): void {
    this.source()?.filters.update(filters => filters.filter((_, i) => i !== index));
  }

  /** Cycles a column: ascending, descending, unsorted. */
  toggleSort(column: TableColumn): void {
    const source = this.source();
    if (!source) return;
    const current = source.sort();
    const next = current?.key !== column.key ? 'asc' : current.dir === 'asc' ? 'desc' : null;
    source.sort.set(next ? { key: column.key, dir: next } : null);
    this.status.set(`${this.label(column)}: ${next === 'asc' ? 'sorted ascending' : next === 'desc' ? 'sorted descending' : 'not sorted'}`);
  }

  /** Shows a width while dragging, without telling the parent yet. */
  resizeLive(column: TableColumn, width: number): void {
    this.liveWidths.update(widths => ({ ...widths, [column.key]: clampWidth(width, column.minWidth, column.maxWidth) }));
  }

  /** Writes the dragged width to `columns`. */
  commitWidth(column: TableColumn): void {
    const width = this.liveWidths()[column.key];
    this.liveWidths.update(widths => {
      const rest = { ...widths };
      delete rest[column.key];
      return rest;
    });
    if (width !== undefined) this.setWidth(column, width);
  }

  setWidth(column: TableColumn, width: number | undefined): void {
    this.update(columns =>
      columns.map(item => (item.key === column.key ? { ...item, width: width === undefined ? undefined : clampWidth(width, item.minWidth, item.maxWidth) } : item))
    );
  }

  /** Moves a column to a new position (index among the shown columns). Hidden columns keep their place. */
  moveTo(key: string, index: number): void {
    const shown = this.columns();
    const from = shown.findIndex(column => column.key === key);
    const to = Math.max(0, Math.min(index, shown.length - 1));
    if (from < 0 || from === to) return;
    const all = [...this.allColumns()];
    const [moved] = all.splice(all.findIndex(column => column.key === key), 1);
    // Land where the column that is currently at the target position is.
    const target = shown[to].key;
    const targetIndex = all.findIndex(column => column.key === target);
    all.splice(to > from ? targetIndex + 1 : targetIndex, 0, moved);
    this.source()?.columns.set(all);
    this.status.set(`${this.label(moved)} moved to position ${to + 1} of ${shown.length}`);
  }

  /** Shows exactly these columns (by key). The others are hidden. */
  setVisible(keys: readonly string[]): void {
    const hidden = this.allColumns().map(column => column.key).filter(key => !keys.includes(key));
    this.source()?.hiddenColumns.set(hidden);
    this.status.set(`${keys.length} of ${this.allColumns().length} columns shown`);
  }

  moveBy(key: string, delta: number): void {
    const from = this.columns().findIndex(column => column.key === key);
    if (from >= 0) this.moveTo(key, from + delta);
  }

  label(column: TableColumn): string {
    return column.label ?? column.key;
  }

  private widthOf(column: TableColumn): number | undefined {
    const width = this.liveWidths()[column.key] ?? column.width;
    return width === undefined ? undefined : clampWidth(width, column.minWidth, column.maxWidth);
  }

  /** Changes the columns. Columns derived from the data become explicit on the first change. */
  private update(change: (columns: TableColumn[]) => TableColumn[]): void {
    this.source()?.columns.set(change(this.allColumns()));
  }
}
