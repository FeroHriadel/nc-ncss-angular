import { Component, signal, WritableSignal } from '@angular/core';
import { Code } from '../../components/code/code';
import { CrudList, CrudListItem, Pill } from '../../ncss';

interface Task extends CrudListItem {
  done: boolean;
}

const seed = (): Task[] => [
  { text: 'Write the docs', done: true },
  { text: 'Review pull requests', done: false },
  { text: 'Ship it', done: false },
];

@Component({
  selector: 'app-crud-list-page',
  imports: [CrudList, Pill, Code],
  templateUrl: './crudlist.html',
  styleUrl: './crudlist.css'
})
export class CrudListPage {
  protected readonly basic = signal<Task[]>(seed());
  protected readonly clickable = signal<Task[]>(seed());
  protected readonly numbered = signal<Task[]>(seed());
  protected readonly empty = signal<Task[]>([]);
  protected readonly log = signal('Nothing happened yet.');

  private count = 0;

  protected add(list: WritableSignal<Task[]>): void {
    list.update(tasks => [...tasks, { text: `New task ${++this.count}`, done: false }]);
    this.log.set('Added a task');
  }

  protected remove(list: WritableSignal<Task[]>, task: Task): void {
    list.update(tasks => tasks.filter(t => t !== task));
    this.log.set(`Deleted "${task.text}"`);
  }

  protected edit(task: Task): void {
    this.log.set(`Edit "${task.text}" (open your own form or modal here)`);
  }

  protected open(task: Task): void {
    this.log.set(`Opened "${task.text}"`);
  }

  protected readonly inputs = [
    { name: 'items', values: 'T[]', default: 'required', note: 'The rows. Each one needs a text; add any other fields you like.' },
    { name: 'heading', values: 'string', default: "''", note: 'Title in the header bar.' },
    { name: 'emptyText', values: 'string', default: "'No items found'", note: 'Shown when there are no items.' },
    { name: 'striped', values: 'boolean', default: 'true', note: 'Colors every second row.' },
    { name: 'clickable', values: 'boolean', default: 'false', note: 'Makes the text a real button and turns on (open).' },
    { name: 'itemTemplate', values: 'TemplateRef', default: '', note: 'Your own content for every row instead of the text.' },
    { name: 'addButton / editButton / removeButton', values: 'boolean', default: 'true', note: 'Show or hide each button.' },
    { name: 'addLabel / editLabel / removeLabel', values: 'string', default: "'Add' / 'Edit' / 'Delete'", note: 'Accessible names of the buttons (translate them). The row text is added after, e.g. "Edit, Ship it".' },
    { name: '(add)', values: 'output', default: '', note: 'The plus button was pressed.' },
    { name: '(edit) / (remove)', values: 'output<T>', default: '', note: 'Emits the row. The list never changes your data: update it yourself.' },
    { name: '(open)', values: 'output<T>', default: '', note: 'Emits the row when its text is clicked (needs clickable).' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { CrudList, CrudListItem } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [CrudList],
  templateUrl: './my-page.html'
})
export class MyPage {
  tasks = signal<CrudListItem[]>([{ text: 'Write the docs' }, { text: 'Ship it' }]);

  add() { this.tasks.update(list => [...list, { text: 'New task' }]); }
  remove(task: CrudListItem) { this.tasks.update(list => list.filter(t => t !== task)); }
}`;

  protected readonly usageCode = `<nc-crud-list
  heading="Tasks"
  [items]="tasks()"
  (add)="add()"
  (edit)="edit($event)"
  (remove)="remove($event)" />`;

  protected readonly clickableCode = `<!-- clickable: the text becomes a button, and (open) tells you which row -->
<nc-crud-list heading="Tasks" [items]="tasks()" clickable (open)="show($event)" />`;

  protected readonly templateCode = `<!-- One template for every row. let-item is the row, let-i the index. -->
<nc-crud-list heading="Tasks" [items]="tasks()" [itemTemplate]="row" />

<ng-template #row let-item let-i="index">
  <strong>{{ i + 1 }}.</strong> {{ item.text }}
  @if (item.done) { <nc-pill size="small">Done</nc-pill> }
</ng-template>`;

  protected readonly typedCode = `// Your own fields come back in the events, fully typed
interface Task extends CrudListItem {
  done: boolean;
}

tasks = signal<Task[]>([{ text: 'Ship it', done: false }]);
remove(task: Task) { /* task.done works */ }`;

  protected readonly buttonsCode = `<!-- Read-only list: no buttons at all -->
<nc-crud-list heading="Team" [items]="people" [addButton]="false" [editButton]="false" [removeButton]="false" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --list-header-bg: var(--gray-200);
    --list-item-min-height: 4rem;
    --list-hover-bg: var(--red-50);
}`;

  protected readonly variablesList = `--list-header-bg / -header-text / -border-color
--list-stripe-bg / -hover-bg
--list-item-min-height / -padding-x / -gap / -focus-box-shadow`;
}
