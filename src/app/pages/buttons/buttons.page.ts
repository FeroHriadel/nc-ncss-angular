
import { Component } from '@angular/core';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Button } from '../../ncss//buttons/button/button.component';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { ButtonIcon } from '../../ncss/icons';
import { Card } from '../../ncss/cards/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'buttons-page',
  templateUrl: './buttons.page.html',
  styleUrls: ['./buttons.page.css'],
  standalone: true,
  imports: [Container, Button, SquareButton, ButtonIcon, Card, Highlight],
})


export class ButtonsPage {
  public htmlCode: string = `
    <nc-button class="mb-1 mr-1" [width]="'260px'">Dark (default)</nc-button>
    <nc-button variant="outline" class="mb-1 mr-1" [width]="'260px'">Outline</nc-button>
    <nc-button variant="ghost" class="mb-1 mr-1" [width]="'260px'">Ghost</nc-button>
    <nc-button variant="red" class="mb-1 mr-1" [width]="'260px'">Red</nc-button>
    <nc-button>Unmodified</nc-button>
    <br><br><br>
    <nc-button size="small" class="mb-1 mr-1">Small</nc-button>
    <nc-button size="medium" class="mb-1 mr-1">Medium</nc-button>
    <nc-button size="large" class="mb-1 mr-1">Large</nc-button>
    <nc-button 
      class="mb-1 mr-1" 
      [width]="'260px'" 
      [style]="{backgroundColor: 'red', borderRadius: '999px', height: '55px', fontSize: '18px'}"
    >
      Styled Button
    </nc-button>
    <nc-button class="mb-1 mr-1" [width]="'260px'" title="TITLE" size="large">With Title (hover)</nc-button>
  `;

  public squareBtnCode = `
    <nc-square-button class="mb-2 mr-1">
        <nc-button-icon></nc-button-icon>
    </nc-square-button>
    <nc-square-button class="mb-2 mr-1" variant="dark">
        <nc-button-icon color="white"></nc-button-icon>
    </nc-square-button>
    <nc-square-button class="mb-2 mr-1" variant="red">
        <nc-button-icon color="white"></nc-button-icon>
    </nc-square-button>
    <nc-square-button class="mb-2 mr-1" variant="outline">
        <nc-button-icon color="var(--nc-color-text)"></nc-button-icon>
    </nc-square-button>
  `;

  public tsCode = `
    import { Component } from '@angular/core';
    import { Button } from '../../ncss//buttons/button/button.component';
    import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
    import { ButtonIcon } from '../../ncss/icons';

    @Component({
    selector: 'buttons-page',
    templateUrl: './buttons.page.html',
    styleUrls: ['./buttons.page.css'],
    standalone: true,
    imports: [Container, Button, SquareButton, ButtonIcon, Card, Highlight],
    })

    export class ButtonsPage {...}
  `;
}