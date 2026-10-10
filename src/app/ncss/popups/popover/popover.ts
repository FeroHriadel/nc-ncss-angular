import {
  afterNextRender, booleanAttribute, Component, computed, effect, ElementRef, inject, Injector, input, model, signal, untracked, viewChild
} from '@angular/core';
import { placePopup } from '../../utils/place-popup';

let nextId = 0;

@Component({
  selector: 'nc-popover',
  templateUrl: './popover.html',
  host: {
    class: 'popover',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'onEscape($event)',
    '(focusout)': 'onFocusOut($event)',
    '(window:resize)': 'place()'
  }
})
export class Popover {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  /** Whether it is shown. Supports two-way binding: `[(open)]`. */
  readonly open = model(false);
  /** Accessible name. When set, the panel is announced as a dialog with this name. */
  readonly ariaLabel = input('');
  /** Which edge of the trigger the panel lines up with. */
  readonly align = input<'start' | 'end'>('start');
  readonly direction = input<'up' | 'down'>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly popoverClass = input('');
  readonly popoverStyle = input<Record<string, string>>({});

  private readonly placement = signal<Record<string, string>>({ visibility: 'hidden' });
  protected readonly panelStyle = computed(() => ({ ...this.popoverStyle(), ...this.placement() }));
  protected readonly panelId = `popover-panel-${nextId++}`;
  private readonly triggerWrap = viewChild<ElementRef<HTMLElement>>('triggerWrap');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Put the open/closed state on the user's own trigger button, which lives in the projected content.
    effect(() => {
      const wrap = this.triggerWrap()?.nativeElement;
      const isOpen = this.open();
      if (!wrap) return;
      untracked(() => {
        const trigger = this.triggerElement();
        trigger?.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) trigger?.setAttribute('aria-controls', this.panelId);
        else trigger?.removeAttribute('aria-controls');
      });
    });

    effect(() => {
      if (this.open()) {
        untracked(() => {
          this.placement.set({ visibility: 'hidden' });
          afterNextRender(() => this.place(), { injector: this.injector });
        });
      }
    });
  }

  show(): void {
    if (!this.disabled()) this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }

  toggle(): void {
    if (this.open()) this.hide();
    else this.show();
  }

  protected place(): void {
    const panel = this.panel()?.nativeElement;
    if (this.open() && panel) {
      this.placement.set(placePopup(this.host.nativeElement, panel, { align: this.align(), direction: this.direction() }));
    }
  }

  private triggerElement(): HTMLElement | null {
    return (
      this.triggerWrap()?.nativeElement.querySelector<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? null
    );
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.hide();
  }

  protected onEscape(event: Event): void {
    if (!this.open() || event.defaultPrevented) return;
    this.hide();
    this.triggerElement()?.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() && next && !this.host.nativeElement.contains(next)) this.hide();
  }
}
