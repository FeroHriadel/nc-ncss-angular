import { Component, signal, WritableSignal } from '@angular/core';
import { Code } from '../../components/code/code';
import { CardList, CardListItem, Pill } from '../../ncss';

interface Project extends CardListItem {
  status: 'Live' | 'Draft';
}

const seed = (): Project[] => [
  { title: 'Website redesign', text: 'New landing page and docs.', status: 'Live' },
  { title: 'Mobile app', text: 'Early prototype, not yet shared.', status: 'Draft' },
  { title: 'Billing', text: 'Invoices and payment reminders.', status: 'Live' },
];

@Component({
  selector: 'app-card-list-page',
  imports: [CardList, Pill, Code],
  templateUrl: './cardlist.html',
  styleUrl: './cardlist.css'
})
export class CardListPage {
  protected readonly basic = signal<Project[]>(seed());
  protected readonly clickable = signal<Project[]>(seed());
  protected readonly withStatus = signal<Project[]>(seed());
  protected readonly empty = signal<Project[]>([]);
  protected readonly log = signal('Nothing happened yet.');

  private count = 0;

  protected add(list: WritableSignal<Project[]>): void {
    list.update(projects => [...projects, { title: `New project ${++this.count}`, text: 'Just added.', status: 'Draft' }]);
    this.log.set('Added a project');
  }

  protected remove(list: WritableSignal<Project[]>, project: Project): void {
    list.update(projects => projects.filter(p => p !== project));
    this.log.set(`Deleted "${project.title}"`);
  }

  protected edit(project: Project): void {
    this.log.set(`Edit "${project.title}" (open your own form or modal here)`);
  }

  protected open(project: Project): void {
    this.log.set(`Opened "${project.title}"`);
  }

  protected readonly inputs = [
    { name: 'items', values: 'T[]', default: 'required', note: 'The cards. Each can have a title and a text; add any other fields you like.' },
    { name: 'heading', values: 'string', default: "''", note: 'Title above the cards.' },
    { name: 'emptyText', values: 'string', default: "'No items found'", note: 'Shown when there are no items.' },
    { name: 'striped', values: 'boolean', default: 'false', note: 'Colors every second card.' },
    { name: 'clickable', values: 'boolean', default: 'false', note: 'Makes the card content a real button and turns on (open).' },
    { name: 'itemTemplate', values: 'TemplateRef', default: '', note: 'Your own content for every card instead of the title and text.' },
    { name: 'addButton / editButton / removeButton', values: 'boolean', default: 'true', note: 'Show or hide each button.' },
    { name: 'addLabel / editLabel / removeLabel', values: 'string', default: "'Add' / 'Edit' / 'Delete'", note: 'Accessible names of the buttons (translate them). The card title is added after, e.g. "Edit, Billing".' },
    { name: '(add)', values: 'output', default: '', note: 'The plus button was pressed.' },
    { name: '(edit) / (remove)', values: 'output<T>', default: '', note: 'Emits the card. The list never changes your data: update it yourself.' },
    { name: '(open)', values: 'output<T>', default: '', note: 'Emits the card when its content is clicked (needs clickable).' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { CardList, CardListItem } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [CardList],
  templateUrl: './my-page.html'
})
export class MyPage {
  projects = signal<CardListItem[]>([
    { title: 'Website', text: 'New landing page.' },
    { title: 'Mobile app', text: 'Early prototype.' },
  ]);

  add() { this.projects.update(list => [...list, { title: 'New project' }]); }
  remove(project: CardListItem) { this.projects.update(list => list.filter(p => p !== project)); }
}`;

  protected readonly usageCode = `<nc-card-list
  heading="Projects"
  [items]="projects()"
  (add)="add()"
  (edit)="edit($event)"
  (remove)="remove($event)" />`;

  protected readonly clickableCode = `<!-- clickable: the card content becomes a button, and (open) tells you which card -->
<nc-card-list heading="Projects" [items]="projects()" clickable (open)="show($event)" />`;

  protected readonly templateCode = `<!-- One template for every card. let-item is the card, let-i the index. -->
<nc-card-list heading="Projects" [items]="projects()" [itemTemplate]="card" />

<ng-template #card let-item>
  <span>{{ item.title }} <nc-pill size="small">{{ item.status }}</nc-pill></span>
  <small>{{ item.text }}</small>
</ng-template>`;

  protected readonly typedCode = `// Your own fields come back in the events, fully typed
interface Project extends CardListItem {
  status: 'Live' | 'Draft';
}

projects = signal<Project[]>([{ title: 'Billing', status: 'Live' }]);
remove(project: Project) { /* project.status works */ }`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --list-gap: 1rem;
    --list-item-min-height: 5rem;
    --list-hover-bg: var(--red-50);
}`;

  protected readonly variablesList = `--list-stripe-bg / -hover-bg / -border-color
--list-item-min-height / -padding-x / -gap / -focus-box-shadow`;
}
