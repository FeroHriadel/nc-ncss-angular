import { Component } from '@angular/core';

/** A centered, max-width wrapper. It has no inputs: use `class`, `[style]`, `id` and `role` like on any element. */
@Component({
  selector: 'nc-container',
  template: '<ng-content />',
  host: { class: 'container' }
})
export class Container {}
