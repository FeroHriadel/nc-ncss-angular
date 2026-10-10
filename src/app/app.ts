import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavLink, ThemeService, ThemeSwitch, TopNav } from './ncss';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TopNav, ThemeSwitch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly links: NavLink[] = [
    {
      label: 'Foundations',
      children: [
        { label: 'Colors', link: '/colors' },
        { label: 'Typography', link: '/typography' },
        { label: 'Icons', link: '/icons' },
        { label: 'Layout', link: '/layout' },
        { label: 'Navs', link: '/navs' },
        { label: 'Cards', link: '/cards' },
        { label: 'Buttons', link: '/buttons' },
        { label: 'Pills', link: '/pills' },
      ]
    },
    {
      label: 'Inputs',
      children: [
        { label: 'Input', link: '/input' },
        { label: 'Select', link: '/select' },
        { label: 'Checkbox', link: '/checkbox' },
        { label: 'Switch', link: '/switch' },
        { label: 'File upload', link: '/fileupload' },
      ]
    },
    {
      label: 'Tables & Lists',
      children: [
        { label: 'Table', link: '/table' },
        { label: 'Crud list', link: '/crud-list' },
        { label: 'Card list', link: '/card-list' },
      ]
    },
    {
      label: 'PopUps',
      children: [
        { label: 'Toast', link: '/toast' },
        { label: 'Theme switch', link: '/themeswitch' },
        { label: 'Modal', link: '/modal' },
        { label: 'Drawer', link: '/drawer' },
        { label: 'Popover', link: '/popover' },
        { label: 'Collapsible', link: '/collapsible' },
      ]
    },
  ];

  constructor() {
    // Creating the service applies the saved theme right away, even on pages without a switch.
    inject(ThemeService);
  }
}
