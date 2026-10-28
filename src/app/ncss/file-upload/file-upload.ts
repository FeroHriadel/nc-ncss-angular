import {
  booleanAttribute, Component, computed, effect, ElementRef, inject, input, model, output, signal, viewChild
} from '@angular/core';
import { Button } from '../buttons/button';

export interface FileRejection {
  file: File;
  reason: 'type' | 'size';
}

let nextId = 0;

@Component({
  selector: 'nc-file-upload',
  imports: [Button],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  host: {
    class: 'file-upload',
    '[class.file-upload-disabled]': 'disabled()',
    '[class.file-upload-invalid]': 'invalid()',
    '[class.file-upload-dragging]': 'dragging()',
    '(dragenter)': 'onDrag($event, true)',
    '(dragleave)': 'onDrag($event, false)',
    '(drop)': 'dragging.set(false)'
  }
})
export class FileUpload {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The selected files, always an array (also for a single file). Supports two-way binding: `[(files)]`.
   *  Setting it to `[]` clears the field. Files can only be added by the user. */
  readonly files = model<File[]>([]);
  /** Emits the files that were refused (wrong type or too big). They are never added to `files`. */
  readonly rejected = output<FileRejection[]>();

  readonly placeholder = input('');
  /** Same syntax as the native attribute: ".pdf,.docx", "image/*", "image/png,application/pdf". */
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Sets aria-invalid and shows the error border. */
  readonly invalid = input(false, { transform: booleanAttribute });
  /** Largest allowed file size in bytes. */
  readonly maxSize = input<number>();
  readonly name = input('');
  /** Id of the inner input, so an external `<label for="...">` can point at it. Generated when empty. */
  readonly inputId = input('');
  /** Accessible name when there is no <label>. */
  readonly ariaLabel = input('');
  /** Id(s) of elements that describe the field, e.g. a hint or an error message. */
  readonly ariaDescribedby = input('');
  /** Accessible name of the clear button (translate it for other languages). */
  readonly clearLabel = input('Clear selection');
  readonly inputClass = input('');
  readonly inputStyle = input<Record<string, string>>({});

  protected readonly dragging = signal(false);
  /** Text for the screen reader live region. */
  protected readonly status = signal('');

  private readonly generatedId = `file-upload-${nextId++}`;
  protected readonly id = computed(() => this.inputId() || this.generatedId);
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  protected readonly text = computed(() => {
    const files = this.files();
    if (files.length === 0) return this.placeholder() || (this.multiple() ? 'Choose files' : 'Choose a file');
    return files.length === 1 ? files[0].name : `${files.length} files selected`;
  });

  protected readonly title = computed(() => this.files().map(file => file.name).join(', ') || null);

  constructor() {
    // Keep the native input in sync when the parent clears `files`.
    effect(() => {
      const input = this.box()?.nativeElement;
      if (input && this.files().length === 0 && input.files?.length) input.value = '';
    });
  }

  protected onChange(): void {
    const input = this.box()!.nativeElement;
    const picked = Array.from(input.files ?? []);

    // Cancelling the dialog empties the native input in most browsers.
    if (picked.length === 0) {
      this.files.set([]);
      this.status.set('No file selected');
      return;
    }

    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    for (const file of picked) {
      const reason = this.rejectionOf(file);
      if (reason) rejected.push({ file, reason });
      else accepted.push(file);
    }

    if (rejected.length) {
      // Make the native input (and so any form submit) match what we accepted.
      const transfer = new DataTransfer();
      accepted.forEach(file => transfer.items.add(file));
      input.files = transfer.files;
      this.rejected.emit(rejected);
    }

    this.files.set(accepted);
    const selected = accepted.length === 1 ? `${accepted[0].name} selected` : accepted.length ? `${accepted.length} files selected` : '';
    const refused = rejected.length ? `${rejected.length} ${rejected.length === 1 ? 'file' : 'files'} rejected` : '';
    this.status.set([selected, refused].filter(Boolean).join('. '));
  }

  clear(): void {
    const input = this.box()?.nativeElement;
    if (input) input.value = '';
    this.files.set([]);
    this.status.set('Selection cleared');
    input?.focus();
  }

  /** Opens the file dialog from code. */
  open(): void {
    this.box()?.nativeElement.click();
  }

  protected onDrag(event: DragEvent, entering: boolean): void {
    if (this.disabled() || !event.dataTransfer?.types.includes('Files')) return;
    // dragleave also fires when moving over a child, only react when really leaving.
    if (!entering && this.host.nativeElement.contains(event.relatedTarget as Node | null)) return;
    this.dragging.set(entering);
  }

  private rejectionOf(file: File): FileRejection['reason'] | null {
    const maxSize = this.maxSize();
    if (maxSize != null && file.size > maxSize) return 'size';
    return this.matchesAccept(file) ? null : 'type';
  }

  private matchesAccept(file: File): boolean {
    const tokens = this.accept().split(',').map(token => token.trim().toLowerCase()).filter(Boolean);
    if (tokens.length === 0) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return tokens.some(token =>
      token.startsWith('.') ? name.endsWith(token) : token.endsWith('/*') ? type.startsWith(token.slice(0, -1)) : type === token
    );
  }
}
