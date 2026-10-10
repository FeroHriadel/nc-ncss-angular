import { booleanAttribute, Component, input, model } from '@angular/core';

@Component({
  selector: 'nc-checkbox',
  templateUrl: './checkbox.html',
  host: {
    class: 'checkbox',
    '[class.checkbox-disabled]': 'disabled()'
  }
})
export class Checkbox {
  /** Checked state. Supports two-way binding: `[(checked)]`. */
  readonly checked = model(false);
  /** Mixed state ("some, not all"). Cleared as soon as the user toggles the checkbox. */
  readonly indeterminate = model(false);
  /** Visible label. For richer labels, project content instead (or as well). */
  readonly label = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Marks the checkbox as invalid for assistive technology and shows the error border. */
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly value = input('');
  /** Accessible name when there is no visible label. A visible label always wins, so don't set both. */
  readonly ariaLabel = input('');
  /** Id(s) of elements that describe the checkbox, e.g. a hint or an error message. */
  readonly ariaDescribedby = input('');
  readonly inputClass = input('');
  readonly inputStyle = input<Record<string, string>>({});

  protected onChange(checked: boolean): void {
    this.checked.set(checked);
    this.indeterminate.set(false);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.onChange(!this.checked());
  }
}
