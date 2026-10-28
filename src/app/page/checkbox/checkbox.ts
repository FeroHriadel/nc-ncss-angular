import { Component, computed, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Checkbox } from '../../ncss';

@Component({
  selector: 'app-checkbox-page',
  imports: [Checkbox, Code],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css'
})
export class CheckboxPage {
  protected readonly accepted = signal(true);
  protected readonly terms = signal(false);

  protected readonly toppings = signal([
    { name: 'Cheese', checked: true },
    { name: 'Mushrooms', checked: false },
    { name: 'Olives', checked: false },
  ]);
  protected readonly allChecked = computed(() => this.toppings().every(t => t.checked));
  protected readonly someChecked = computed(() => this.toppings().some(t => t.checked) && !this.allChecked());

  protected toggleAll(checked: boolean): void {
    this.toppings.update(list => list.map(t => ({ ...t, checked })));
  }

  protected toggleTopping(index: number, checked: boolean): void {
    this.toppings.update(list => list.map((t, i) => (i === index ? { ...t, checked } : t)));
  }

  protected readonly inputs = [
    { name: 'checked', values: 'boolean', default: 'false', note: 'Checked state. Two-way: [(checked)].' },
    { name: 'indeterminate', values: 'boolean', default: 'false', note: 'Mixed state, e.g. a "select all" with some children checked. Cleared when the user toggles it.' },
    { name: 'label', values: 'string', default: "''", note: 'Visible label. Project content instead for a richer label (links, bold text).' },
    { name: 'disabled', values: 'boolean', default: 'false', note: 'Disables the checkbox (removed from the tab order).' },
    { name: 'required', values: 'boolean', default: 'false', note: 'Native required, announced by screen readers.' },
    { name: 'invalid', values: 'boolean', default: 'false', note: 'Sets aria-invalid and shows the error border.' },
    { name: 'name / value', values: 'string', default: "''", note: 'Passed to the native input, for forms.' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'Accessible name when there is no visible label.' },
    { name: 'ariaDescribedby', values: 'string', default: "''", note: 'Id of an element with a hint or error message.' },
    { name: 'inputClass / inputStyle', values: 'string / object', default: "''", note: 'Class and style for the checkbox box itself.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Checkbox } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Checkbox],
  templateUrl: './my-page.html'
})
export class MyPage {
  accepted = signal(false);
}`;

  protected readonly usageCode = `<nc-checkbox label="Subscribe" />
<nc-checkbox label="Accepted" [(checked)]="accepted" />
<nc-checkbox label="Mixed" [indeterminate]="true" />
<nc-checkbox label="Disabled" disabled />
<nc-checkbox ariaLabel="Select row 3" />`;

  protected readonly bindingCode = `<!-- Two-way, or one-way with (checkedChange) -->
<nc-checkbox label="Accepted" [(checked)]="accepted" />
<nc-checkbox label="Accepted" [checked]="accepted()" (checkedChange)="save($event)" />

<!-- Or drive it from code -->
<nc-checkbox #box label="Accepted" />
<button nc-button (click)="box.toggle()">Toggle</button>`;

  protected readonly richLabelCode = `<!-- Projected content is part of the label (and of the accessible name) -->
<nc-checkbox [(checked)]="terms">
  I accept the <a href="/terms">terms</a>
</nc-checkbox>`;

  protected readonly selectAllCode = `<nc-checkbox
  label="All toppings"
  [checked]="allChecked()"
  [indeterminate]="someChecked()"
  (checkedChange)="toggleAll($event)"
/>
@for (topping of toppings(); track topping.name; let i = $index) {
  <nc-checkbox [label]="topping.name" [checked]="topping.checked" (checkedChange)="toggleTopping(i, $event)" />
}`;

  protected readonly groupCode = `<!-- Group related checkboxes in a fieldset with a legend -->
<fieldset>
  <legend>Toppings</legend>
  <nc-checkbox label="Cheese" />
  <nc-checkbox label="Olives" />
</fieldset>

<!-- Link an error message so it is read with the checkbox -->
<nc-checkbox label="I accept" required invalid ariaDescribedby="terms-error" />
<p id="terms-error">You must accept to continue.</p>`;

  protected readonly classStyleCode = `<!-- class and [style] go on the nc-checkbox element itself -->
<nc-checkbox class="my-checkbox" [style]="{ width: '100%' }" label="Custom" />

<!-- inputClass and inputStyle go on the box -->
<nc-checkbox label="Big box" [inputStyle]="{ borderRadius: '50%' }" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --checkbox-size: 1.5rem;
    --checkbox-checked-bg: var(--red-700);
    --checkbox-check-color: var(--gray-0);
}

/* ...or only inside one part of the page */
.form {
    --checkbox-label-gap: 0.75rem;
}`;

  protected readonly variablesList = `--checkbox-size / -radius / -label-gap
--checkbox-bg / -border / -hover-border-color / -shadow
--checkbox-checked-bg / -checked-shadow / -check-color
--checkbox-invalid-border-color / -focus-box-shadow
--checkbox-disabled-opacity`;
}
