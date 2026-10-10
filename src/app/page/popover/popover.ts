import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, Popover } from '../../ncss';

@Component({
  selector: 'app-popover-page',
  imports: [Popover, Button, Code],
  templateUrl: './popover.html',
  styleUrl: './popover.css'
})
export class PopoverPage {
  protected readonly popoverOpen = signal(false);

  protected readonly popoverInputs = [
    { name: 'open', values: 'boolean', default: 'false', note: 'Whether it is shown. Two-way: [(open)].' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'When set, the panel is announced as a dialog with this name.' },
    { name: 'align', values: "'start' | 'end'", default: "'start'", note: 'Which edge of the trigger the panel lines up with.' },
    { name: 'direction', values: "'up' | 'down'", default: 'auto', note: 'Skip auto positioning and always open this way.' },
    { name: 'disabled', values: 'boolean', default: 'false', note: 'Stops it from opening.' },
    { name: 'popoverClass / popoverStyle', values: 'string / object', default: "''", note: 'Class and style for the panel.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Button, Popover } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Popover, Button],
  templateUrl: './my-page.html'
})
export class MyPage {
  open = signal(false);
}`;

  protected readonly popoverCode = `<nc-popover [(open)]="open" ariaLabel="Share options">
  <button nc-button slot="trigger">Share</button>
  <p>Anything goes in here: text, links, a small form.</p>
</nc-popover>`;

  protected readonly classStyleCode = `<!-- The panel (which lives elsewhere in the page) has its own class and style inputs: -->
<nc-popover popoverClass="my-popover" [popoverStyle]="{ minWidth: '20rem' }">...</nc-popover>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --popover-padding: 1.5rem;
    --popup-bg: var(--gray-50);
}`;

  protected readonly variablesList = `--popup-bg / -border / -shadow / -backdrop
--popover-padding`;
}
