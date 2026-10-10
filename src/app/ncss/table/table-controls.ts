import { booleanAttribute, Component, ElementRef, inject, input, model, output } from '@angular/core';
import { Button } from '../buttons/button';
import { FilterIcon } from '../icons/filter.icon';
import { ListIcon } from '../icons/list.icon';
import { ReloadIcon } from '../icons/reload.icon';
import { Select, SelectOption } from '../select/select';

/**
 * The bar above a table: the row count on the left, the tools on the right.
 * `<nc-table>` shows it by default (turn it off with `[controls]="false"`), but it works on its own too.
 *
 * It is as wide as its parent. When the parent is too narrow for both sides it does not wrap or show a scrollbar:
 * it scrolls sideways by dragging (mouse) or swiping (touch).
 */
@Component({
  selector: 'nc-table-controls',
  imports: [Button, Select, ReloadIcon, ListIcon, FilterIcon],
  templateUrl: './table-controls.html',
  host: { class: 'table-controls' }
})
export class TableControls {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Number of rows shown. */
  readonly rowCount = input(0);
  /** Number of rows before filtering. When it is more than `rowCount`, "3 of 7 rows" is shown. */
  readonly totalCount = input<number | null>(null);
  /** Shows "Loading..." instead of the row count. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** The columns that can be shown or hidden. */
  readonly columns = input<SelectOption[]>([]);
  /** Keys of the columns that are shown. Supports two-way binding: `[(visible)]`. */
  readonly visible = model<string[]>([]);

  /** Emits when the reload button is pressed. */
  readonly reload = output<void>();
  /** Emits when the filter button is pressed. Open your filter dialog here. */
  readonly filter = output<void>();

  // Texts, so they can be translated.
  readonly rowsLabel = input('rows');
  readonly rowLabel = input('row');
  readonly ofLabel = input('of');
  readonly loadingLabel = input('Loading...');
  readonly reloadLabel = input('Reload table (reset columns, order and sort)');
  readonly columnsLabel = input('Show or hide columns');
  readonly filterLabel = input('Filter rows');

  private drag: { x: number; scroll: number; moved: boolean } | null = null;

  protected onVisibleChange(value: string | string[]): void {
    this.visible.set(Array.isArray(value) ? value : value ? [value] : []);
  }

  // ---------- Drag to scroll (mouse). Touch scrolls natively. ----------

  protected dragStart(event: PointerEvent): void {
    const element = this.host.nativeElement;
    if (event.pointerType !== 'mouse' || event.button !== 0 || element.scrollWidth <= element.clientWidth) return;
    this.drag = { x: event.clientX, scroll: element.scrollLeft, moved: false };
  }

  protected dragMove(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 4) return; // a click, not a drag
    if (!drag.moved) {
      drag.moved = true;
      this.host.nativeElement.setPointerCapture(event.pointerId);
      this.host.nativeElement.classList.add('table-controls-dragging');
    }
    this.host.nativeElement.scrollLeft = drag.scroll - distance;
  }

  protected dragEnd(event: PointerEvent): void {
    const drag = this.drag;
    this.drag = null;
    if (!drag?.moved) return;
    const element = this.host.nativeElement;
    element.classList.remove('table-controls-dragging');
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    // The button under the pointer must not "click" at the end of a drag.
    const swallow = (click: Event): void => click.stopPropagation();
    element.addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => element.removeEventListener('click', swallow, true));
  }
}
