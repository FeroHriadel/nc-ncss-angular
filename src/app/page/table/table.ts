import { Component, effect, signal, TemplateRef, viewChild } from '@angular/core';
import { Code } from '../../components/code/code';
import {
  applyColumnState, asHtml, asTemplate, asTree, Button, serializeColumns, Table, TableColumn, TableColumnInput, TableFilter, TableSort
} from '../../ncss';

const STORAGE_KEY = 'nc-table-demo';

const people = [
  { id: 1, ticket: '101', name: 'Ada Lovelace', age: 36, salary: 120000, role: 'Engineer', skills: ['math', 'poetry'], address: { city: 'London', geo: { lat: 51.5, lng: -0.12 } }, profile: '<b>Pioneer</b> of <i>computing</i>', score: 9.5 },
  { id: 2, ticket: '13', name: 'Linus Torvalds', age: 55, salary: 0, role: 'Engineer', skills: ['C', 'git'], address: { city: 'Portland', geo: { lat: 45.5, lng: -122.6 } }, profile: 'Made a <a href="https://kernel.org">kernel</a>', score: 8 },
  { id: 3, ticket: '2', name: 'Grace Hopper', age: 85, salary: 150000, role: 'Admiral', skills: [], address: { city: 'New York', geo: null }, profile: 'Found the first <b>bug</b>', score: NaN },
  { id: 4, ticket: '10', name: 'Alan Turing', age: 41, salary: null, role: 'Mathematician', skills: ['logic', 'crypto'], address: { city: 'Wilmslow', geo: { lat: 53.3, lng: -2.2 } }, profile: null, score: 10 },
  { id: 5, ticket: '1', name: 'Margaret Hamilton', age: 88, salary: 140000, role: 'Engineer', skills: ['software'], address: { city: 'Boston', geo: { lat: 42.4, lng: -71.1 } }, profile: 'Apollo <u>flight software</u>', score: 9 },
  { id: 6, ticket: 'n/a', name: 'Item 10', age: undefined, salary: 90000, role: 'Tester', skills: ['clicking'], address: {}, profile: '', score: 7.25 },
  { id: 7, ticket: '1000', name: 'Item 2', age: 29, salary: 95000, role: 'Designer', skills: ['pixels', 'fonts', 'colors'], address: { city: 'Berlin' }, profile: '<script>alert("not today")</script>Sanitized', score: 6 },
];

