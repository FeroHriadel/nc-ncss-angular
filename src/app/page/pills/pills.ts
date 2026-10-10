import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, Pill, PillSize, PillVariant } from '../../ncss';

@Component({
  selector: 'app-pills-page',
  imports: [Pill, Button, Code],
  templateUrl: './pills.html',
  styleUrl: './pills.css'
})
export class PillsPage {
  protected readonly variants: PillVariant[] = ['default', 'dark', 'red', 'outline'];
  protected readonly sizes: PillSize[] = ['small', 'medium', 'large'];

  protected readonly tags = signal(['Angular', 'TypeScript', 'CSS', 'Accessibility']);
  protected readonly status = signal('');

  protected add(input: HTMLInputElement): void {
    const tag = input.value.trim();
    if (!tag || this.tags().includes(tag)) return;
    this.tags.update(tags => [...tags, tag]);
    this.status.set(`${tag} added`);
    input.value = '';
    input.focus();
  }

  protected remove(tag: string, list: HTMLElement): void {
    const index = this.tags().indexOf(tag);
    this.tags.update(tags => tags.filter(t => t !== tag));
    this.status.set(`${tag} removed`);
    // Keep keyboard focus inside the list instead of losing it to the page.
    queueMicrotask(() => {
      const buttons = list.querySelectorAll<HTMLElement>('.pill-close');
      buttons[Math.min(index, buttons.length - 1)]?.focus();
    });
  }

  protected readonly inputs = [
    { name: 'variant', values: "'default' | 'dark' | 'red' | 'outline'", default: "'default'", note: 'Color style, matching the button variants.' },
    { name: 'size', values: "'small' | 'medium' | 'large'", default: "'medium'", note: 'Height and font size.' },
    { name: 'closable', values: 'boolean', default: 'false', note: 'Shows a remove button.' },
    { name: 'closeLabel', values: 'string', default: "'Remove'", note: "Accessible name of the remove button. The pill's text is read after it." },
    { name: '(closed)', values: 'output', default: '', note: 'Emits when the remove button is pressed. The pill does not remove itself.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Pill } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Pill],
  templateUrl: './my-page.html'
})
export class MyPage {
  tags = signal(['Angular', 'CSS']);
  remove(tag: string) { this.tags.update(tags => tags.filter(t => t !== tag)); }
}`;

  protected readonly usageCode = `<nc-pill>Default</nc-pill>
<nc-pill variant="dark">Dark</nc-pill>
<nc-pill variant="red" size="large">Large red</nc-pill>
<nc-pill variant="outline" size="small">Small outline</nc-pill>`;

  protected readonly closableCode = `<!-- A set of pills is a list -->
<ul class="pill-list">
  @for (tag of tags(); track tag) {
    <li><nc-pill closable (closed)="remove(tag)">{{ tag }}</nc-pill></li>
  }
</ul>

<!-- Screen readers hear "Remove, Angular, button" -->
<nc-pill closable closeLabel="Delete" (closed)="remove('Angular')">Angular</nc-pill>`;

  protected readonly classStyleCode = `<!-- Your classes are added to the pill's own classes -->
<nc-pill class="my-pill">Custom class</nc-pill>

<!-- [style] takes an object and overrides everything else -->
<nc-pill [style]="{ backgroundColor: '#333', color: 'green' }">Custom style</nc-pill>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --pill-bg: var(--red-100);
    --pill-text: var(--red-800);
    --pill-medium-height: 2.25rem;
}

/* ...or only inside one part of the page */
.sidebar {
    --pill-padding-x: 1rem;
}`;

  protected readonly variablesList = `--pill-bg / -text / -border / -shadow
--pill-{dark|red|outline}-bg / -text / -border
--pill-{small|medium|large}-height / -text
--pill-padding-x`;

  protected readonly classesCode = `<!-- Without the component, use the CSS classes directly -->
<span class="pill pill-dark pill-large"><span class="pill-text">Dark large</span></span>`;
}
