import { Component, computed, effect, input, model, signal, untracked } from '@angular/core';
import { Button } from '../buttons/button';
import { TimesIcon } from '../icons/times.icon';
import { Modal } from '../popups/modal/modal';
import { Select, SelectOption } from '../select/select';
import { isCompleteFilter, needsValue, operatorsFor, TableFilter, TableFilterKind } from './table-utils';

/** A column the filter can use. */
export interface FilterColumn {
  value: string;
  label: string;
  /** `number` columns offer numeric operators, `text` columns offer text operators. */
  kind: TableFilterKind;
}

/** A condition being edited. Fields are empty until chosen. */
interface DraftRow {
  id: number;
  column: string;
  operator: string;
  value: string;
  join: 'and' | 'or';
}

let nextRowId = 0;
const emptyRow = (join: 'and' | 'or' = 'and'): DraftRow => ({ id: nextRowId++, column: '', operator: '', value: '', join });
const single = (value: string | string[]): string => (Array.isArray(value) ? value[0] ?? '' : value);

/**
 * The dialog where the user builds a filter: rows of "column, operator, value", joined by AND / OR.
 * `nc-table` uses it, but it works on its own: bind `[(open)]`, `[columns]` and `[(filters)]`.
 *
 * It edits a draft. Apply writes the complete rows to `filters`, closing the dialog (or Esc) throws the draft away.
 */
@Component({
  selector: 'nc-table-filter',
  imports: [Modal, Select, Button, TimesIcon],
  templateUrl: './table-filter.html',
  styleUrl: './table-filter.css',
  host: { class: 'table-filter' }
})
export class TableFilterDialog {
  /** Whether the dialog is open. Supports two-way binding: `[(open)]`. */
  readonly open = model(false);
  /** The applied filters. Supports two-way binding: `[(filters)]`. */
  readonly filters = model<TableFilter[]>([]);
  /** The columns the user can choose from. */
  readonly columns = input<FilterColumn[]>([]);

  // Texts, so they can be translated.
  readonly heading = input('Filter rows');
  readonly columnLabel = input('Column');
  readonly operatorLabel = input('Operator');
  readonly valueLabel = input('Value');
  readonly joinLabel = input('Combine with');
  readonly addLabel = input('AND / OR');
  readonly removeLabel = input('Remove condition');
  readonly clearLabel = input('Clear');
  readonly applyLabel = input('Apply');

  protected readonly draft = signal<DraftRow[]>([emptyRow()]);
  protected readonly columnOptions = computed<SelectOption[]>(() => this.columns().map(({ value, label }) => ({ value, label })));
  protected readonly joinOptions: SelectOption[] = [{ value: 'and', label: 'AND' }, { value: 'or', label: 'OR' }];

  /** The "AND / OR" control after the last row is shown once that row is complete. */
  protected readonly canAdd = computed(() => {
    const last = this.draft().at(-1);
    return !!last && this.isComplete(last);
  });

  constructor() {
    // Every time the dialog opens, start again from what is applied.
    effect(() => {
      if (!this.open()) return;
      untracked(() => {
        const applied = this.filters();
        this.draft.set(
          applied.length
            ? applied.map(filter => ({ id: nextRowId++, column: filter.column, operator: filter.operator, value: filter.value, join: filter.join ?? 'and' }))
            : [emptyRow()]
        );
      });
    });
  }

  protected kindOf(row: DraftRow): TableFilterKind | undefined {
    return this.columns().find(column => column.value === row.column)?.kind;
  }

  protected operatorOptions(row: DraftRow): SelectOption[] {
    const kind = this.kindOf(row);
    return kind ? operatorsFor(kind).map(({ value, label }) => ({ value, label })) : [];
  }

  protected showValue(row: DraftRow): boolean {
    return !row.operator || needsValue(row.operator as TableFilter['operator']);
  }

  protected isComplete(row: DraftRow): boolean {
    return isCompleteFilter(row as Partial<TableFilter>, this.kindOf(row));
  }

  // ---------- Editing ----------

  private patch(id: number, change: Partial<DraftRow>): void {
    this.draft.update(rows => rows.map(row => (row.id === id ? { ...row, ...change } : row)));
  }

  protected setColumn(row: DraftRow, value: string | string[]): void {
    const column = single(value);
    const kind = this.columns().find(item => item.value === column)?.kind;
    // Keep what was entered when the new column can be filtered the same way.
    const keep = kind !== undefined && kind === this.kindOf(row) && !!row.operator;
    this.patch(row.id, keep ? { column } : { column, operator: '', value: '' });
  }

  protected setOperator(row: DraftRow, value: string | string[]): void {
    const operator = single(value);
    this.patch(row.id, needsValue(operator as TableFilter['operator']) ? { operator } : { operator, value: '' });
  }

  protected setValue(row: DraftRow, value: string): void {
    this.patch(row.id, { value });
  }

  /** Changes how a row combines with the one before it. */
  protected setJoin(row: DraftRow, value: string | string[]): void {
    const join = single(value);
    if (join === 'and' || join === 'or') this.patch(row.id, { join });
  }

  /** Adds an empty row joined with AND or OR. */
  protected addRow(value: string | string[]): void {
    const join = single(value);
    if (join === 'and' || join === 'or') this.draft.update(rows => [...rows, emptyRow(join)]);
  }

  /** The first row is only cleared, the others are removed. */
  protected remove(index: number): void {
    this.draft.update(rows => {
      if (index === 0) return [{ ...emptyRow(), id: rows[0].id }, ...rows.slice(1)];
      return rows.filter((_, i) => i !== index);
    });
  }

  protected clear(): void {
    this.draft.set([emptyRow()]);
  }

  protected apply(): void {
    const complete = this.draft().filter(row => this.isComplete(row));
    this.filters.set(
      complete.map((row, index): TableFilter => ({
        column: row.column,
        operator: row.operator as TableFilter['operator'],
        value: needsValue(row.operator as TableFilter['operator']) ? row.value : '',
        ...(index > 0 ? { join: row.join } : {})
      }))
    );
    this.open.set(false);
  }
}
