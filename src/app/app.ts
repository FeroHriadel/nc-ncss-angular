import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TopNav } from './ncss/navs/topnav/topnav.component';
import { Select } from './ncss/inputs/select/select.component';
import { PalleteIcon } from './ncss/icons';
import { SquareButton } from './ncss/buttons/square-button/square-button.component';
import { ThemeService } from './ncss/services/theme.service';
import { LeftNav } from './ncss/navs/left-nav/left-nav.component'
import { LeftNavAppWrapper } from './ncss/navs/left-nav/left-nav-app-wrapper.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNav, Select, PalleteIcon, SquareButton, LeftNav, LeftNavAppWrapper],
  templateUrl: './app.html',
  styleUrl: './app.css',
})



export class App {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  public logoPath = 'images/logo.png';

  changeTheme = (theme: string | string[]) => {
    const themeValue = Array.isArray(theme) ? theme[0] : theme;
    if (themeValue !== 'light' && themeValue !== 'dark') {
      return console.warn('Invalid theme. Please choose "light" or "dark".');
    }
    console.log('Applying theme:', themeValue);
    this.themeService.setTheme(themeValue as 'light' | 'dark');
  }

  redirectHome() {
    this.router.navigate(['/']);
  }

}
