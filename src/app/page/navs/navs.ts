import { Component } from '@angular/core';
import { Code } from '../../components/code/code';
import { Button, NavLink, SettingsIcon, TopNav } from '../../ncss';

@Component({
  selector: 'app-navs-page',
  imports: [TopNav, Button, SettingsIcon, Code],
  templateUrl: './navs.html',
  styleUrl: './navs.css'
})
export class NavsPage {
  protected readonly links: NavLink[] = [
    { label: 'Home', link: '/', exact: true },
    {
      label: 'Components',
      children: [
        { label: 'Buttons', link: '/buttons' },
        { label: 'Cards', link: '/cards' },
        { label: 'Checkbox', link: '/checkbox' },
        { label: 'Input', link: '/input' },
        { label: 'Select', link: '/select' },
      ]
    },
    { label: 'Navs', link: '/navs' },
    { label: 'Pills', link: '/pills' },
  ];

  protected readonly inputs = [
    { name: 'links', values: 'NavLink[]', default: '[]', note: 'The items: a simple link, or a dropdown with children.' },
    { name: 'ariaLabel', values: 'string', default: "'Main'", note: 'Name of the navigation landmark. Change it if a page has more than one.' },
    { name: 'menuLabel', values: 'string', default: "'Menu'", note: 'Accessible name of the menu button on narrow navs (translate it).' },
  ];

  protected readonly linkFields = [
    { name: 'label', values: 'string', note: 'Text of the link or dropdown button.' },
    { name: 'link', values: 'string', note: 'Route of a simple link.' },
    { name: 'exact', values: 'boolean', note: "Current only when the URL matches exactly. Use it for '/'." },
    { name: 'children', values: '{ label, link }[]', note: 'Turns the item into a dropdown of links.' },
  ];

  protected readonly importCode = `// app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavLink, TopNav } from './ncss';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNav],
  templateUrl: './app.html'
})
export class App {
  links: NavLink[] = [
    { label: 'Home', link: '/', exact: true },
    { label: 'Docs', children: [
      { label: 'Buttons', link: '/buttons' },
      { label: 'Cards', link: '/cards' },
    ] },
    { label: 'About', link: '/about' },
  ];
}`;

  protected readonly usageCode = `<nc-topnav [links]="links">
  <a slot="logo" routerLink="/" aria-label="Home">My app</a>
  <button slot="custom" nc-button variant="ghost" square aria-label="Settings">...</button>
</nc-topnav>

<main>
  <router-outlet />
</main>`;

  protected readonly slotsCode = `<!-- slot="logo": on the left. Anything: text, an image, a link -->
<a slot="logo" routerLink="/"><img src="logo.svg" alt="My app" height="32" /></a>

<!-- slot="custom": on the right, next to the links. Theme switchers, profile menus, buttons -->
<nc-select slot="custom" ... />`;

  protected readonly classStyleCode = `<!-- class, [style] and id go on nc-topnav itself -->
<nc-topnav class="my-nav" [style]="{ top: '1rem' }" [links]="links" />`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --topnav-height: 3.5rem;
    --topnav-bg: var(--gray-0);
    --topnav-shadow: none;
}

/* ...or only on one nav */
.marketing-nav {
    --topnav-border: 0;
}`;

  protected readonly variablesList = `--topnav-height / -padding-x / -z-index
--topnav-bg / -text / -border / -shadow / -backdrop
--topnav-link-hover-bg / -link-hover-shadow / -link-active-text
--topnav-menu-bg / -menu-border / -menu-shadow
--topnav-focus-box-shadow`;
}
