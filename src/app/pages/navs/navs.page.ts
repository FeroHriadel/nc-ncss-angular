//ng component
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopNav } from '../../ncss/navs/topnav/topnav.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Container } from '../../ncss/layout/container/container.component';
import { Select } from '../../ncss/inputs/select/select.component';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { PalleteIcon } from '../../ncss/icons/pallete.icon';
import { ThemeService } from '../../ncss/services/theme.service';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'app-navs',
  templateUrl: './navs.page.html',
  styleUrl: './navs.page.css',
  imports: [RouterLink, TopNav, Card, Container, Select, SquareButton, PalleteIcon, Highlight]
})



export class NavsPage {
    private themeService = inject(ThemeService);

    changeTheme = (theme: string | string[]) => {
        const themeValue = Array.isArray(theme) ? theme[0] : theme;
        if (themeValue !== 'light' && themeValue !== 'dark') {
        return console.warn('Invalid theme. Please choose "light" or "dark".');
        }
        console.log('Applying theme:', themeValue);
        this.themeService.setTheme(themeValue as 'light' | 'dark');
    }

    topnavHTML = `
<nc-topnav 

        // simple link: { 
        //   label: 'Home', 
        //   link: '/' 
        //  }
        //
        // links group: { 
        //   label: 'Forms', 
        //   hasOptions: true, 
        //   options: [ 
        //     { label: 'Form Elements', value: 'inputs' }, ... ] 
        //  }

        [links]="[ // this can of course be moved to TS file
            { label: 'Home', link: '/' },
            { 
                label: 'Forms', 
                hasOptions: true, 
                options: [
                    { label: 'Form Elements', value: 'inputs' },
                    { label: 'Buttons', value: 'inputs/buttons' },
                    { label: 'Checkbox', value: 'inputs/checkbox' },
                    { label: 'File Upload', value: 'inputs/file-upload' },
                    { label: 'Select', value: 'inputs/select' },
                    { label: 'Text Inputs', value: 'inputs/text-inputs' },
                ] 
            },
            { label: 'Navs', link: '/navs' },
            { label: 'Pills', link: '/pills' }
        ]"
        [style]="{position: 'absolute', top: '0', left: '0', right: '0'}"
    >

        // The slot="logo" is used to place the content on the left side of the topnav
        <span slot="logo">NCSS Angular</span>

        // The slot="custom" is used to place custom content on the right side of the topnav
        <nc-select 
            slot="custom" 
            class="mr-2"
            [options]="[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            ]"
            defaultValue="light"
            [customTrigger]="true"
            [width]="'fit-content'"
            [onChange]="changeTheme"
        >
            <nc-square-button>
                <nc-pallete-icon [size]="20"></nc-pallete-icon>
            </nc-square-button>
        </nc-select>
    </nc-topnav>
    `;

    topnavTS = `
        import { Component, inject } from '@angular/core';
        import { TopNav } from '../../ncss/navs/topnav/topnav.component';
        import { Select } from '../../ncss/inputs/select/select.component';
        import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
        import { PalleteIcon } from '../../ncss/icons/pallete.icon';
        import { ThemeService } from '../../ncss/services/theme.service';

        @Component({
            selector: 'app-navs',
            templateUrl: './navs.page.html',
            styleUrl: './navs.page.css',
            imports: [TopNav, Select, SquareButton, PalleteIcon]
        })

        export class NavsPage {
            private themeService = inject(ThemeService);

            changeTheme = (theme: string | string[]) => {
                const themeValue = Array.isArray(theme) ? theme[0] : theme;
                if (themeValue !== 'light' && themeValue !== 'dark') {
                return console.warn('Invalid theme. Please choose "light" or "dark".');
                }
                console.log('Applying theme:', themeValue);
                this.themeService.setTheme(themeValue as 'light' | 'dark');
            }
        }
    `;
}