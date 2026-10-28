import { booleanAttribute, Component, input, model } from '@angular/core';

@Component({
  selector: 'nc-switch',
  templateUrl: './switch.html',
  styleUrl: './switch.css',
  host: {
    class: 'switch',
    '[class.switch-disabled]': 'disabled()'
  }
})
export class Switch {
  /** On/off state. Supports two-way binding: `[(checked)]`. */
  readonly checked = model(false);
  /** Visible label. For richer labels, project content instead (or as well). */
  readonly label = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly value = input('');
  /** Accessible name when there is no visible label. A visible label always wins, so don't set both. */
  readonly ariaLabel = input('');
  /** Id(s) of elements that describe the switch, e.g. a hint. */
  readonly ariaDescribedby = input('');
  readonly inputClass = input('');
  readonly inputStyle = input<Record<string, string>>({});

  protected onChange(checked: boolean): void {
    this.checked.set(checked);
  }

  toggle(): void {
    if (!this.disabled()) this.checked.set(!this.checked());
  }
}
