import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Button, Card, Checkbox, EditIcon, InfoIcon, ListIcon, NotesIcon, PalleteIcon, Pill, PlusIcon, Select, SelectOption,
  SettingsIcon, Switch, Theme, ThemeService, UploadIcon, UserIcon, UsersIcon
} from '../../ncss';

type AlertKey = 'transactions' | 'security' | 'goals' | 'market';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, Button, Card, Checkbox, Switch, Select, Pill, PlusIcon, SettingsIcon, UserIcon, UsersIcon, ListIcon,
    NotesIcon, EditIcon, InfoIcon, PalleteIcon, UploadIcon
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly themes = inject(ThemeService);
  protected readonly themeLabels: Record<Theme, string> = {
    light: 'Light',
    dark: 'Dark',
    glass: 'Glass',
    'neumorphic-light': 'Neumorphic light',
    'neumorphic-dark': 'Neumorphic dark',
  };

  protected readonly currencies: SelectOption[] = [
    { value: 'usd', label: 'USD — United States Dollar' },
    { value: 'eur', label: 'EUR — Euro' },
    { value: 'czk', label: 'CZK — Czech Koruna' },
  ];
  protected readonly currency = signal<string | string[]>('usd');

  protected readonly bars = [
    { label: 'Dec', height: 38 },
    { label: 'Jan', height: 78 },
    { label: 'Feb', height: 55 },
    { label: 'Mar', height: 100 },
    { label: 'Apr', height: 62 },
  ];

  protected readonly planning = [
    { label: 'Documents', icon: 'notes' },
    { label: 'Budget', icon: 'list' },
    { label: 'Reports', icon: 'edit' },
    { label: 'Goals', icon: 'info' },
  ];

  protected readonly alerts = signal<Record<AlertKey, boolean>>({ transactions: true, security: true, goals: false, market: false });

  protected setAlert(key: AlertKey, value: boolean): void {
    this.alerts.update(alerts => ({ ...alerts, [key]: value }));
  }

  protected readonly importCode = '@import "./app/ncss/stylesheets/ncss.css";';
  protected readonly treeCode = 'ncss/\n├─ buttons/\n├─ cards/\n├─ stylesheets/\n│  └─ ncss.css\n└─ …';

  protected download(): void {
    const link = document.createElement('a');
    link.href = 'files/ncss.zip';
    link.download = 'ncss.zip';
    link.click();
  }

  protected readonly wifi = signal(true);
  protected readonly dark = signal(false);
}
