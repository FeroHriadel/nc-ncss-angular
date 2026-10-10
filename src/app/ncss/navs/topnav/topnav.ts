import { afterNextRender, Component, ElementRef, inject, Injector, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../../buttons/button';
import { placePopup } from '../../utils/place-popup';

export interface NavChild {
  label: string;
  link: string;
}

export interface NavLink {
  label: string;
  /** Route of a simple link. Leave it out when the item has `children`. */
  link?: string;
  /** Mark the link as current only when the URL matches exactly (use it for '/'). */
  exact?: boolean;
  /** Turns the item into a dropdown of links. */
  children?: NavChild[];
}

let nextId = 0;

@Component({
  selector: 'nc-topnav',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './topnav.html',
  host: {
    class: 'topnav',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'onEscape()',
    '(focusout)': 'onFocusOut($event)',
    '(window:resize)': 'placeMenu()'
  }
})
export class TopNav {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly links = input<NavLink[]>([]);
  /** Name of the navigation landmark. Change it if a page has more than one navigation. */
  readonly ariaLabel = input('Main');
  /** Accessible name of the button that opens the links on narrow screens (translate it). */
  readonly menuLabel = input('Menu');

  protected readonly openIndex = signal<number | null>(null);
  protected readonly mobileOpen = signal(false);
  /** Inline position of the open dropdown, worked out so it always stays on screen. */
  protected readonly menuStyle = signal<Record<string, string>>({ visibility: 'hidden' });

  private readonly uid = `topnav-${nextId++}`;
  protected readonly mobileId = `${this.uid}-mobile`;

  protected menuId(index: number): string {
    return `${this.uid}-menu-${index}`;
  }

  protected toggleMenu(index: number): void {
    this.mobileOpen.set(false);
    const opening = this.openIndex() !== index;
    this.openIndex.set(opening ? index : null);
    if (!opening) return;
    this.menuStyle.set({ visibility: 'hidden' });
    afterNextRender(() => this.placeMenu(), { injector: this.injector });
  }

  /** Keeps the open dropdown on screen: it flips, shifts and scrolls as needed. */
  protected placeMenu(): void {
    const menu = this.host.nativeElement.querySelector<HTMLElement>('.topnav-menu');
    const anchor = menu?.parentElement;
    if (menu && anchor) this.menuStyle.set(placePopup(anchor, menu, { align: 'end' }));
  }

  protected toggleMobile(): void {
    this.openIndex.set(null);
    this.mobileOpen.update(open => !open);
  }

  /** Closes every open dropdown and the mobile panel. */
  close(): void {
    this.openIndex.set(null);
    this.mobileOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onEscape(): void {
    // Give the focus back to the button that opened the menu, so keyboard users don't lose their place.
    const opener = this.host.nativeElement.querySelector<HTMLElement>('[aria-expanded="true"]');
    this.close();
    opener?.focus();
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && !this.host.nativeElement.contains(next)) this.close();
  }
}
