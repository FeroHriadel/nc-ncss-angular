import { booleanAttribute, Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'nc-collapsible',
  templateUrl: './collapsible.html',
  host: { class: 'collapsible' }
})
export class Collapsible {
  /** Whether the content is shown. Supports two-way binding: `[(open)]`. */
  readonly open = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Shows the arrow that turns when it opens. */
  readonly chevron = input(true, { transform: booleanAttribute });

  private readonly uid = nextId++;
  protected readonly triggerId = `collapsible-trigger-${this.uid}`;
  protected readonly contentId = `collapsible-content-${this.uid}`;

  show(): void {
    if (!this.disabled()) this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }

  toggle(): void {
    if (this.open()) this.hide();
    else this.show();
  }
}
