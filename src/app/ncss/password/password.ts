import { booleanAttribute, Component, computed, input, model, signal, viewChild, ElementRef } from '@angular/core';
import { Button } from '../buttons/button';

let nextId = 0;

@Component({
  selector: 'nc-password',
  imports: [Button],
  templateUrl: './password.html',
  styleUrl: './password.css',
  host: { class: 'password' }
})
export class Password {
  /** The typed password. Supports two-way binding: `[(value)]`. */
  readonly value = model('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Sets aria-invalid and shows the error border. */
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly name = input('');
  /** Use 'new-password' on sign-up and change-password forms. */
  readonly autocomplete = input<'current-password' | 'new-password' | 'off'>('current-password');
  readonly minLength = input<number>();
  readonly maxLength = input<number>();
  /** Id of the inner input, so an external `<label for="...">` can point at it. Generated when empty. */
  readonly inputId = input('');
  /** Accessible name when there is no <label>. A placeholder is not a label. */
  readonly ariaLabel = input('');
  /** Id(s) of elements that describe the field, e.g. a hint or an error message. */
  readonly ariaDescribedby = input('');
  /** Accessible name of the show/hide button (translate it for other languages). */
  readonly toggleLabel = input('Show password');
  readonly inputClass = input('');
  readonly inputStyle = input<Record<string, string>>({});

  protected readonly visible = signal(false);
  private readonly generatedId = `password-${nextId++}`;
  protected readonly id = computed(() => this.inputId() || this.generatedId);
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  toggle(): void {
    this.visible.update(visible => !visible);
  }

  focus(): void {
    this.box()?.nativeElement.focus();
  }

  clear(): void {
    this.value.set('');
  }
}
