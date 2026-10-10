import { booleanAttribute, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'dark' | 'red' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'button[nc-button]',
  template: '<span class="btn-label"><ng-content /></span>',
  host: { '[class]': 'classes()' }
})
export class Button {
  readonly variant = input<ButtonVariant>('dark');
  readonly size = input<ButtonSize>('medium');
  readonly square = input(false, { transform: booleanAttribute });
  protected readonly classes = computed(() =>
    `btn btn-${this.variant()} btn-${this.size()}${this.square() ? ' btn-square' : ''}`
  );
}
