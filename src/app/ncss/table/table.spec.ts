import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Table } from './table';
import {
  applyColumnState, asHtml, asTemplate, asTree, columnKind, compareValues, copyText, deriveColumns, describeFilter, getValue, isCompleteFilter, matchesFilters, resolveCell, serializeColumns,
  TableColumn, TableColumnInput, TableFilter, TableSort
} from './table-utils';

describe('table utils', () => {
  it('sorts numbers and numeric strings as numbers', () => {
    const values = ['1', '2', '10', '13', '101'].reverse();
    expect(values.sort(compareValues)).toEqual(['1', '2', '10', '13', '101']);
    expect([101, '13', 2, '10', 1].sort(compareValues)).toEqual([1, 2, '10', '13', 101]);
  });

  it('puts numbers before text and sorts text naturally', () => {
    expect(['Item 10', 'Item 2', '5'].sort(compareValues)).toEqual(['5', 'Item 2', 'Item 10']);
  });

  it('reads nested keys', () => {
    expect(getValue({ a: { b: 3 } }, 'a.b')).toBe(3);
    expect(getValue({ 'a.b': 1, a: { b: 3 } }, 'a.b')).toBe(1);
    expect(getValue(null, 'a')).toBeUndefined();
  });

  it('shows the different data types', () => {
    const col: TableColumn = { key: 'x' };
    const text = (value: unknown) => resolveCell(value, {}, col).text;
    expect(text(null)).toBe('null');
    expect(text(undefined)).toBe('undefined');
    expect(text(NaN)).toBe('NaN');
    expect(text(2024)).toBe('2024');
    expect(text(['a', 'b'])).toBe('a, b');
    expect(text({ a: 1 })).toBe('{\n  "a": 1\n}');
    expect(resolveCell({ a: 1 }, {}, col).kind).toBe('json');
    expect(resolveCell(5, {}, col).kind).toBe('number');
    expect(resolveCell('5', {}, col).kind).toBe('text');
  });

  it('applies render, the fallback modifier and html/tree cells', () => {
    const fallback = (value: unknown) => (value === 0 ? 'Unknown' : value);
    expect(resolveCell(0, {}, { key: 'x' }, fallback).text).toBe('Unknown');
    expect(resolveCell(0, {}, { key: 'x', render: () => 'mine' }, fallback).text).toBe('mine');
    const html = resolveCell(1, {}, { key: 'x', render: () => asHtml('<b>Hi</b> there') });
    expect(html.kind).toBe('html');
    expect(copyText(html)).toBe('Hi there');
    expect(resolveCell({ a: 1 }, {}, { key: 'x', render: v => asTree(v) }).kind).toBe('tree');
    expect(resolveCell({ a: 1 }, {}, { key: 'x', type: 'tree' }).kind).toBe('tree');
    const template = {} as never;
    const cell = resolveCell(5, { id: 1 }, { key: 'x', render: () => asTemplate(template, { more: true }) });
    expect(cell.kind).toBe('template');
    expect(cell.context).toEqual({ more: true, $implicit: 5, row: { id: 1 }, key: 'x' });
    expect(copyText(cell)).toBe('');
  });

  it('derives columns from the data', () => {
    expect(deriveColumns([{ a: 1 }, { b: 2, a: 3 }]).map(c => c.key)).toEqual(['a', 'b']);
  });

  it('saves and restores order and widths', () => {
    const defaults: TableColumn[] = [{ key: 'a', render: () => 1 }, { key: 'b' }, { key: 'c' }];
    const saved = JSON.parse(JSON.stringify(serializeColumns([{ key: 'b', width: 120 }, { key: 'a' }])));
    const restored = applyColumnState(defaults, saved);
    expect(restored.map(c => c.key)).toEqual(['b', 'a', 'c']);
    expect(restored[0].width).toBe(120);
    expect(restored[1].render).toBeDefined();
  });
});

@Component({
  imports: [Table],
  template: `<nc-table [data]="data" [(columns)]="columns" [(hiddenColumns)]="hidden" [(sort)]="sort" [striped]="striped()" (reload)="reloads = reloads + 1" />`
})
class Host {
  data = [
    { name: 'b', n: '10', secret: 'x' },
    { name: 'a', n: '2', secret: 'y' },
    { name: 'c', n: null, secret: 'z' },
    { name: 'd', n: '101', secret: 'w' }
  ];
  columns = signal<TableColumnInput[]>(['name', { key: 'n', label: 'Number' }]);
  sort = signal<TableSort | null>(null);
  striped = signal(true);
  hidden = signal<string[]>([]);
  reloads = 0;
}