@Component({
  selector: 'app-table-page',
  imports: [Table, Button, Code],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class TablePage {
  protected readonly people = people.map(person => ({ ...person, extra: { active: person.id % 2 === 0, level: person.id } }));

  // ---------- Demo 1: nothing configured ----------
  protected readonly simple = people.slice(0, 4).map(({ id, name, role }) => ({ id, name, role }));

  // ---------- Demo: template cells ----------
  protected readonly actions = viewChild<TemplateRef<unknown>>('actions');
  protected readonly lastAction = signal('Nothing clicked yet');
  protected readonly templateColumns: TableColumnInput[] = [
    'id',
    'name',
    { key: 'actions', label: 'Actions', sortable: false, render: () => { const template = this.actions(); return template ? asTemplate(template, { source: 'demo' }) : ''; } },
  ];
  protected readonly templateRows = people.slice(0, 4).map(({ id, name }) => ({ id, name }));

  protected act(what: string, name: unknown): void {
    this.lastAction.set(what + ': ' + name);
  }

  // ---------- Demo: virtualized ----------
  /** 20 000 rows; every 7th has a tall cell, to show that virtualization copes with different row heights. */
  protected readonly huge = Array.from({ length: 20000 }, (_, i) => ({
    id: i + 1,
    name: 'Row ' + (i + 1),
    notes: i % 7 === 0 ? { lines: ['a', 'b', 'c'], index: i } : 'short'
  }));

  // ---------- Demo 2: fully configured ----------
  protected readonly defaultColumns: TableColumn[] = [
    { key: 'id', label: '#', width: 60, minWidth: 50 },
    { key: 'name', label: 'Full name', minWidth: 140 },
    { key: 'ticket', label: 'Ticket (text)' },
    { key: 'age' },
    { key: 'salary', render: value => (value === 0 || value === null ? 'Unknown' : value) },
    { key: 'skills' },
    { key: 'extra', label: 'Extra (JSON)' },
    { key: 'address', label: 'Address (tree)', type: 'tree', sortable: false },
    { key: 'profile', label: 'Profile (HTML)', render: value => (typeof value === 'string' && value ? asHtml(value) : value), sortable: false },
    { key: 'score', maxWidth: 140 },
  ];

  protected readonly columns = signal<TableColumnInput[]>(this.restoreColumns());
  protected readonly sort = signal<TableSort | null>(this.restoreSort());
  protected readonly hidden = signal<string[]>(this.restoreHidden());
  protected readonly filters = signal<TableFilter[]>(this.restoreFilters());
  protected readonly loading = signal(false);
  protected readonly striped = signal(true);

  protected readonly state = () => JSON.stringify({ columns: serializeColumns(this.columns()), hidden: this.hidden(), filters: this.filters(), sort: this.sort() }, null, 2);

  constructor() {
    // Everything the user changes in the table (sort, order, widths) ends up here, so saving it is one effect.
    effect(() => {
      const saved = { columns: serializeColumns(this.columns()), hidden: this.hidden(), filters: this.filters(), sort: this.sort() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        // Storage can be blocked, the demo still works.
      }
    });
  }

  /** The table already resets itself on reload. This is where you would fetch new data. */
  protected reload(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1000);
  }

  /** Changes the table from code: the same signals the UI writes to. */
  protected narrowName(): void {
    this.columns.update(columns => columns.map(column => (typeof column !== 'string' && column.key === 'name' ? { ...column, width: 140 } : column)));
  }

  protected hideScore(): void {
    this.columns.update(columns => columns.filter(column => (typeof column === 'string' ? column : column.key) !== 'score'));
  }

  private restoreColumns(): TableColumnInput[] {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved?.columns)) return applyColumnState(this.defaultColumns, saved.columns);
    } catch {
      // Ignore broken or blocked storage.
    }
    return this.defaultColumns;
  }

  private restoreHidden(): string[] {
    try {
      const hidden = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')?.hidden;
      return Array.isArray(hidden) ? hidden : [];
    } catch {
      return [];
    }
  }

  private restoreFilters(): TableFilter[] {
    try {
      const filters = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')?.filters;
      return Array.isArray(filters) ? filters : [];
    } catch {
      return [];
    }
  }

  private restoreSort(): TableSort | null {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')?.sort ?? null;
    } catch {
      return null;
    }
  }

  // ---------- Docs ----------

  protected readonly inputs = [
    { name: 'data', values: 'object[]', default: '[]', note: 'The rows: an array of objects.' },
    { name: '[(columns)]', values: '(string | TableColumn)[]', default: '[]', note: 'The columns to show, in order. Columns that are not listed are not shown even if the data has them. Empty: every key of the data is shown. Two-way: UI resizing and reordering is written back.' },
    { name: '[(hiddenColumns)]', values: 'string[]', default: '[]', note: 'Keys of hidden columns. They stay in columns so they can be shown again. Two-way: the show/hide list in the controls writes to it.' },
    { name: '[(filters)]', values: 'TableFilter[]', default: '[]', note: 'The applied filter conditions. Two-way: the filter dialog writes to it, and so does removing a pill. You can also set them from code.' },
    { name: '[(sort)]', values: '{ key, dir: "asc" | "desc" } | null', default: 'null', note: 'The current sort. Two-way: header clicks are written back.' },
    { name: 'controls', values: 'boolean', default: 'true', note: 'Shows the bar above the table (row count, reload, show/hide columns, filter).' },
    { name: 'loading', values: 'boolean', default: 'false', note: 'Shows "Loading..." instead of the row count.' },
    { name: '(reload)', values: 'output', default: '', note: 'Emits when the reload button is pressed, after the table went back to its first configuration. Fetch new data here.' },
    { name: 'striped', values: 'boolean', default: 'true', note: 'Every second row gets a slightly different background. Turn off with [striped]="false".' },
    { name: 'height', values: 'string | number', default: 'null', note: 'Maximum height ("300px", "50vh" or a number of px). Taller tables scroll and keep the header visible.' },
    { name: 'virtualized', values: 'boolean', default: 'false', note: 'Draws only the rows on screen, so huge tables stay fast. Rows may have different heights. Without a height the table is 500px tall.' },
    { name: 'resizable', values: 'boolean', default: 'true', note: 'Column edges can be dragged.' },
    { name: 'reorderable', values: 'boolean', default: 'true', note: 'Headers can be dragged to another place.' },
    { name: 'cellModifier', values: '(value, row, key) => any', default: '', note: 'Changes what cells show. A column\'s own render function wins over it.' },
    { name: 'trustHtml', values: 'boolean', default: 'false', note: 'Show HTML cells without Angular\'s sanitizer. Only for HTML you wrote yourself.' },
    { name: 'emptyText', values: 'string', default: "'No data'", note: 'Shown when there are no rows.' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'Accessible name of the table.' },
    { name: 'resizeLabel', values: 'string', default: "'Resize column'", note: 'Accessible name of the resize handles (translate it).' },
    { name: 'copiedLabel', values: 'string', default: "'Copied'", note: 'Message shown in a cell after double-click copy (translate it).' },
  ];

  protected readonly columnFields = [
    { name: 'key', values: 'string', default: 'required', note: "Property of the row objects. 'address.city' reaches into nested objects. Must be unique in the table." },
    { name: 'label', values: 'string', default: 'key', note: 'Header text. This is how you rename a column.' },
    { name: 'width', values: 'number (px)', default: 'flexible', note: 'Fixed width. Without it the column shares the free space.' },
    { name: 'minWidth', values: 'number (px)', default: '80', note: 'The column cannot get narrower, not even by dragging.' },
    { name: 'maxWidth', values: 'number (px)', default: '', note: 'The column cannot get wider.' },
    { name: 'type', values: "'auto' | 'text' | 'number' | 'html' | 'tree'", default: "'auto'", note: 'How values are shown. See "Data types" below.' },
    { name: 'sortable', values: 'boolean', default: 'true', note: 'false removes the sort button.' },
    { name: 'align', values: "'start' | 'end' | 'center'", default: 'auto', note: 'Columns that only hold numbers are right-aligned by default.' },
    { name: 'render', values: '(value, row, key) => any', default: '', note: 'Changes the cell. Return a value, asHtml(...), asTree(...) or asTemplate(...).' },
  ];

  protected readonly types = [
    { name: 'template', shows: 'render returning asTemplate(templateRef): your own <ng-template>, with working (click) handlers, components and pipes. Double-click does not copy.' },
    { name: 'string', shows: 'As is. A string that holds a number ("101") is still text, but sorts as a number and right-aligns when the whole column is numeric.' },
    { name: 'number', shows: 'As is (no thousands separators, so ids and years stay as they are), right-aligned. Use render for formatting.' },
    { name: 'null / undefined / NaN', shows: 'The words null, undefined, NaN. They always sort last.' },
    { name: 'boolean', shows: 'true / false.' },
    { name: 'array', shows: 'Joined with commas: "math, poetry". Arrays that hold objects show as JSON.' },
    { name: 'object', shows: 'JSON.stringify(obj, null, 2) in a monospace cell. Use type: "tree" for a nicer view.' },
    { name: 'HTML', shows: 'type: "html" (strings) or render returning asHtml(...). Sanitized by default. Double-click copies the text of the HTML.' },
    { name: 'tree', shows: 'type: "tree" or render returning asTree(object): a button that opens an <nc-tree> panel.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Table } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Table],
  templateUrl: './my-page.html'
})
export class MyPage {
  rows = [
    { name: 'Ada', age: 36 },
    { name: 'Linus', age: 55 },
  ];
}`;

  protected readonly simpleCode = `<!-- Without columns, every key of the data is shown -->
