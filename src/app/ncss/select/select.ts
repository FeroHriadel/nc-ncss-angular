import {
  DestroyRef, Injector, afterNextRender, booleanAttribute, Component, computed, ElementRef, inject, input, model, signal, viewChild
} from '@angular/core';
import { placePopup } from '../utils/place-popup';

export interface SelectOption {
  value: string;
  label: string;
}
let nextId = 0;

@Component({
  selector: 'nc-select',
  templateUrl: './select.html',
  styleUrl: './select.css',
  host: {
    class: 'select',
    '[class.select-disabled]': 'disabled()',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'onKeydown($event)',
    '(window:resize)': 'position()'
  }
})
export class Select {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly options = input<SelectOption[]>([]);
  /** Selected value (string), or an array of values when `multiple`. Supports two-way binding: `[(value)]`. */
  readonly value = model<string | string[]>('');
  readonly placeholder = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly showCheck = input(true, { transform: booleanAttribute });
  /** Project your own trigger as content instead of the default one. */
  readonly customTrigger = input(false, { transform: booleanAttribute });
  readonly forceDirection = input<'up' | 'down'>();
  /**
   * Shows the list on the browser's top layer, so a parent with `overflow: auto/hidden` (a scrolling toolbar, a table)
   * cannot clip it. The list closes when something scrolls.
   */
  readonly overlay = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Select an option');
  readonly optionsWidth = input('');
  readonly triggerClass = input('');
  readonly triggerStyle = input<Record<string, string>>({});
  readonly optionsStyle = input<Record<string, string>>({});

  protected readonly isOpen = signal(false);
  /** Inline position of the list, worked out so it always stays on screen. */
  protected readonly popupStyle = signal<Record<string, string>>({ visibility: 'hidden' });
  protected readonly listStyle = computed(() => {
    const style = { ...this.optionsStyle(), ...this.popupStyle() };
    // placePopup limits the width to the viewport, which replaced the CSS cap (24rem) and any maxWidth of yours.
    // Keep the smaller of the two.
    const viewportMax = this.popupStyle()['maxWidth'];
    if (viewportMax) style['maxWidth'] = `min(${this.optionsStyle()['maxWidth'] ?? '24rem'}, ${viewportMax})`;
    return style;
  });
  protected readonly searchTerm = signal('');
  protected readonly highlightedIndex = signal(-1);

