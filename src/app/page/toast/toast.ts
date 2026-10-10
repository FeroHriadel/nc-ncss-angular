import { Component, inject } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, ToastService, ToastType } from '../../ncss';

@Component({
  selector: 'app-toast-page',
  imports: [Button, Code],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastPage {
  private readonly toast = inject(ToastService);

  protected readonly types: ToastType[] = ['info', 'warning', 'error'];

  protected showString(): void {
    this.toast.show('Changes saved');
  }

  protected showType(type: ToastType): void {
    this.toast.show({
      title: type[0].toUpperCase() + type.slice(1),
      text: `This is a ${type} toast.`,
      type
    });
  }

  protected showLong(): void {
    this.toast.show({ text: 'This one stays for 8 seconds. Click it to dismiss it sooner.', duration: 8000 });
  }

  protected readonly inputs = [
    { name: 'text', values: 'string', default: 'required', note: 'The message.' },
    { name: 'title', values: 'string', default: '', note: 'Bold line above the text.' },
    { name: 'duration', values: 'number (ms)', default: '3000', note: 'How long it stays before closing on its own.' },
    { name: 'type', values: "'info' | 'warning' | 'error'", default: "'info'", note: 'Color of the accent stripe. Errors are announced to screen readers right away.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, inject } from '@angular/core';
import { ToastService } from '../../ncss';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.html'
})
export class MyPage {
  private toast = inject(ToastService);
}`;

  protected readonly stringCode = `// A plain string: an info toast that closes after 3 seconds
this.toast.show('Changes saved');`;

  protected readonly objectCode = `this.toast.show({
  title: 'Upload failed',
  text: 'The file is larger than 10 MB.',
  type: 'error',        // 'info' (default) | 'warning' | 'error'
  duration: 5000        // ms, default 3000
});`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --toast-width: 26rem;
    --toast-warning-accent: orange;
    --toast-offset: 2rem;
}`;

  protected readonly variablesList = `--toast-bg / -text / -border / -shadow / -backdrop
--toast-width / -gap / -offset / -z-index
--toast-info-accent / -warning-accent / -error-accent`;
}
