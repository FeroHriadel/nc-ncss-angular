import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, Select, SelectOption } from '../../ncss';

@Component({
  selector: 'app-select-page',
  imports: [Select, Button, Code],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class SelectPage {
  protected readonly fruits: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'grape', label: 'Grape' },
    { value: 'kiwi', label: 'Kiwi' },
    { value: 'lemon', label: 'Lemon' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
  ];

  protected readonly single = signal<string | string[]>('banana');
  protected readonly multi = signal<string | string[]>(['apple', 'kiwi']);

  protected readonly inputs = [
    { name: 'options', values: 'SelectOption[]', default: '[]', note: 'List of { value, label } objects.' },
    { name: 'value', values: 'string | string[]', default: "''", note: 'Selected value (array when multiple). Two-way: [(value)].' },
    { name: 'placeholder', values: 'string', default: "''", note: 'Shown when nothing is selected.' },
    { name: 'multiple', values: 'boolean', default: 'false', note: 'Allow selecting several options. The list stays open.' },
    { name: 'searchable', values: 'boolean', default: 'false', note: 'Adds a search box at the top of the list.' },
    { name: 'showCheck', values: 'boolean', default: 'true', note: 'Show a check mark next to selected options.' },
    { name: 'disabled', values: 'boolean', default: 'false', note: 'Disables the select.' },
    { name: 'customTrigger', values: 'boolean', default: 'false', note: 'Use the projected content as the trigger.' },
    { name: 'forceDirection', values: "'up' | 'down'", default: 'auto', note: 'Skip auto positioning and always open in this direction.' },
    { name: 'optionsWidth', values: 'string', default: "''", note: 'CSS width of the options list, e.g. "20rem".' },
    { name: 'triggerClass / triggerStyle', values: 'string / object', default: "''", note: 'Class and style for the default trigger.' },
    { name: 'optionsStyle', values: 'object', default: '{}', note: 'Style for the options list.' },
    { name: 'ariaLabel', values: 'string', default: "'Select an option'", note: 'Accessible name of the trigger.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { Select, SelectOption } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Select],
  templateUrl: './my-page.html'
})
export class MyPage {
  fruits: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ];
  fruit = signal('apple');
}`;

  protected readonly usageCode = `<nc-select [options]="fruits" placeholder="Pick a fruit" />
<nc-select [options]="fruits" [(value)]="fruit" />
<nc-select [options]="fruits" multiple searchable />
<nc-select [options]="fruits" [showCheck]="false" />
<nc-select [options]="fruits" disabled />`;

  protected readonly bindingCode = `<!-- Read the value with two-way binding or (valueChange) -->
<nc-select [options]="fruits" [(value)]="fruit" />
<nc-select [options]="fruits" [value]="fruit()" (valueChange)="save($event)" />

<!-- Or drive it from code -->
<nc-select #select [options]="fruits" />
<button nc-button (click)="select.clear()">Clear</button>
<!-- select.open(), select.close(), select.toggle(), select.setValue('kiwi') -->`;

  protected readonly customTriggerCode = `<!-- Any content becomes the trigger -->
<nc-select customTrigger [options]="fruits" [(value)]="fruit">
  <button nc-button variant="outline">Choose</button>
</nc-select>`;

  protected readonly nativeCode = `<select>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</select>`;

  protected readonly classStyleCode = `<!-- class and [style] go on the nc-select element itself -->
<nc-select class="my-select" [style]="{ width: '100%' }" [options]="fruits" />

<!-- The trigger and the list have their own inputs -->
<nc-select [options]="fruits" triggerClass="my-trigger" [triggerStyle]="{ fontSize: '18px' }" optionsWidth="20rem" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --select-width: 16rem;
    --select-height: 2.5rem;
    --select-check-color: var(--gray-900);
}

/* ...or only inside one part of the page */
.toolbar {
    --select-bg: var(--gray-100);
}`;

  protected readonly variablesList = `--select-width / -height / -option-height / -text / -padding-x
--select-bg / -text-color / -placeholder-color
--select-border / -hover-border-color / -shadow / -open-shadow
--select-focus-box-shadow / -backdrop
--select-options-bg / -options-border / -options-shadow
--select-option-hover-bg / -option-hover-shadow
--select-check-color / -disabled-opacity / -z-index`;
}