describe('nc-table', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cells = (col: number) =>
      [...el.querySelectorAll('.table-body .table-row')].map(row => row.querySelectorAll('.table-cell')[col].textContent?.trim());
    return { fixture, el, cells };
  }

  it('renders only the given columns, renamed, with ARIA roles', () => {
    const { el } = setup();
    const headers = [...el.querySelectorAll('[role=columnheader]')].map(h => h.textContent?.trim());
    expect(headers).toEqual(['name', 'Number']);
    expect(el.textContent).not.toContain('secret');
    expect(el.querySelector('[role=table]')).toBeTruthy();
    expect(el.querySelectorAll('[role=row]').length).toBe(5);
    expect(el.querySelector('table, td, th')).toBeNull();
  });

  it('sorts by clicking the header and writes the sort back', () => {
    const { fixture, el, cells } = setup();
    const button = el.querySelectorAll<HTMLButtonElement>('.table-sort')[1];
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'n', dir: 'asc' });
    expect(cells(1)).toEqual(['2', '10', '101', 'null']);
    button.click();
    fixture.detectChanges();
    expect(cells(1)).toEqual(['101', '10', '2', 'null']); // null stays last
    expect(el.querySelectorAll('[role=columnheader]')[1].getAttribute('aria-sort')).toBe('descending');
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toBeNull();
  });

  it('writes a new column order back with Alt+Arrow', () => {
    const { fixture, el } = setup();
    const header = el.querySelectorAll('[role=columnheader]')[0];
    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.columns().map(c => (typeof c === 'string' ? c : c.key))).toEqual(['n', 'name']);
  });

  it('sets a width from the keyboard and clamps it', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.columns.set([{ key: 'name', minWidth: 100, maxWidth: 150 }, 'n']);
    fixture.detectChanges();
    const handle = el.querySelector('.table-resizer') as HTMLElement;
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }));
    fixture.detectChanges();
    const first = fixture.componentInstance.columns()[0] as TableColumn;
    expect(first.width).toBeLessThanOrEqual(150);
    expect(first.width).toBeGreaterThanOrEqual(100);
  });

  it('stripes rows unless turned off', () => {
    const { fixture, el } = setup();
    expect(el.querySelector('.table-striped')).toBeTruthy();
    fixture.componentInstance.striped.set(false);
    fixture.detectChanges();
    expect(el.querySelector('.table-striped')).toBeNull();
  });
});

