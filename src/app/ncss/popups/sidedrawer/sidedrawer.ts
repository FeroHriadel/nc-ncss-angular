import { Component, computed, input } from '@angular/core';
import { Button } from '../../buttons/button';
import { DialogBase } from '../../utils/dialog';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'nc-sidedrawer',
  imports: [Button],
  templateUrl: './sidedrawer.html',
  host: { '(document:keydown.escape)': 'onEscape($event)' }
})
export class SideDrawer extends DialogBase {
  readonly side = input<DrawerSide>('right');
  /** Width for left and right drawers, height for top and bottom ones. Any CSS length. Defaults to --drawer-size / --drawer-size-vertical. */
  readonly size = input('');

  protected readonly horizontal = computed(() => this.side() === 'left' || this.side() === 'right');
}
