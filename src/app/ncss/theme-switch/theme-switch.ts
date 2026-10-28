import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, input, signal, untracked, viewChild } from '@angular/core';
import { Button, ButtonSize, ButtonVariant } from '../buttons/button';
import { PalleteIcon } from '../icons';
import { Theme, ThemeService } from '../services/theme.service';
import { placePopup } from '../utils/place-popup';

let nextId = 0;

@Component({
  selector: 'nc-theme-switch',
  imports: [Button, PalleteIcon],
  templateUrl: './theme-switch.html',
  styleUrl: './theme-switch.css',
  host: {
    class: 'theme-switch',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'onEscape()',
    '(focusout)': 'onFocusOut($event)',
    '(window:resize)': 'place()'
  }
})
export class ThemeSwitch {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly service = inject(ThemeService);

  /** The themes to offer, in this order, or 'all'. Unknown names are ignored. */
  readonly themes = input<Theme[] | 'all'>('all');
  /** Accessible name of the button and the group (translate it). The current theme is added to the button's name. */
  readonly label = input('Theme');
  /** Display names. Defaults to the theme name, e.g. "Neumorphic light". */
  readonly labels = input<Partial<Record<Theme, string>>>({});
  /** The theme to start with, for people who have not chosen one yet. Their own choice always wins. */
  readonly defaultTheme = input<Theme>('light', { alias: 'default' });
  /** Which edge of the button the list lines up with. */
  readonly align = input<'start' | 'end'>('end');
  readonly variant = input<ButtonVariant>('ghost');
  readonly size = input<ButtonSize>('medium');

  protected readonly current = this.service.theme;
  protected readonly open = signal(false);
  /** Inline position of the list, worked out so it always stays on screen. */
  protected readonly panelStyle = signal<Record<string, string>>({ visibility: 'hidden' });

  private readonly uid = nextId++;
  protected readonly panelId = `theme-switch-panel-${this.uid}`;
  protected readonly groupName = `theme-switch-${this.uid}`;
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly available = computed<Theme[]>(() => {
    const wanted = this.themes();
    return wanted === 'all' ? [...this.service.themes] : wanted.filter(theme => this.service.themes.includes(theme));
  });

  protected labelOf(theme: Theme): string {
    const custom = this.labels()[theme];
    if (custom) return custom;
    const text = theme.replace(/-/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  constructor() {
    effect(() => {
      const theme = this.defaultTheme();
      untracked(() => this.service.useDefault(theme));
    });
  }

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.panelStyle.set({ visibility: 'hidden' });
    this.open.set(true);
    // Once rendered: position the list inside the screen, then put the focus on the current theme (or the first one).
    afterNextRender(() => {
      this.place();
      const radios = this.panel()?.nativeElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
      (Array.from(radios ?? []).find(radio => radio.checked) ?? radios?.[0])?.focus({ preventScroll: true });
    }, { injector: this.injector });
  }

  protected place(): void {
    const panel = this.panel()?.nativeElement;
    if (this.open() && panel) this.panelStyle.set(placePopup(this.host.nativeElement, panel, { align: this.align() }));
  }

  close(): void {
    this.open.set(false);
  }

  protected select(theme: Theme): void {
    this.service.setTheme(theme);
  }

  /** A mouse click picks the theme and closes the list. Keyboard use (arrows) keeps it open. */
  protected onOptionClick(event: MouseEvent, theme: Theme): void {
    if (event.detail === 0) return;
    this.select(theme);
    this.close();
    this.trigger()?.nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onEscape(): void {
    if (!this.open()) return;
    this.close();
    this.trigger()?.nativeElement.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() && next && !this.host.nativeElement.contains(next)) this.close();
  }
}
