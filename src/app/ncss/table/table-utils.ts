/** Direction of a sort. */
export type TableSortDir = 'asc' | 'desc';

/** The current sort of a table. `null` means "unsorted" (original order). */
export interface TableSort {
  key: string;
  dir: TableSortDir;
}

import type { TemplateRef } from '@angular/core';

/**
 * How a column shows its values.
 * - `auto` (default): decides by the value (number, text, array, object...).
 * - `text`: always shows the value as text.
 * - `number`: right-aligned number.
 * - `html`: string values are rendered as HTML (sanitized unless `trustHtml` is set on the table).
 * - `tree`: object/array values are shown as an expandable `<nc-tree>`.
 */
export type TableCellType = 'auto' | 'text' | 'number' | 'html' | 'tree';

/**
 * Changes what a cell shows. Receives the raw value, the whole row and the column key.
 * Return a plain value (shown like any data), `asHtml('<b>x</b>')`, `asTree(object)` or `asTemplate(templateRef)`.
 */
export type TableCellRender = (value: unknown, row: unknown, key: string) => unknown;

export interface TableColumn {
  /** Property name in the row objects. Use 'a.b' for nested values. */
  key: string;
  /** Header text. Defaults to `key`. */
  label?: string;
  /** Width in px. Leave out to share the free space with the other columns. */
  width?: number;
  /** Minimum width in px. Default 80. */
  minWidth?: number;
  /** Maximum width in px. */
  maxWidth?: number;
  /** Set to false to disable sorting by this column. Default true. */
  sortable?: boolean;
  /** How values are shown. Default 'auto'. */
  type?: TableCellType;
  /** Text alignment. Default: numbers (and numeric strings) to the right, the rest to the left. */
  align?: 'start' | 'end' | 'center';
  /** Changes the cell content for this column. Wins over the table's `cellModifier`. */
  render?: TableCellRender;
}

/** A column can be written as just its key: `['name', 'age']`. */
export type TableColumnInput = string | TableColumn;

/** What `render` returns to show HTML. */
export class HtmlCell {
  constructor(readonly html: string) {}
}

/** What `render` returns to show an `<nc-tree>`. */
export class TreeCell {
  constructor(readonly value: unknown) {}
}

/** What an `<ng-template>` used as a cell receives: `let-value let-row="row" let-key="key"`. */
export interface TableCellContext {
  /** The raw value of the cell. */
  $implicit: unknown;
  /** The whole row object. */
  row: unknown;
  /** The column key. */
  key: string;
  [extra: string]: unknown;
}

/** What `render` returns to show an Angular template. */
export class TemplateCell {
  constructor(readonly template: TemplateRef<any>, readonly extra?: Record<string, unknown>) {}
}

/** Marks a string as HTML for a cell: `render: v => asHtml('<b>' + v + '</b>')`. */
export const asHtml = (html: string): HtmlCell => new HtmlCell(html);

/** Shows a value as an expandable tree: `render: v => asTree(v)`. */
export const asTree = (value: unknown): TreeCell => new TreeCell(value);

/**
 * Shows an `<ng-template>` in the cell: real Angular, so `(click)`, components and pipes work.
 * `render: () => asTemplate(this.actions())`. The template gets `$implicit` (the value), `row` and `key`, plus `extra` if given.
 */
export const asTemplate = (template: TemplateRef<any>, extra?: Record<string, unknown>): TemplateCell => new TemplateCell(template, extra);

/** A cell ready to be drawn. */
export interface ResolvedCell {
  kind: 'text' | 'number' | 'json' | 'html' | 'tree' | 'template';
  /** The text shown (and copied) for text, number and json cells. */
  text: string;
  html?: string;
  tree?: unknown;
  template?: TemplateRef<any>;
  /** What the template receives. */
  context?: TableCellContext;
}

/** Saved shape of a column: only what the user can change in the UI. Safe for JSON/localStorage. */
export interface TableColumnState {
  key: string;
  width?: number;
}

export const DEFAULT_MIN_WIDTH = 80;

export function normalizeColumn(column: TableColumnInput): TableColumn {
  return typeof column === 'string' ? { key: column } : column;
}

