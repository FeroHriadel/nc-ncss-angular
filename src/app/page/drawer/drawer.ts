import { Component, signal } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, DialogCloseReason, DrawerSide, SideDrawer } from '../../ncss';

@Component({
  selector: 'app-drawer-page',
  imports: [SideDrawer, Button, Code],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css'
})
export class DrawerPage {
  protected readonly drawerOpen = signal(false);
  protected readonly drawerSide = signal<DrawerSide>('right');
  protected readonly sides: DrawerSide[] = ['right', 'left', 'top', 'bottom'];
  protected readonly log = signal('Nothing happened yet.');

  protected openDrawer(side: DrawerSide): void {
    this.drawerSide.set(side);
    this.drawerOpen.set(true);
  }

  protected onClosed(name: string, reason: DialogCloseReason): void {
    this.log.set(`${name} closed (${reason})`);
  }

  protected readonly dialogInputs = [
    { name: 'open', values: 'boolean', default: 'false', note: 'Whether it is shown. Two-way: [(open)].' },
    { name: 'heading', values: 'string', default: "''", note: 'Visible title. It names the dialog for screen readers.' },
    { name: 'ariaLabel', values: 'string', default: "''", note: 'Name to use when there is no visible heading.' },
    { name: 'ariaDescribedby', values: 'string', default: "''", note: 'Id(s) of elements that describe it.' },
    { name: 'role', values: "'dialog' | 'alertdialog'", default: "'dialog'", note: 'Use alertdialog for urgent messages that need an answer.' },
    { name: 'closeButton', values: 'boolean', default: 'true', note: 'Shows the X button.' },
    { name: 'closeLabel', values: 'string', default: "'Close'", note: 'Accessible name of the X button (translate it).' },
    { name: 'closeOnBackdrop / closeOnEscape', values: 'boolean', default: 'true', note: 'Close when the backdrop is clicked or Escape is pressed.' },
    { name: 'dialogClass / dialogStyle', values: 'string / object', default: "''", note: 'Class and style for the panel itself.' },
    { name: '(closed)', values: 'DialogCloseReason', default: '', note: "Emits what closed it: 'close', 'confirm', 'escape', 'backdrop' or 'api'." },
  ];

  protected readonly drawerInputs = [
    { name: 'side', values: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", note: 'Which edge it slides from.' },
    { name: 'size', values: 'string', default: "''", note: 'Width of left and right drawers, height of top and bottom ones. The default is --drawer-size (24rem) or --drawer-size-vertical.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component, signal } from '@angular/core';
import { Button, SideDrawer } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [SideDrawer, Button],
  templateUrl: './my-page.html'
})
export class MyPage {
  open = signal(false);
}`;

  protected readonly drawerCode = `<button nc-button (click)="open.set(true)">Filters</button>

<nc-sidedrawer [(open)]="open" heading="Filters" side="left" size="28rem">
  ...
  <button nc-button slot="footer" (click)="open.set(false)">Apply</button>
</nc-sidedrawer>

<!-- Or drive it from code: drawer.show(), drawer.hide(), drawer.toggle() -->`;

  protected readonly classStyleCode = `<nc-sidedrawer [(open)]="open" dialogClass="my-drawer" [dialogStyle]="{ maxWidth: '90vw' }">...</nc-sidedrawer>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --drawer-size: 30rem;
    --popup-padding: 2rem;
    --popup-overlay-bg: oklch(0% 0 0 / 0.6);
}`;

  protected readonly variablesList = `--popup-bg / -border / -shadow / -backdrop / -padding / -z-index
--popup-overlay-bg / -overlay-blur
--drawer-size / --drawer-size-vertical`;
}
