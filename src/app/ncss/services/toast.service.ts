import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export type ToastType = 'info' | 'error' | 'warning';

export interface ToastOptions {
  title?: string;
  text: string;
  /** Milliseconds before the toast closes on its own. Defaults to 3000. */
  duration?: number;
  /** Defaults to 'info'. */
  type?: ToastType;
}

const DEFAULT_DURATION = 3000;
const LEAVE_MS = 200;

/**
 * Shows stacked toasts, styled by the active theme (see the `.toast` rules and `--toast-*` tokens in ncss.css).
 *
 *   toast.show('Saved');                                   // info, 3 seconds
 *   toast.show({ title: 'Oops', text: 'Failed', type: 'error', duration: 5000 });
 *
 * Clicking a toast dismisses it.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly document = inject(DOCUMENT);
  private region?: HTMLElement;

  show(options: string | ToastOptions): void {
    const { title, text, duration = DEFAULT_DURATION, type = 'info' } =
      typeof options === 'string' ? ({ text: options } as ToastOptions) : options;

    const el = this.document.createElement('div');
    el.className = `toast toast-${type}`;
    // Errors interrupt screen readers; the rest wait their turn.
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');

    if (title) {
      const titleEl = this.document.createElement('div');
      titleEl.className = 'toast-title';
      titleEl.textContent = title;
      el.appendChild(titleEl);
    }
    const textEl = this.document.createElement('p');
    textEl.className = 'toast-text';
    textEl.textContent = text;
    el.appendChild(textEl);

    const timer = setTimeout(() => this.dismiss(el), duration);
    el.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(el);
    });

    this.getRegion().appendChild(el);
  }

  private dismiss(el: HTMLElement): void {
    if (el.classList.contains('toast-leaving')) return;
    el.classList.add('toast-leaving');
    setTimeout(() => {
      el.remove();
      if (this.region && !this.region.hasChildNodes()) {
        this.region.remove();
        this.region = undefined;
      }
    }, LEAVE_MS);
  }

  private getRegion(): HTMLElement {
    if (!this.region?.isConnected) {
      this.region = this.document.createElement('div');
      this.region.className = 'toast-region';
      this.document.body.appendChild(this.region);
    }
    return this.region;
  }
}
