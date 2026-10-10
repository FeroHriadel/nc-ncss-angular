import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'glass' | 'neumorphic-light' | 'neumorphic-dark';

export const THEMES: readonly Theme[] = ['light', 'dark', 'glass', 'neumorphic-light', 'neumorphic-dark'];

const STORAGE_KEY = 'nc-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _theme = signal<Theme>(this.load());

  /** The current theme (read-only signal). */
  readonly theme = this._theme.asReadonly();
  readonly themes = THEMES;

  constructor() {
    this.apply(this._theme());
  }

  setTheme(theme: Theme): void {
    if (!THEMES.includes(theme)) return;
    this._theme.set(theme);
    this.apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (private mode, SSR): the theme just won't persist
    }
  }

  /**
   * Sets the theme to use until the user picks one: it applies only when nothing was saved yet.
   * It is not saved itself, so changing the default later still takes effect for people who never chose.
   */
  useDefault(theme: Theme): void {
    if (!THEMES.includes(theme) || this.hasSavedChoice()) return;
    this._theme.set(theme);
    this.apply(theme);
  }

  private hasSavedChoice(): boolean {
    try {
      return THEMES.includes(localStorage.getItem(STORAGE_KEY) as Theme);
    } catch {
      return false;
    }
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private load(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && THEMES.includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'light';
  }
}
