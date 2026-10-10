import {
  afterNextRender, Directive, effect, ElementRef, inject, Injector, input, model, OnDestroy, output, untracked, viewChild
} from '@angular/core';
import { booleanAttribute } from '@angular/core';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/** Overlays that are currently open, the last one is on top. */
const stack: HTMLElement[] = [];
let scrollLocks = 0;
let savedBody: { overflow: string; paddingRight: string } | null = null;

/** Focusable, visible elements inside `root`, in tab order. */
export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    element => !element.closest('[inert]') && element.getClientRects().length > 0
  );
}

/** True when `overlay` is the top-most open dialog (so Escape only closes that one). */
export function isTopDialog(overlay: HTMLElement | undefined): boolean {
  return !!overlay && stack[stack.length - 1] === overlay;
}

/**
 * Makes `overlay` a real modal layer without the native <dialog> element:
 * it is moved to the end of <body> (so no parent can clip or transform it), everything else on the page
 * becomes `inert` (unreachable by keyboard, mouse and screen readers), and page scrolling is locked.
 * Returns a function that undoes all of it and gives the focus back to `previousFocus`.
 */
export function activateDialog(overlay: HTMLElement, previousFocus: HTMLElement | null): () => void {
  document.body.appendChild(overlay);

  const inerted: HTMLElement[] = [];
  for (const child of Array.from(document.body.children) as HTMLElement[]) {
    if (child === overlay || child.hasAttribute('inert') || ['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) continue;
    child.setAttribute('inert', '');
    inerted.push(child);
  }

  if (scrollLocks++ === 0) {
    const body = document.body;
    savedBody = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    // Keep the page from jumping sideways when the scrollbar disappears.
    if (scrollbar > 0) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + scrollbar}px`;
  }
  stack.push(overlay);

  return () => {
    stack.splice(stack.indexOf(overlay), 1);
    inerted.forEach(element => element.removeAttribute('inert'));
    if (--scrollLocks === 0 && savedBody) {
      document.body.style.overflow = savedBody.overflow;
      document.body.style.paddingRight = savedBody.paddingRight;
      savedBody = null;
    }
    if (previousFocus?.isConnected) previousFocus.focus();
  };
}

/** Moves the focus into a freshly opened dialog: `[data-autofocus]`, else the first control in the body, else the dialog. */
export function focusInitial(dialog: HTMLElement, body?: HTMLElement): void {
  const target =
    dialog.querySelector<HTMLElement>('[data-autofocus]') ??
    (body ? focusableIn(body)[0] : undefined) ??
    focusableIn(dialog)[0] ??
    dialog;
  target.focus({ preventScroll: true });
}

/** Keeps Tab and Shift+Tab inside the dialog. */
export function trapTab(event: KeyboardEvent, dialog: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const items = focusableIn(dialog);
  if (items.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export type DialogCloseReason = 'close' | 'confirm' | 'escape' | 'backdrop' | 'api';

let nextId = 0;

/**
 * Behavior shared by the modal and the side drawer. The template must have the references
 * `#overlay` (the full-screen layer), `#dialog` (the panel) and `#body` (the scrolling content).
 */
@Directive()
export abstract class DialogBase implements OnDestroy {
  private readonly injector = inject(Injector);

  /** Whether it is shown. Supports two-way binding: `[(open)]`. */
  readonly open = model(false);
  /** Visible title. It names the dialog for screen readers. */
  readonly heading = input('');
  /** Accessible name when there is no visible heading. */
  readonly ariaLabel = input('');
  /** Id(s) of elements that describe the dialog. For `alertdialog` the body is used when this is empty. */
  readonly ariaDescribedby = input('');
  /** Use 'alertdialog' for urgent messages that need a response, such as destructive confirmations. */
  readonly role = input<'dialog' | 'alertdialog'>('dialog');
  readonly closeButton = input(true, { transform: booleanAttribute });
  /** Accessible name of the close button (translate it for other languages). */
  readonly closeLabel = input('Close');
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly dialogClass = input('');
  readonly dialogStyle = input<Record<string, string>>({});
  /** Emits when it closes, with what closed it. */
  readonly closed = output<DialogCloseReason>();

  private readonly uid = nextId++;
  protected readonly headingId = `dialog-heading-${this.uid}`;
  protected readonly bodyId = `dialog-body-${this.uid}`;

  private readonly overlayRef = viewChild<ElementRef<HTMLElement>>('overlay');
  protected readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly bodyRef = viewChild<ElementRef<HTMLElement>>('body');

  private release?: () => void;
  private pressedOnBackdrop = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      untracked(() => (isOpen ? this.activate() : this.deactivate()));
    });
  }

  ngOnDestroy(): void {
    this.deactivate();
  }

  show(): void {
    this.open.set(true);
  }

  hide(reason: DialogCloseReason = 'api'): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit(reason);
  }

  toggle(): void {
    if (this.open()) this.hide();
    else this.show();
  }

  private activate(): void {
    if (this.release) return;
    // Remember who had the focus (the button that opened it), to give it back on close.
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    afterNextRender(() => {
      const overlay = this.overlayRef()?.nativeElement;
      const dialog = this.dialogRef()?.nativeElement;
      if (!overlay || !dialog || !this.open() || this.release) return;
      this.release = activateDialog(overlay, previous);
      focusInitial(dialog, this.bodyRef()?.nativeElement);
    }, { injector: this.injector });
  }

  private deactivate(): void {
    this.release?.();
    this.release = undefined;
  }

  protected onEscape(event: Event): void {
    if (event.defaultPrevented || !this.open() || !this.closeOnEscape() || !isTopDialog(this.overlayRef()?.nativeElement)) return;
    this.hide('escape');
  }

  protected onKeydown(event: KeyboardEvent): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog) trapTab(event, dialog);
  }

  // Only a click that started AND ended on the backdrop closes it, so dragging a text selection out of the panel doesn't.
  protected onBackdropDown(event: MouseEvent): void {
    this.pressedOnBackdrop = event.target === event.currentTarget;
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.pressedOnBackdrop && event.target === event.currentTarget && this.closeOnBackdrop()) this.hide('backdrop');
    this.pressedOnBackdrop = false;
  }
}
