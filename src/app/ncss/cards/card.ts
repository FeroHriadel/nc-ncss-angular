import { Component, computed, input } from '@angular/core';

export type CardVariant = 'light' | 'medium' | 'dark';

@Component({
  selector: 'nc-card',
  template: '<ng-content />',
  host: { '[class]': 'classes()' }
})
export class Card {
  readonly variant = input<CardVariant>('light');
  protected readonly classes = computed(() => `card card-${this.variant()}`);
}
