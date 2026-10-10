import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Collapsible } from '../../ncss';

@Component({
  selector: 'app-collapsible-page',
  imports: [Collapsible, Code],
  templateUrl: './collapsible.html',
  styleUrl: './collapsible.css'
})
export class CollapsiblePage {
  protected readonly faqOpen = signal(true);

  protected readonly collapsibleInputs = [
    { name: 'open', values: 'boolean', default: 'false', note: 'Whether the content is shown. Two-way: [(open)].' },
    { name: 'disabled', values: 'boolean', default: 'false', note: 'Stops it from opening or closing.' },
    { name: 'chevron', values: 'boolean', default: 'true', note: 'Shows the arrow that turns when it opens.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Collapsible } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Collapsible],
  templateUrl: './my-page.html'
})
export class MyPage {
  open = signal(false);
}`;

  protected readonly collapsibleCode = `<nc-collapsible [(open)]="open">
  <span slot="trigger">What is ncss?</span>
  <p>A small themeable component library.</p>
</nc-collapsible>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --collapsible-hover-bg: var(--gray-200);
}`;

  protected readonly variablesList = `--collapsible-hover-bg / -hover-shadow`;
}
