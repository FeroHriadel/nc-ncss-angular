import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Password } from '../../ncss';

@Component({
  selector: 'app-input-page',
  imports: [Code, Password],
  templateUrl: './input.html',
  styleUrl: './input.css'
})
export class InputPage {
  protected readonly name = signal('');
  protected readonly password = signal('');

  protected readonly types = [
    { type: 'text', note: 'Plain text. Also the default when type is missing.' },
    { type: 'email / tel / url', note: 'Same look, but the right mobile keyboard and built-in validation.' },
    { type: 'password', note: 'Masks the value.' },
    { type: 'search', note: 'Search box semantics.' },
    { type: 'number', note: 'Numeric input with min, max and step.' },
    { type: 'date / time / datetime-local / month / week', note: 'Native pickers.' },
  ];

  protected readonly passwordInputs = [
    { name: 'value', values: 'string', default: "''", note: 'The typed password. Two-way: [(value)].' },
    { name: 'placeholder', values: 'string', default: "''", note: 'Hint shown when empty. Not a replacement for a label.' },
    { name: 'disabled / required', values: 'boolean', default: 'false', note: 'Native attributes.' },
    { name: 'invalid', values: 'boolean', default: 'false', note: 'Sets aria-invalid and shows the error border.' },
    { name: 'autocomplete', values: "'current-password' | 'new-password' | 'off'", default: "'current-password'", note: 'Tells password managers what to do.' },
    { name: 'minLength / maxLength', values: 'number', default: 'none', note: 'Native length limits.' },
    { name: 'name', values: 'string', default: "''", note: 'Passed to the native input, for forms.' },
    { name: 'inputId', values: 'string', default: 'generated', note: 'Id of the inner input, for an external label.' },
    { name: 'ariaLabel / ariaDescribedby', values: 'string', default: "''", note: 'Accessible name without a label, and the id of a hint or error.' },
    { name: 'toggleLabel', values: 'string', default: "'Show password'", note: 'Accessible name of the eye button (translate it).' },
    { name: 'inputClass / inputStyle', values: 'string / object', default: "''", note: 'Class and style for the input itself.' },
  ];

  protected readonly passwordCode = `import { Password } from '../../ncss';   // add it to the component's imports

<label for="pass">Password</label>
<nc-password inputId="pass" [(value)]="password" autocomplete="new-password" required />

<!-- Without a visible label -->
<nc-password ariaLabel="Password" />

<!-- Or drive it from code -->
<nc-password #pass />
<button nc-button (click)="pass.focus()">Focus</button>
<button nc-button (click)="pass.clear()">Clear</button>`;

  protected readonly importCode = `<!-- Nothing to import. Plain inputs and textareas are styled by ncss.css -->
<input placeholder="Your name" />
<textarea placeholder="Your message"></textarea>`;

  protected readonly usageCode = `<input placeholder="Placeholder" />
<input value="With a value" />
<input type="password" />
<input disabled value="Disabled" />
<input readonly value="Read only" />
<input aria-invalid="true" />
<textarea></textarea>`;

  protected readonly fieldCode = `<!-- .field lays out a label, an input and a hint or error message -->
<div class="field">
  <label class="field-label" for="email">Email</label>
  <input id="email" type="email" autocomplete="email" required aria-describedby="email-hint" />
  <span class="field-hint" id="email-hint">We never share it.</span>
</div>

<!-- Invalid: set aria-invalid and point aria-describedby at the error -->
<div class="field">
  <label class="field-label" for="age">Age</label>
  <input id="age" type="number" aria-invalid="true" aria-describedby="age-error" />
  <span class="field-error" id="age-error">Enter a number between 18 and 99.</span>
</div>`;

  protected readonly bindingCode = `<!-- It's a native input, so bind it the usual way -->
<input #name [value]="name()" (input)="name.set(name.value)" />

<!-- or with ngModel / reactive forms -->
<input [(ngModel)]="name" />`;

  protected readonly classStyleCode = `<!-- Your classes and styles just work: the default styles have zero specificity -->
<input class="my-input" />
<input [style]="{ width: '100%', borderRadius: '999px' }" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --input-width: 20rem;
    --input-height: 2.5rem;
    --input-bg: var(--gray-0);
}

/* ...or only inside one part of the page */
.toolbar {
    --input-bg: var(--gray-200);
}`;

  protected readonly variablesList = `--input-width / -height / -padding-x / -text
--input-bg / -text-color / -placeholder-color
--input-border / -hover-border-color / -shadow
--input-focus-box-shadow / -invalid-border-color
--input-backdrop / -disabled-opacity`;
}