/** Reads `row[key]`, or `row.a.b` for the key 'a.b'. */
export function getValue(row: unknown, key: string): unknown {
  if (row === null || typeof row !== 'object') return undefined;
  if (key in row) return (row as Record<string, unknown>)[key];
  let current: unknown = row;
  for (const part of key.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** Columns for a table that was not given any: the keys of the first rows. */
export function deriveColumns(data: readonly unknown[]): TableColumn[] {
  const keys = new Set<string>();
  for (const row of data.slice(0, 100)) {
    if (row !== null && typeof row === 'object' && !Array.isArray(row)) {
      for (const key of Object.keys(row)) keys.add(key);
    }
  }
  return [...keys].map(key => ({ key }));
}

export function clampWidth(width: number, min = DEFAULT_MIN_WIDTH, max?: number): number {
  const upper = max === undefined ? Infinity : Math.max(max, min);
  return Math.round(Math.min(Math.max(width, min), upper));
}

/** The part of the columns that is worth saving (order and widths). */
export function serializeColumns(columns: readonly TableColumnInput[]): TableColumnState[] {
  return columns.map(normalizeColumn).map(({ key, width }) => (width === undefined ? { key } : { key, width }));
}

/**
 * Puts saved order and widths back on your column definitions (which keep their `render` functions).
 * Columns that were not saved (e.g. added later) go to the end.
 */
export function applyColumnState(columns: readonly TableColumnInput[], saved: readonly TableColumnState[]): TableColumn[] {
  const position = new Map(saved.map((state, index) => [state.key, index]));
  const width = new Map(saved.map(state => [state.key, state.width]));
  return columns
    .map(normalizeColumn)
    .map(column => (width.get(column.key) === undefined ? column : { ...column, width: width.get(column.key) }))
    .sort((a, b) => (position.get(a.key) ?? Infinity) - (position.get(b.key) ?? Infinity) || 0);
}

// ---------- Values ----------

const NUMERIC = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

/** True for numbers (not NaN) and for strings that only contain a number, like '42' or ' 3.5 '. */
export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') return !Number.isNaN(value);
  return typeof value === 'string' && NUMERIC.test(value.trim());
}

/** null, undefined and NaN: values that always sort last. */
export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value));
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return '[Circular or unreadable object]';
  }
}

/** The default text for any value. */
export function toText(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (typeof value === 'string') return value;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  if (Array.isArray(value)) {
    const simple = value.every(item => item === null || typeof item !== 'object');
    return simple ? value.map(toText).join(', ') : safeJson(value);
  }
  if (typeof value === 'object') return safeJson(value);
  return String(value);
}

function isBranch(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !(value instanceof Date);
}

/** Works out what to draw for one cell. */
export function resolveCell(raw: unknown, row: unknown, column: TableColumn, fallback?: TableCellRender): ResolvedCell {
  const render = column.render ?? fallback;
  const value = render ? render(raw, row, column.key) : raw;
  const type = column.type ?? 'auto';

  if (value instanceof HtmlCell) return { kind: 'html', text: '', html: value.html };
  if (value instanceof TemplateCell) {
    return { kind: 'template', text: '', template: value.template, context: { ...value.extra, $implicit: raw, row, key: column.key } };
  }
  if (value instanceof TreeCell) return { kind: 'tree', text: '', tree: value.value };
  if (type === 'html' && typeof value === 'string') return { kind: 'html', text: '', html: value };
  if (type === 'tree' && isBranch(value)) return { kind: 'tree', text: '', tree: value };

  const text = toText(value);
  if (type === 'text') return { kind: 'text', text };
  if (typeof value === 'number' || (type === 'number' && isNumeric(value))) return { kind: 'number', text };
  if (isBranch(value) && !Array.isArray(value)) return { kind: 'json', text };
  return { kind: 'text', text };
}

/** The text of an HTML string, as a user would see it. */
export function htmlToText(html: string): string {
  if (typeof DOMParser === 'undefined') return html.replace(/<[^>]*>/g, '');
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}

/** What double-click copies for a cell. */
export function copyText(cell: ResolvedCell): string {
  if (cell.kind === 'html') return htmlToText(cell.html ?? '').trim();
  if (cell.kind === 'tree') return safeJson(cell.tree);
  if (cell.kind === 'template') return '';
  return cell.text;
}

/**
 * Compares two values for sorting (null, undefined and NaN are handled by the caller).
 * Numbers and numeric strings compare as numbers, so 1, 2, 10, 13, 101 stay in that order.
 * Numbers come before text. Other text compares "naturally": 'item 2' before 'item 10'.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  const aNum = isNumeric(a);
  const bNum = isNumeric(b);
  if (aNum && bNum) {
    const x = Number(a);
    const y = Number(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (aNum !== bNum) return aNum ? -1 : 1;
  return toText(a).localeCompare(toText(b), undefined, { numeric: true, sensitivity: 'base' });
}

// ---------- Filters ----------

export type TableFilterOperator = 'equals' | 'notEquals' | 'greater' | 'less' | 'contains' | 'notContains' | 'isEmpty' | 'isNotEmpty';

/** How a column's values are filtered: `number` columns compare numerically, `text` columns compare text. */
export type TableFilterKind = 'number' | 'text';

/**
 * One condition of a filter: `column` + `operator` + `value`. Plain data, safe for JSON/localStorage.
 * `join` says how the condition combines with the one before it (ignored on the first). AND binds tighter than OR.
 */
export interface TableFilter {
  column: string;
  operator: TableFilterOperator;
  value: string;
  join?: 'and' | 'or';
}

