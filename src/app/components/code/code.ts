import { booleanAttribute, Component, ElementRef, input, signal, viewChild } from '@angular/core';

/** App-level (not ncss) helper for showing code: inline by default, a block with the `block` attribute. */
@Component({
  selector: 'app-code',
  template: `<span #content><ng-content /></span>@if (block()) {
    <button type="button" class="copy" (click)="copy()" [attr.aria-label]="copied() ? 'Copied' : 'Copy code'">
      {{ copied() ? 'Copied' : 'Copy' }}
    </button>
  }`,
  styles: `
    :host {
      font-family: ui-monospace, Consolas, monospace;
      font-size: 0.875em;
      background: color-mix(in oklab, var(--gray-700) 10%, transparent);
      padding: 0.1em 0.35em;
      border-radius: 4px;
    }

    :host(.block) {
      position: relative;
      display: block;
      white-space: pre;
      overflow-x: auto;
      padding: 1.1rem 1.25rem;
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--gray-400);
      border-radius: var(--border-radius);
      background: color-mix(in oklab, var(--gray-700) 7%, transparent);
      font-size: 0.8125rem;
      line-height: 1.6;
      font-weight: 400;
    }

    .copy {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.2rem 0.6rem;
      border: 1px solid var(--border-color);
      border-radius: 999px;
      background: var(--card-light-bg, transparent);
      color: var(--gray-600);
      font: 700 0.7rem/1.4 var(--font, inherit);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s;
    }

    :host(.block:hover) .copy,
    .copy:focus-visible {
      opacity: 1;
    }

    .copy:hover {
      color: var(--gray-900);
    }

    @media (hover: none) {
      .copy {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .copy {
        transition: none;
      }
    }
  `,
  host: { '[class.block]': 'block()' }
})
export class Code {
  readonly block = input(false, { transform: booleanAttribute });

  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.content().nativeElement.textContent ?? '');
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // clipboard unavailable (insecure context): nothing to do
    }
  }
}
