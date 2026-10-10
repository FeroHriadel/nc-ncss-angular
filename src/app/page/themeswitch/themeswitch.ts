import { Component, inject } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, Theme, ThemeService, ThemeSwitch } from '../../ncss';

@Component({
  selector: 'app-theme-switch-page',
  imports: [ThemeSwitch, Button, Code],
  templateUrl: './themeswitch.html',
  styleUrl: './themeswitch.css'
})
export class ThemeSwitchPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly lightDark: Theme[] = ['light', 'dark'];
  protected readonly labels = { light: 'Day', dark: 'Night' };

  protected readonly inputs = [
    { name: 'themes', values: "Theme[] | 'all'", default: "'all'", note: 'The themes to offer, in this order. Unknown names are ignored.' },
    { name: 'default', values: 'Theme', default: "'light'", note: 'The theme to start with, for people who have not chosen one yet. Once they pick a theme, their choice is remembered and wins.' },
    { name: 'label', values: 'string', default: "'Theme'", note: "Accessible name of the button and the list (translate it). The current theme is added to the button's name." },
    { name: 'labels', values: 'Partial<Record<Theme, string>>', default: '{}', note: 'Display names, e.g. { light: "Day" }. Defaults to the theme name.' },
    { name: 'align', values: "'start' | 'end'", default: "'end'", note: 'Which edge of the button the list lines up with.' },
    { name: 'variant', values: "'dark' | 'red' | 'outline' | 'ghost'", default: "'ghost'", note: 'Button variant.' },
    { name: 'size', values: "'small' | 'medium' | 'large'", default: "'medium'", note: 'Button size.' },
  ];

  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { ThemeSwitch } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [ThemeSwitch],
  templateUrl: './my-page.html'
})
export class MyPage {}`;

  protected readonly usageCode = `<nc-theme-switch />
<nc-theme-switch [themes]="['light', 'dark']" />
<nc-theme-switch [themes]="['dark', 'light']" [labels]="{ light: 'Day', dark: 'Night' }" align="start" />
<nc-theme-switch variant="outline" size="large" />
<nc-theme-switch default="dark" />   <!-- first visit: dark -->`;

  protected readonly serviceCode = `// The switch is just a UI on top of ThemeService. Use the service directly for anything else.
import { inject } from '@angular/core';
import { ThemeService } from '../../ncss';

const themes = inject(ThemeService);

themes.theme();            // the current theme, as a signal: 'light' | 'dark' | 'glass' | ...
themes.themes;             // every available theme
themes.setTheme('dark');   // applies it (data-theme on <html>) and remembers it in localStorage
themes.useDefault('dark'); // the same, but only if the user has not chosen anything yet, and it is not remembered`;

  protected readonly classStyleCode = `<!-- class and [style] go on nc-theme-switch itself -->
<nc-theme-switch class="my-switch" [style]="{ marginLeft: 'auto' }" />`;

  protected readonly variablesCode = `/* The list uses the select variables, the radio dots use the checkbox variables */
:root {
    --select-options-bg: var(--gray-0);
    --select-option-hover-bg: var(--gray-200);
    --checkbox-checked-bg: var(--red-700);
}`;

  protected readonly variablesList = `--select-options-bg / -options-border / -options-shadow
--select-option-hover-bg / -option-hover-shadow / -option-height
--checkbox-bg / -border / -shadow
--checkbox-checked-bg / -checked-shadow / -check-color`;
}
