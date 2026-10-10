import { Component } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, ButtonSize, ButtonVariant } from '../../ncss';

@Component({
  selector: 'app-buttons',
  imports: [Button, Code],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css'
})
export class Buttons {
  protected readonly variants: ButtonVariant[] = ['red', 'dark', 'outline', 'ghost'];
  protected readonly sizes: ButtonSize[] = ['small', 'medium', 'large'];

  protected readonly inputs = [
    { name: 'variant', values: "'dark' | 'red' | 'outline' | 'ghost'", default: "'dark'", note: 'Color style of the button.' },
    { name: 'size', values: "'small' | 'medium' | 'large'", default: "'medium'", note: 'Height and font size.' },
    { name: 'square', values: 'boolean', default: 'false', note: 'Makes the width equal to the height (icon buttons).' },  ];

  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { Button } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Button],
  templateUrl: './my-page.html'
})
export class MyPage {}`;

  protected readonly usageCode = `<button nc-button>Dark, medium (defaults)</button>
<button nc-button variant="red">Red</button>
<button nc-button variant="outline" size="large">Large outline</button>
<button nc-button variant="ghost" size="small">Small ghost</button>
<button nc-button square>+</button>`;

  protected readonly bindingCode = `<!-- Bind the inputs to your own state -->
<button nc-button [variant]="isDanger ? 'red' : 'dark'">Delete</button>

<!-- It's a real <button>, so native attributes and events just work -->
<button nc-button type="submit" [disabled]="form.invalid" (click)="save()">Save</button>`;

  protected readonly classStyleCode = `<!-- Your classes are added to the button's own classes -->
<button nc-button class="my-button">Custom class</button>

<!-- [style] takes an object and overrides everything else -->
<button nc-button [style]="{ color: 'green', width: '100%' }">Custom style</button>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --button-red-bg: var(--red-600);
    --button-red-hover-bg: var(--red-500);
    --button-medium-height: 2.25rem;
    --button-padding-x: 1.25rem;
    --button-focus-box-shadow: 0 0 0 3px var(--red-300);
}

/* ...or only inside one part of the page */
.toolbar {
    --button-dark-bg: var(--gray-900);
    --button-dark-hover-bg: var(--gray-800);
}`;

  protected readonly variablesList = `--button-{dark|red}-bg / -text / -border / -hover-bg
--button-outline-bg / -text / -border
--button-ghost-bg / -text / -border / -hover-bg
--button-{small|medium|large}-height / -text
--button-padding-x
--button-focus-box-shadow`;

  protected readonly classesCode = `<!-- Without the component, use the CSS classes directly -->
<button class="btn btn-red btn-large">Red large</button>
<button class="btn btn-outline btn-square btn-small">+</button>`;
}