  protected readonly listId = `select-list-${nextId++}`;
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private readonly onScroll = (event: Event): void => {
    if (!this.list()?.nativeElement.contains(event.target as Node)) this.close();
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => document.removeEventListener('scroll', this.onScroll, true));
  }

  /** The value normalized to the current mode: always an array when `multiple`, always a string otherwise. */
  protected readonly selected = computed<string | string[]>(() => {
    const value = this.value();
    if (this.multiple()) return Array.isArray(value) ? value : value ? [value] : [];
    return Array.isArray(value) ? value[0] ?? '' : value;
  });

  protected readonly shownOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const options = this.options();
    return term ? options.filter(option => option.label.toLowerCase().includes(term)) : options;
  });

  protected readonly triggerText = computed(() => {
    const selected = this.selected();
    if (Array.isArray(selected)) {
      return selected.length === 1 ? this.labelOf(selected[0]) : selected.length ? `${selected.length} selected` : '';
    }
    return this.labelOf(selected);
  });

  protected readonly activeDescendant = computed(() =>
    this.isOpen() && this.highlightedIndex() >= 0 ? this.optionId(this.highlightedIndex()) : null
  );

  protected optionId(index: number): string {
    return `${this.listId}-option-${index}`;
  }

  protected isSelected(option: SelectOption): boolean {
    const selected = this.selected();
    return Array.isArray(selected) ? selected.includes(option.value) : selected === option.value;
  }

  private labelOf(value: string): string {
    return this.options().find(option => option.value === value)?.label ?? '';
  }

  // ---- public API (use via a template reference or viewChild) ----

  open(): void {
    if (this.disabled() || this.isOpen()) return;
    this.popupStyle.set({ visibility: 'hidden' });
    this.highlightedIndex.set(-1);
    this.isOpen.set(true);
    // Once the list is rendered, place it inside the screen (and focus the search box).
    afterNextRender(() => {
      this.position();
      this.searchInput()?.nativeElement.focus();
    }, { injector: this.injector });
  }

  close(): void {
    if (!this.isOpen()) return;
    document.removeEventListener('scroll', this.onScroll, true);
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
    this.searchTerm.set('');
  }

  toggle(): void {
    if (this.isOpen()) this.close();
    else this.open();
  }

  clear(): void {
    this.value.set(this.multiple() ? [] : '');
  }

  setValue(value: string | string[]): void {
    this.value.set(value);
  }

  // ---- internals ----

  protected select(option: SelectOption): void {
    if (this.disabled()) return;
    const selected = this.selected();
    if (Array.isArray(selected)) {
      this.value.set(selected.includes(option.value) ? selected.filter(v => v !== option.value) : [...selected, option.value]);
    } else {
      this.value.set(option.value);
      this.close();
      this.trigger()?.nativeElement.focus();
    }
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term);
    this.highlightedIndex.set(term.trim() && this.shownOptions().length ? 0 : -1);
  }

  protected clearSearch(): void {
    this.onSearch('');
    this.searchInput()?.nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const typing = event.target instanceof HTMLInputElement;

    if (!this.isOpen()) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key) && !typing) {
        event.preventDefault(); // stop the page from scrolling
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        this.trigger()?.nativeElement.focus();
        break;
      case 'Tab':
        this.close();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        this.moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ': {
        if (event.key === ' ' && typing) break; // a space in the search box is just a space
        const option = this.shownOptions()[this.highlightedIndex()];
        if (option) {
          event.preventDefault();
          this.select(option);
        } else if (event.key === 'Enter') {
          event.preventDefault();
        }
        break;
      }
    }
  }

  private moveHighlight(step: 1 | -1): void {
    const count = this.shownOptions().length;
    if (!count) return;
    const current = this.highlightedIndex();
    this.highlightedIndex.set(current < 0 ? (step === 1 ? 0 : count - 1) : (current + step + count) % count);
    this.list()?.nativeElement
      .querySelector(`[data-index="${this.highlightedIndex()}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }

  protected position(): void {
    const list = this.list()?.nativeElement;
    if (!this.isOpen() || !list) return;
    if (this.overlay()) {
      if (!list.matches(':popover-open')) {
        list.showPopover();
        document.addEventListener('scroll', this.onScroll, true);
      }
      // Fix the width before it is measured: the CSS min-width (100%) would otherwise mean the whole viewport here.
      list.style.minWidth = `max(${this.host.nativeElement.getBoundingClientRect().width}px, 12rem)`;
      list.style.maxWidth = `min(${this.optionsStyle()['maxWidth'] ?? '24rem'}, ${document.documentElement.clientWidth - 16}px)`;
    }
    // The list has its own 0.25rem margin, so no extra gap.
    const style = placePopup(this.host.nativeElement, list, { align: 'start', gap: 0, direction: this.forceDirection() });
    this.popupStyle.set(this.overlay() ? this.toViewport(style) : style);
  }

  /** `placePopup` positions relative to the trigger. On the top layer the list is `fixed`, so convert to viewport coordinates. */
  private toViewport(style: Record<string, string>): Record<string, string> {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;
    const result: Record<string, string> = {
      ...style,
      left: `${rect.left + parseFloat(style['left'])}px`,
      // The CSS min-width is `max(100%, 12rem)`, but 100% of a fixed element is the whole viewport.
      minWidth: `max(${rect.width}px, 12rem)`
    };
    if (style['top'] !== 'auto') result['top'] = `${rect.top + parseFloat(style['top'])}px`;
    if (style['bottom'] !== 'auto') result['bottom'] = `${viewportHeight - rect.bottom + parseFloat(style['bottom'])}px`;
    return result;
  }
}
