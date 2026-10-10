import { Component } from '@angular/core';
import { Code } from '../../components/code/code';
import { Card, CardVariant } from '../../ncss';

@Component({
  selector: 'app-cards',
  imports: [Card, Code],
  templateUrl: './cards.html',
  styleUrl: './cards.css'
})
export class Cards {
  protected readonly variants: CardVariant[] = ['light', 'medium', 'dark'];

  protected readonly inputs = [
    { name: 'variant', values: "'light' | 'medium' | 'dark'", default: "'light'", note: 'Background shade of the card.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { Card } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Card],
  templateUrl: './my-page.html'
})
export class MyPage {}`;

  protected readonly usageCode = `<nc-card>Light (default)</nc-card>
<nc-card variant="medium">Medium</nc-card>
<nc-card variant="dark">Dark</nc-card>`;

  protected readonly bindingCode = `<!-- Bind the variant to your own state -->
<nc-card [variant]="selected ? 'dark' : 'light'">
  <h3>Title</h3>
  <p>Any content</p>
</nc-card>`;

  protected readonly classStyleCode = `<!-- Your classes are added to the card's own classes -->
<nc-card class="my-card">Custom class</nc-card>

<!-- [style] takes an object and overrides everything else -->
<nc-card [style]="{ padding: '2rem', backgroundColor: '#333', color: 'green' }">Custom style</nc-card>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --card-padding: 1.5rem;
    --card-light-bg: var(--red-50);
    --card-border: 0;
}

/* ...or only inside one part of the page */
.sidebar {
    --card-medium-bg: var(--gray-200);
}`;

  protected readonly variablesList = `--card-{light|medium|dark}-bg
--card-border
--card-padding`;

  protected readonly classesCode = `<!-- Without the component, use the CSS classes directly -->
<div class="card card-medium">Medium card</div>`;
}