export interface FilterOperatorInfo {
  value: TableFilterOperator;
  label: string;
  kinds: readonly TableFilterKind[];
}

export const FILTER_OPERATORS: readonly FilterOperatorInfo[] = [
  { value: 'equals', label: 'equals', kinds: ['number', 'text'] },
  { value: 'notEquals', label: 'is not', kinds: ['number', 'text'] },
  { value: 'greater', label: 'is greater than', kinds: ['number'] },
  { value: 'less', label: 'is lower than', kinds: ['number'] },
  { value: 'contains', label: 'contains', kinds: ['text'] },
  { value: 'notContains', label: "doesn't contain", kinds: ['text'] },
  { value: 'isEmpty', label: 'is empty', kinds: ['number', 'text'] },
  { value: 'isNotEmpty', label: 'is not empty', kinds: ['number', 'text'] }
];

export const operatorsFor = (kind: TableFilterKind): FilterOperatorInfo[] => FILTER_OPERATORS.filter(op => op.kinds.includes(kind));
export const operatorLabel = (operator: TableFilterOperator): string => FILTER_OPERATORS.find(op => op.value === operator)?.label ?? operator;

/** `isEmpty` and `isNotEmpty` have no value to compare to. */
export const needsValue = (operator: TableFilterOperator): boolean => operator !== 'isEmpty' && operator !== 'isNotEmpty';

/** `number` when every non-empty value of the column is a number (or a numeric string), otherwise `text`. */
export function columnKind(data: readonly unknown[], column: TableColumn): TableFilterKind {
  if (column.type === 'html' || column.type === 'tree' || column.type === 'text') return 'text';
  let numeric = false;
  for (const row of data) {
    const value = getValue(row, column.key);
    if (isEmpty(value)) continue;
    if (!isNumeric(value)) return 'text';
    numeric = true;
  }
  return numeric ? 'number' : 'text';
}

/** A condition that can be applied: it has a column, an operator and (when needed) a usable value. */
export function isCompleteFilter(filter: Partial<TableFilter>, kind: TableFilterKind | undefined): boolean {
  if (!filter.column || !filter.operator || !kind) return false;
  if (!operatorsFor(kind).some(op => op.value === filter.operator)) return false;
  if (!needsValue(filter.operator)) return true;
  const value = filter.value ?? '';
  return kind === 'number' ? isNumeric(value) : value.trim() !== '';
}

/** Text of a condition for a pill, e.g. `name contains "pe"`. */
export function describeFilter(filter: TableFilter, label: string): string {
  const value = needsValue(filter.operator) ? ` ${isNumeric(filter.value) ? filter.value.trim() : `"${filter.value}"`}` : '';
  return `${label} ${operatorLabel(filter.operator)}${value}`;
}

/** Checks one condition against a row. Numbers compare as numbers, text compares the shown text, ignoring case. */
export function matchesFilter(
  filter: TableFilter, row: unknown, column: TableColumn, kind: TableFilterKind, fallback?: TableCellRender
): boolean {
  const raw = getValue(row, column.key);
  const empty = isEmpty(raw) || (typeof raw === 'string' && raw.trim() === '');
  if (filter.operator === 'isEmpty') return empty;
  if (filter.operator === 'isNotEmpty') return !empty;

  if (kind === 'number') {
    if (!isNumeric(raw)) return filter.operator === 'notEquals';
    const x = Number(raw);
    const y = Number(filter.value);
    switch (filter.operator) {
      case 'equals': return x === y;
      case 'notEquals': return x !== y;
      case 'greater': return x > y;
      case 'less': return x < y;
      default: return false;
    }
  }

  const text = copyText(resolveCell(raw, row, column, fallback)).toLowerCase();
  const wanted = filter.value.trim().toLowerCase();
  switch (filter.operator) {
    case 'equals': return text.trim() === wanted;
    case 'notEquals': return text.trim() !== wanted;
    case 'contains': return text.includes(wanted);
    case 'notContains': return !text.includes(wanted);
    default: return false;
  }
}

/**
 * Checks a row against all conditions. Conditions joined by AND form a group, groups are joined by OR
 * (so `a AND b OR c` means `(a AND b) OR c`). Conditions that are not complete are ignored.
 */
export function matchesFilters(
  filters: readonly TableFilter[], row: unknown, columns: ReadonlyMap<string, { column: TableColumn; kind: TableFilterKind }>,
  fallback?: TableCellRender
): boolean {
  const groups: boolean[][] = [];
  for (const filter of filters) {
    const info = columns.get(filter.column);
    if (!info || !isCompleteFilter(filter, info.kind)) continue;
    const result = matchesFilter(filter, row, info.column, info.kind, fallback);
    if (!groups.length || filter.join === 'or') groups.push([result]);
    else groups[groups.length - 1].push(result);
  }
  return !groups.length || groups.some(group => group.every(Boolean));
}
