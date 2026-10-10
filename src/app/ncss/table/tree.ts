import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender, Component, DestroyRef, effect, ElementRef, inject, Injector, input, model, signal, untracked, viewChild
} from '@angular/core';

let nextId = 0;

interface TreeEntry {
  key: string;
  value: unknown;
  path: string;
}

/**
 * Shows an object or array as a small button that opens a floating, expandable tree.
 *
 * Nested objects and arrays have a triangle that expands them. The panel floats over the page (it never makes
 * its parent, e.g. a table cell, bigger), and closes on Esc, on a click outside, and when something scrolls.
 */
@Component({
  selector: 'nc-tree',
  imports: [NgTemplateOutlet],
  templateUrl: './tree.html',
  host: {
    class: 'tree',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'onEscape($event)',
    '(window:resize)': 'close()'
  }
})
export class Tree {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  /** The object or array to show. Other values are shown as plain text. */
  readonly value = input<unknown>(null);
  /** Text of the button. Default: a summary like `{ 3 keys }`. */
  readonly label = input('');
  /** Accessible name of the floating panel. */
  readonly ariaLabel = input('Details');
  /** Whether the panel is open. Supports two-way binding: `[(open)]`. */
  readonly open = model(false);

  protected readonly panelId = `tree-panel-${nextId++}`;
  protected readonly placement = signal<Record<string, string>>({ visibility: 'hidden' });
  protected readonly expanded = signal<ReadonlySet<string>>(new Set());
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  private readonly onScroll = (event: Event): void => {
    if (!this.panel()?.nativeElement.contains(event.target as Node)) this.close();
  };

  constructor() {
    effect(() => {
      if (this.open()) {
        untracked(() => {
          this.placement.set({ visibility: 'hidden' });
          afterNextRender(() => this.show(), { injector: this.injector });
        });
      } else {
        untracked(() => document.removeEventListener('scroll', this.onScroll, true));
      }
    });
    inject(DestroyRef).onDestroy(() => document.removeEventListener('scroll', this.onScroll, true));
  }

  toggle(): void {
    this.open.update(open => !open);
  }

  close(): void {
    if (this.open()) this.open.set(false);
  }

  protected isBranch(value: unknown): boolean {
    return value !== null && typeof value === 'object' && !(value instanceof Date);
  }

  protected summary(value: unknown): string {
    if (Array.isArray(value)) return `[ ${value.length} ${value.length === 1 ? 'item' : 'items'} ]`;
    const count = Object.keys(value as object).length;
    return `{ ${count} ${count === 1 ? 'key' : 'keys'} }`;
  }

  protected entries(node: unknown, path: string): TreeEntry[] {
    const record = node as Record<string, unknown>;
    return Object.keys(record).map(key => ({ key, value: record[key], path: `${path}/${key}` }));
  }

  protected leaf(value: unknown): string {
    if (typeof value === 'string') return JSON.stringify(value);
    if (value instanceof Date) return value.toISOString();
    return String(value);
  }

  protected leafKind(value: unknown): string {
    return value === null || value === undefined ? 'null' : typeof value;
  }

  protected isExpanded(path: string): boolean {
    return this.expanded().has(path);
  }

  protected toggleNode(path: string): void {
    this.expanded.update(set => {
      const next = new Set(set);
      if (!next.delete(path)) next.add(path);
      return next;
    });
  }

  /** Puts the panel on the top layer (so no parent can clip it) and places it next to the button. */
  private show(): void {
    const panel = this.panel()?.nativeElement;
    const trigger = this.trigger()?.nativeElement;
    if (!panel || !trigger) return;
    try {
      panel.showPopover?.();
    } catch {
      // Already open or unsupported: the fixed positioning below still works.
    }
    const margin = 8;
    const gap = 4;
    const rect = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const below = viewportHeight - rect.bottom - margin - gap;
    const above = rect.top - margin - gap;
    const down = height <= below || below >= above;
    const room = Math.max(down ? below : above, 0);
    this.placement.set({
      visibility: 'visible',
      left: `${Math.max(margin, Math.min(rect.left, viewportWidth - margin - width))}px`,
      top: `${down ? rect.bottom + gap : Math.max(margin, rect.top - gap - Math.min(height, room))}px`,
      maxHeight: `min(${room}px, 70vh)`
    });
    document.addEventListener('scroll', this.onScroll, true);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  protected onEscape(event: Event): void {
    if (!this.open()) return;
    event.stopPropagation();
    this.close();
    this.trigger()?.nativeElement.focus();
  }
}