<nc-table [data]="rows" />`;

  protected readonly columnsCode = `import { TableColumn } from '../../ncss';

cols: TableColumn[] = [
  { key: 'name', label: 'Full name', width: 200, minWidth: 100 },   // renamed + sized
  { key: 'age' },                                                   // as is
  { key: 'salary', render: v => (v === 0 ? 'Unknown' : v) },        // change the content
];
// Keys of the data that are not in cols (e.g. 'id') are not shown.

// Shortcut when you only need keys and their order:
cols = ['name', 'age'];`;

  protected readonly twoWayCode = `<nc-table [data]="rows" [(columns)]="cols" [(hiddenColumns)]="hidden" [(sort)]="sort" height="400px" [striped]="false" />

<!-- Change them from code with the same signals the UI writes to -->
<button nc-button (click)="cols.update(c => c.filter(x => x.key !== 'age'))">Hide age</button>`;

  protected readonly saveCode = `import { applyColumnState, serializeColumns, TableColumn, TableSort } from '../../ncss';

cols = signal<TableColumn[]>(this.restore());
sort = signal<TableSort | null>(null);

constructor() {
  // Runs every time the user sorts, resizes or reorders.
  effect(() => {
    localStorage.setItem('my-table', JSON.stringify({
      columns: serializeColumns(this.cols()),   // only { key, width } - no functions
      hidden: this.hidden(),   // keys of hidden columns
      sort: this.sort(),
    }));
  });
}

