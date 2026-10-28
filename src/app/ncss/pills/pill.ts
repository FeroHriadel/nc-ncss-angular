import { booleanAttribute, Component, computed, input, output } from '@angular/core';

export type PillVariant = 'default' | 'dark' | 'red' | 'outline';
export type PillSize = 'small' | 'medium' | 'large';

let nextId = 0;

@Component({
  selector: 'nc-pill',
  templateUrl: './pill.html',
  styleUrl: './pill.css',
  host: { '[class]': 'classes()' }
})
export class Pill {
  readonly variant = input<PillVariant>('default');
  readonly size = input<PillSize>('medium');
  /** Shows a remove button. The pill does not remove itself: handle `(closed)` and update your data. */
  readonly closable = input(false, { transform: booleanAttribute });
  /** Accessible name of the remove button. The pill's text is added after it, e.g. "Remove, Angular". Translate it for other languages. */
  readonly closeLabel = input('Remove');
  readonly closed = output<void>();

  protected readonly textId = `pill-text-${nextId}`;
  protected readonly closeId = `pill-close-${nextId++}`;

  protected readonly classes = computed(() =>
    `pill pill-${this.variant()} pill-${this.size()}${this.closable() ? ' pill-closable' : ''}`
  );
}
