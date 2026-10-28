import { booleanAttribute, Component, input, output } from '@angular/core';
import { Button } from '../../buttons/button';
import { DialogBase } from '../../utils/dialog';

@Component({
  selector: 'nc-modal',
  imports: [Button],
  templateUrl: './modal.html',
  styleUrls: ['../popup-base.css', './modal.css'],
  host: { '(document:keydown.escape)': 'onEscape($event)' }
})
export class Modal extends DialogBase {
  /** Shows the built-in Cancel / Ok buttons. Turn it off and project your own into `slot="footer"`. */
  readonly actionButtons = input(true, { transform: booleanAttribute });
  readonly confirmLabel = input('Ok');
  readonly cancelLabel = input('Close');
  /** CSS width, e.g. "40rem". The default comes from --modal-width. */
  readonly width = input('');
  readonly height = input('');
  /** Emits when the confirm button is pressed. The modal closes afterwards. */
  readonly confirmed = output<void>();

  protected confirm(): void {
    this.confirmed.emit();
    this.hide('confirm');
  }
}