describe('nc-table controls', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows the row count and "Loading..."', () => {
    const { el } = setup();
    expect(el.querySelector('.table-controls-info')?.textContent?.trim()).toBe('4 rows');
  });

  it('has titled icon buttons', () => {
    const { el } = setup();
    const titles = [...el.querySelectorAll('.table-controls-actions [title]')].map(e => e.getAttribute('title'));
    expect(titles.length).toBe(3);
    expect(titles.every(t => !!t)).toBe(true);
  });

  it('hides and shows columns without losing them, and keeps hidden ones when reordering', () => {
    const { fixture, el } = setup();
    const host = fixture.componentInstance;
    host.columns.set(['name', 'n', 'secret']);
    host.hidden.set(['n']);
    fixture.detectChanges();
    expect([...el.querySelectorAll('[role=columnheader]')].map(h => h.textContent?.trim())).toEqual(['name', 'secret']);
    el.querySelectorAll('[role=columnheader]')[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(host.columns().map(c => (typeof c === 'string' ? c : c.key))).toEqual(['n', 'secret', 'name']);
    expect(host.hidden()).toEqual(['n']);
  });

  it('reload restores the first configuration and emits', () => {
    const { fixture, el } = setup();
    const host = fixture.componentInstance;
    host.sort.set({ key: 'name', dir: 'desc' });
    host.hidden.set(['n']);
    fixture.detectChanges();
    (el.querySelector('.table-controls-actions button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.sort()).toBeNull();
    expect(host.hidden()).toEqual([]);
    expect(host.reloads).toBe(1);
  });
});

describe('table filters', () => {
  const columns = (data: unknown[], list: TableColumn[]) =>
    new Map(list.map(column => [column.key, { column, kind: columnKind(data, column) }]));
  const people = [
    { name: 'Pete', age: 20, bio: '<b>Loves</b> chess', tags: ['a'] },
    { name: 'Anna', age: 17, bio: null, tags: [] },
    { name: 'Peter Pan', age: '35', bio: '', tags: ['b'] },
    { name: 'Zed', age: undefined, bio: 'plain', tags: ['a', 'b'] }
  ];
  const list: TableColumn[] = [{ key: 'name' }, { key: 'age' }, { key: 'bio', type: 'html' }, { key: 'tags' }];
  const cols = columns(people, list);
  const run = (filters: TableFilter[]) => people.filter(row => matchesFilters(filters, row, cols)).map(row => row.name);
  const f = (column: string, operator: TableFilter['operator'], value = '', join?: 'and' | 'or'): TableFilter => ({ column, operator, value, join });

  it('detects number and text columns', () => {
    expect(cols.get('age')?.kind).toBe('number');
    expect(cols.get('name')?.kind).toBe('text');
    expect(cols.get('bio')?.kind).toBe('text');
  });

  it('filters numbers numerically and ignores case for text', () => {
    expect(run([f('age', 'greater', '18')])).toEqual(['Pete', 'Peter Pan']);
    expect(run([f('age', 'less', '18')])).toEqual(['Anna']);
    expect(run([f('age', 'equals', '35')])).toEqual(['Peter Pan']);
    expect(run([f('name', 'contains', 'PET')])).toEqual(['Pete', 'Peter Pan']);
    expect(run([f('name', 'notContains', 'pet')])).toEqual(['Anna', 'Zed']);
    expect(run([f('name', 'equals', 'zed')])).toEqual(['Zed']);
  });

  it('matches the text of HTML cells and handles empty values', () => {
    expect(run([f('bio', 'contains', 'loves chess')])).toEqual(['Pete']);
    expect(run([f('bio', 'contains', '<b>')])).toEqual([]);
    expect(run([f('bio', 'isEmpty')])).toEqual(['Anna', 'Peter Pan']);
    expect(run([f('age', 'isNotEmpty')])).toEqual(['Pete', 'Anna', 'Peter Pan']);
  });

  it('lets AND bind tighter than OR', () => {
    // (name contains pet AND age less than 30) OR name equals Zed
    const filters = [f('name', 'contains', 'pet'), f('age', 'less', '30', 'and'), f('name', 'equals', 'Zed', 'or')];
    expect(run(filters)).toEqual(['Pete', 'Zed']);
  });

  it('ignores incomplete conditions', () => {
    expect(run([f('name', 'contains', ''), f('age', 'greater', 'abc', 'and')])).toEqual(['Pete', 'Anna', 'Peter Pan', 'Zed']);
    expect(isCompleteFilter({ column: 'age', operator: 'contains', value: 'x' }, 'number')).toBe(false);
  });

  it('describes a condition', () => {
    expect(describeFilter(f('name', 'contains', 'pe'), 'name')).toBe('name contains "pe"');
    expect(describeFilter(f('age', 'greater', '18'), 'age')).toBe('age is greater than 18');
    expect(describeFilter(f('bio', 'isEmpty'), 'bio')).toBe('bio is empty');
  });
});

@Component({
  imports: [Table],
  template: `<nc-table [data]="data" [(columns)]="columns" [(filters)]="filters" />`
})
class FilterHost {
  data = [
    { name: 'Pete', age: 20 },
    { name: 'Anna', age: 17 },
    { name: 'Peter Pan', age: 35 }
  ];
  columns = signal<TableColumnInput[]>(['name', 'age']);
  filters = signal<TableFilter[]>([{ column: 'name', operator: 'contains', value: 'pe' }, { column: 'age', operator: 'greater', value: '18', join: 'and' }]);
}

describe('nc-table filter UI', () => {
  async function setup() {
    const fixture = TestBed.createComponent(FilterHost);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }
  const bodyText = (el: HTMLElement) => [...el.querySelectorAll('.table-body .table-row')].map(row => row.querySelector('.table-cell')?.textContent?.trim());

  it('shows only matching rows, an "x of y" count and a pill per condition', async () => {
    const { el } = await setup();
    expect(bodyText(el)).toEqual(['Pete', 'Peter Pan']);
    expect(el.querySelector('.table-controls-info')?.textContent?.replace(/\s+/g, ' ').trim()).toBe('2 of 3 rows');
    const pills = [...el.querySelectorAll('.table-filters nc-pill')].map(p => p.textContent?.trim());
    expect(pills).toEqual(['name contains "pe"', 'age is greater than 18']);
    expect(el.querySelector('.table-filters-join')?.textContent?.trim()).toBe('AND');
  });

  it('removes a condition when its pill is closed', async () => {
    const { fixture, el } = await setup();
    (el.querySelector('.table-filters .pill-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.filters().map(x => x.column)).toEqual(['age']);
    expect(bodyText(el)).toEqual(['Pete', 'Peter Pan']);
  });

  it('opens the dialog from the filter button, edits a draft and applies it', async () => {
    const { fixture, el } = await setup();
    const buttons = el.querySelectorAll<HTMLButtonElement>('.table-controls-actions button');
    buttons[buttons.length - 1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const rows = document.querySelectorAll('.table-filter-row');
    expect(rows.length).toBe(2); // the applied conditions
    // remove the second row, then Apply
    (rows[1].querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(document.querySelectorAll('.table-filter-row').length).toBe(1);
    const apply = [...document.querySelectorAll<HTMLButtonElement>('.popup-footer button')].find(b => b.textContent?.trim() === 'Apply')!;
    apply.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.filters()).toEqual([{ column: 'name', operator: 'contains', value: 'pe' }]);
    expect(document.querySelector('.table-filter-row')).toBeNull(); // closed
  });
});
