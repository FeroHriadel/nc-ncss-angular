import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, DialogCloseReason, Modal } from '../../ncss';

@Component({
  selector: 'app-modal-page',
  imports: [Modal, Button, Code],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalPage {
  protected readonly modalOpen = signal(false);
  protected readonly confirmOpen = signal(false);
  protected readonly longOpen = signal(false);
  protected readonly lines = Array.from({ length: 30 }, (_, i) => i + 1);
  protected readonly log = signal('Nothing happened yet.');

  protected onClosed(name: string, reason: DialogCloseReason): void {
    this.log.set(`${name} closed (${reason})`);
  }

  protected deleteItem(): void {
    this.log.set('Item deleted');
  }

  protected readonly dialogInputs = [
    { name: 'open', values: 'boolean', default: 'false', note: 'Whether it is shown. Two-way: [(open)].' },
    { name: 'heading', values: 'string', default: "''", note: 'Visible title. It names the dialog for screen readers.' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'Name to use when there is no visible heading.' },
    { name: 'ariaDescribedby', values: 'string', default: "''", note: 'Id(s) of elements that describe it.' },
    { name: 'role', values: "'dialog' | 'alertdialog'", default: "'dialog'", note: 'Use alertdialog for urgent messages that need an answer, such as deleting something.' },
    { name: 'closeButton', values: 'boolean', default: 'true', note: 'Shows the X button.' },
    { name: 'closeLabel', values: 'string', default: "'Close'", note: 'Accessible name of the X button (translate it).' },
    { name: 'closeOnBackdrop / closeOnEscape', values: 'boolean', default: 'true', note: 'Close when the backdrop is clicked or Escape is pressed.' },
    { name: 'dialogClass / dialogStyle', values: 'string / object', default: "''", note: 'Class and style for the panel itself.' },
    { name: '(closed)', values: 'DialogCloseReason', default: '', note: "Emits what closed it: 'close', 'confirm', 'escape', 'backdrop' or 'api'." },
  ];

  protected readonly modalInputs = [
    { name: 'actionButtons', values: 'boolean', default: 'true', note: 'Shows the built-in Close and Ok buttons.' },
    { name: 'confirmLabel / cancelLabel', values: 'string', default: "'Ok' / 'Close'", note: 'Text of the built-in buttons.' },
    { name: 'width / height', values: 'string', default: "''", note: 'Any CSS length. The default width is --modal-width.' },
    { name: '(confirmed)', values: 'output', default: '', note: 'Emits when Ok is pressed. The modal then closes.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Button, Modal } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Modal, Button],
  templateUrl: './my-page.html'
})
export class MyPage {
  open = signal(false);
}`;

  protected readonly modalCode = `<button nc-button (click)="open.set(true)">Open</button>

<nc-modal [(open)]="open" heading="Edit profile" (confirmed)="save()" (closed)="onClosed($event)">
  <p>Anything goes in here.</p>
  <input aria-label="Name" data-autofocus />   <!-- this gets the focus when it opens -->
</nc-modal>

<!-- Without the built-in buttons: your own footer -->
<nc-modal [(open)]="open" heading="Share" [actionButtons]="false">
  Content
  <button nc-button slot="footer" (click)="open.set(false)">Done</button>
</nc-modal>`;

  protected readonly alertCode = `<!-- Urgent questions: role="alertdialog". The body is read out automatically. -->
<nc-modal [(open)]="confirm" role="alertdialog" heading="Delete this item?" confirmLabel="Delete" cancelLabel="Cancel" (confirmed)="delete()">
  This cannot be undone.
</nc-modal>`;

  protected readonly apiCode = `<!-- Or drive it from code -->
<nc-modal #modal heading="Hello">...</nc-modal>
<button nc-button (click)="modal.show()">Open</button>
<!-- modal.hide(), modal.toggle() -->`;

  protected readonly classStyleCode = `<!-- The modal panel (which lives elsewhere in the page) has its own class and style inputs: -->
<nc-modal [(open)]="open" dialogClass="my-modal" [dialogStyle]="{ width: '50rem' }">...</nc-modal>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --modal-width: 40rem;
    --popup-padding: 2rem;
    --popup-overlay-bg: oklch(0% 0 0 / 0.6);
}`;

  protected readonly variablesList = `--popup-bg / -border / -shadow / -backdrop / -padding / -z-index
--popup-overlay-bg / -overlay-blur
--modal-width`;
}