restore() {
  const saved = JSON.parse(localStorage.getItem('my-table') ?? 'null');
  // Puts the saved order and widths back on your definitions, which keep their render functions.
  return saved ? applyColumnState(this.defaultCols, saved.columns) : this.defaultCols;
}`;

  protected readonly filterOperators = [
    { name: 'equals / is not', kinds: 'numbers and text', note: 'Numbers compare as numbers ("35" equals 35). Text ignores case.' },
    { name: 'is greater than / is lower than', kinds: 'numbers', note: 'Only offered for columns where every value is a number (or a string holding one).' },
    { name: "contains / doesn't contain", kinds: 'text', note: 'Ignores case.' },
    { name: 'is empty / is not empty', kinds: 'numbers and text', note: 'null, undefined, NaN and empty strings count as empty. These have no value to type.' },
  ];

  protected readonly filterCode = `import { TableFilter } from '../../ncss';

// Conditions are plain data, so they can be saved like the columns and the sort.
filters = signal<TableFilter[]>([
  { column: 'name', operator: 'contains', value: 'pe' },
  { column: 'age', operator: 'greater', value: '18', join: 'and' },   // join: how it combines with the one before
  { column: 'role', operator: 'equals', value: 'Tester', join: 'or' },
]);
// means: (name contains "pe" AND age > 18) OR role equals "Tester"

<nc-table [data]="rows" [(columns)]="cols" [(filters)]="filters" />`;

  protected readonly renderCode = `import { asHtml, asTree } from '../../ncss';

cols = [
  // Plain values: shown like any data
  { key: 'salary', render: v => (v === 0 ? 'Unknown' : v) },

  // HTML: sanitized by Angular (scripts and event handlers are removed)
  { key: 'link', render: v => asHtml('<a href="' + v + '">open</a>') },

  // An expandable tree for objects
  { key: 'address', render: v => (typeof v === 'object' && v ? asTree(v) : v) },
  { key: 'meta', type: 'tree' },           // same thing, shorter
];

// One function for every column that has no render of its own:
<nc-table [data]="rows" [cellModifier]="fn" />
fn = (value, row, key) => (value === null ? '-' : value);`;

  protected readonly templateCode = `import { Component, TemplateRef, viewChild } from '@angular/core';
import { asTemplate, Table } from '../../ncss';

@Component({ imports: [Table], templateUrl: './my-page.html' })
export class MyPage {
  actions = viewChild<TemplateRef<unknown>>('actions');

  cols = [
    'name',
    { key: 'actions', sortable: false, render: () => (this.actions() ? asTemplate(this.actions()!) : '') },
  ];

  remove(row: Person) { /* ... */ }
}

<!-- my-page.html -->
<nc-table [data]="people" [columns]="cols" />

<ng-template #actions let-value let-row="row" let-key="key">
  <button (click)="remove(row)">Remove {{ row.name }}</button>
</ng-template>`;

  protected readonly treeCode = `<!-- Also usable on its own -->
<nc-tree [value]="{ name: 'Ada', tags: ['a', 'b'], address: { city: 'London' } }" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --table-header-bg: var(--red-100);
    --table-font-size: 16px;
    --table-padding-y: 0.75rem;
}

/* ...or only for one table */
.my-table {
    --table-stripe-bg: transparent;
}`;

  protected readonly variablesList = `--table-bg / -text / -border-color / -radius / -shadow
--table-header-bg / -header-text
--table-stripe-bg / -hover-bg
--table-controls-gap (space between the controls and the table)
--table-accent (sort arrows, resize handle, drop marker)
--table-font-size / -padding-x / -padding-y / -focus-box-shadow
--tree-bg / -border / -shadow / -backdrop / -trigger-bg / -trigger-hover-bg / -line-color`;
}
