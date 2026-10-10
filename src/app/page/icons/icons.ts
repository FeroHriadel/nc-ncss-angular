import { NgComponentOutlet } from '@angular/common';
import { Component, computed, signal, Type } from '@angular/core';
import { Code } from '../../components/code/code';
import * as ncssIcons from '../../ncss/icons';
import { Button, Card, CheckIcon, EyeIcon, HamburgerIcon, PlusIcon, SettingsIcon, TimesIcon, UploadIcon, WarningIcon } from '../../ncss';

interface IconEntry {
  name: string;
  tag: string;
  component: Type<unknown>;
}

@Component({
  selector: 'app-icons-page',
  imports: [NgComponentOutlet, Code, Button, Card, CheckIcon, EyeIcon, HamburgerIcon, PlusIcon, SettingsIcon, TimesIcon, UploadIcon, WarningIcon],
  templateUrl: './icons.html',
  styleUrl: './icons.css'
})
export class IconsPage {
  /** Every exported icon, found from the barrel file so new icons show up here automatically. */
  protected readonly icons: IconEntry[] = Object.entries(ncssIcons)
    .map(([name, component]) => ({
      name,
      tag: 'nc-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
      component: component as Type<unknown>
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  protected readonly query = signal('');
  protected readonly shown = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? this.icons.filter(icon => icon.tag.includes(query)) : this.icons;
  });

  protected readonly sizes = [16, 24, 32, 48];

  protected readonly inputs = [
    { name: 'size', values: 'number', default: '24', note: 'Width and height in pixels.' },
    { name: 'color', values: 'string', default: "'currentColor'", note: 'Any CSS color. The default follows the text color, so icons match every theme.' },
    { name: 'class', values: 'string', default: "''", note: 'CSS class on the inner svg element.' },
    { name: 'id', values: 'string', default: "''", note: 'Id on the inner svg element.' },
    { name: 'style', values: 'object', default: '{}', note: "Inline styles on the svg, e.g. { opacity: '0.5' }." },
  ];

  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { EyeIcon, PlusIcon } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [EyeIcon, PlusIcon],
  templateUrl: './my-page.html'
})
export class MyPage {}`;

  protected readonly usageCode = `<nc-eye-icon />
<nc-eye-icon [size]="32" />
<nc-eye-icon color="crimson" />
<nc-eye-icon class="my-icon" [style]="{ opacity: '0.5' }" />`;

  protected readonly buttonCode = `<!-- Icon next to a label -->
<button nc-button><nc-plus-icon [size]="16" /> Add</button>

<!-- Icon-only button: the button needs a name, the icon is already hidden from screen readers -->
<button nc-button square variant="outline" aria-label="Settings">
  <nc-settings-icon [size]="16" />
</button>`;

  protected readonly accessibilityCode = `<!-- Decorative (the default, next to text): nothing to add -->
<nc-warning-icon /> Disk almost full

<!-- Meaningful on its own: give the icon element a role and a name -->
<nc-warning-icon role="img" aria-label="Warning" />`;

  protected readonly colorCode = `/* Icons use currentColor, so setting the text color recolors them */
.danger { color: var(--red-600); }

<span class="danger"><nc-warning-icon /> Careful</span>`;
}
