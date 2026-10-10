import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Switch } from '../../ncss';

@Component({
  selector: 'app-switch-page',
  imports: [Switch, Code],
  templateUrl: './switch.html',
  styleUrl: './switch.css'
})
export class SwitchPage {
  protected readonly wifi = signal(true);
  protected readonly notifications = signal(false);
  protected readonly emails = signal(true);
  protected readonly sms = signal(false);

  protected readonly inputs = [
    { name: 'checked', values: 'boolean', default: 'false', note: 'On/off state. Two-way: [(checked)].' },
    { name: 'label', values: 'string', default: "''", note: 'Visible label. Project content instead for a richer label (links, bold text).' },
    { name: 'disabled', values: 'boolean', default: 'false', note: 'Disables the switch (removed from the tab order).' },
    { name: 'name / value', values: 'string', default: "''", note: 'Passed to the native input, for forms.' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'Accessible name when there is no visible label.' },
    { name: 'ariaDescribedby', values: 'string', default: "''", note: 'Id of an element with a hint.' },
    { name: 'inputClass / inputStyle', values: 'string / object', default: "''", note: 'Class and style for the switch track itself.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Switch } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Switch],
  templateUrl: './my-page.html'
})
export class MyPage {
  wifi = signal(true);
}`;

  protected readonly usageCode = `<nc-switch label="Wi-Fi" />
<nc-switch label="Wi-Fi" [(checked)]="wifi" />
<nc-switch label="Disabled" disabled />
<nc-switch ariaLabel="Dark mode" />`;

  protected readonly bindingCode = `<!-- Two-way, or one-way with (checkedChange) -->
<nc-switch label="Wi-Fi" [(checked)]="wifi" />
<nc-switch label="Wi-Fi" [checked]="wifi()" (checkedChange)="save($event)" />

<!-- Or drive it from code -->
<nc-switch #sw label="Wi-Fi" />
<button nc-button (click)="sw.toggle()">Toggle</button>`;

  protected readonly richLabelCode = `<!-- Projected content is part of the label (and of the accessible name) -->
<nc-switch [(checked)]="emails">
  Send me <strong>emails</strong>
</nc-switch>`;

  protected readonly groupCode = `<!-- Group related switches in a fieldset with a legend -->
<fieldset>
  <legend>Notifications</legend>
  <nc-switch label="Emails" />
  <nc-switch label="SMS" />
</fieldset>

<!-- Link a hint so it is read with the switch -->
<nc-switch label="Wi-Fi" ariaDescribedby="wifi-hint" />
<p id="wifi-hint">Turning this off disconnects all devices.</p>`;

  protected readonly classStyleCode = `<!-- class and [style] go on the nc-switch element itself -->
<nc-switch class="my-switch" [style]="{ width: '100%' }" label="Custom" />

<!-- inputClass and inputStyle go on the track -->
<nc-switch label="Wide" [inputStyle]="{ width: '4rem' }" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --switch-width: 3rem;
    --switch-height: 1.75rem;
    --switch-checked-bg: var(--red-700);
    --switch-checked-knob-bg: var(--gray-0);
}

/* ...or only inside one part of the page */
.settings {
    --switch-label-gap: 1rem;
}`;

  protected readonly variablesList = `--switch-width / -height / -knob-gap / -label-gap
--switch-bg / -border / -hover-border-color / -shadow
--switch-knob-bg / -knob-shadow
--switch-checked-bg / -checked-shadow / -checked-knob-bg
--switch-focus-box-shadow / -disabled-opacity`;

  protected readonly classesCode = `<!-- Without the component, use the CSS classes on plain markup -->
<label class="switch-label">
  <input type="checkbox" role="switch" class="switch-input" />
  <span class="switch-text">Plain markup</span>
</label>`;
}
