import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { FileRejection, FileUpload } from '../../ncss';

@Component({
  selector: 'app-file-upload-page',
  imports: [FileUpload, Code],
  templateUrl: './fileupload.html',
  styleUrl: './fileupload.css'
})
export class FileUploadPage {
  protected readonly single = signal<File[]>([]);
  protected readonly images = signal<File[]>([]);
  protected readonly refused = signal<FileRejection[]>([]);
  protected readonly maxSize = 1024 * 1024;

  protected describe(file: File): string {
    return `${file.name} (${file.size < 1024 ? file.size + ' B' : Math.round(file.size / 1024) + ' KB'})`;
  }

  protected reasonOf(rejection: FileRejection): string {
    return rejection.reason === 'size' ? 'too big' : 'wrong type';
  }

  protected readonly inputs = [
    { name: 'files', values: 'File[]', default: '[]', note: 'The selected files, always an array. Two-way: [(files)]. Set it to [] to clear.' },
    { name: 'placeholder', values: 'string', default: "'Choose a file'", note: 'Text shown when nothing is selected.' },
    { name: 'accept', values: 'string', default: "''", note: 'Allowed types: ".pdf,.docx", "image/*", "image/png,application/pdf". Also checked on drop.' },
    { name: 'multiple', values: 'boolean', default: 'false', note: 'Allow several files.' },
    { name: 'maxSize', values: 'number', default: 'none', note: 'Largest allowed file size in bytes.' },
    { name: 'disabled / required', values: 'boolean', default: 'false', note: 'Native attributes.' },
    { name: 'invalid', values: 'boolean', default: 'false', note: 'Sets aria-invalid and shows the error border.' },
    { name: 'name', values: 'string', default: "''", note: 'Passed to the native input, for forms.' },
    { name: 'inputId', values: 'string', default: 'generated', note: 'Id of the inner input, for an external label.' },
    { name: 'ariaLabel / ariaDescribedby', values: 'string', default: "''", note: 'Accessible name without a label, and the id of a hint or error.' },
    { name: 'clearLabel', values: 'string', default: "'Clear selection'", note: 'Accessible name of the clear button (translate it).' },
    { name: 'inputClass / inputStyle', values: 'string / object', default: "''", note: 'Class and style for the native input.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { FileUpload, FileRejection } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [FileUpload],
  templateUrl: './my-page.html'
})
export class MyPage {
  files = signal<File[]>([]);
  onRejected(rejections: FileRejection[]) { /* show a message */ }
}`;

  protected readonly usageCode = `<nc-file-upload ariaLabel="CV" />
<nc-file-upload ariaLabel="Photos" multiple accept="image/*" [(files)]="files" />
<nc-file-upload ariaLabel="Report" accept=".pdf" [maxSize]="1048576" (rejected)="onRejected($event)" />
<nc-file-upload ariaLabel="Disabled" disabled />`;

  protected readonly fieldCode = `<!-- Label, hint and error, linked for screen readers -->
<div class="field">
  <label class="field-label" for="cv">CV</label>
  <nc-file-upload inputId="cv" accept=".pdf" ariaDescribedby="cv-hint" [(files)]="files" />
  <span class="field-hint" id="cv-hint">PDF, up to 1 MB.</span>
</div>`;

  protected readonly bindingCode = `<!-- files is always an array, also for one file -->
<nc-file-upload [(files)]="files" />
<nc-file-upload [files]="files()" (filesChange)="upload($event)" />

<!-- Or drive it from code -->
<nc-file-upload #upload />
<button nc-button (click)="upload.open()">Browse</button>
<button nc-button (click)="upload.clear()">Clear</button>`;

  protected readonly classStyleCode = `<!-- class and [style] go on the nc-file-upload element itself -->
<nc-file-upload class="my-upload" [style]="{ width: '100%' }" ariaLabel="Custom" />`;

  protected readonly variablesCode = `/* It shares the input variables. Override them globally... */
:root {
    --input-width: 24rem;
    --input-bg: var(--gray-0);
}

/* ...or only inside one part of the page */
.upload-panel {
    --input-hover-border-color: var(--gray-600);
}`;

  protected readonly variablesList = `--input-width / -height / -padding-x / -text
--input-bg / -text-color / -placeholder-color
--input-border / -hover-border-color / -shadow
--input-focus-box-shadow / -invalid-border-color
--input-backdrop / -disabled-opacity`;
}
