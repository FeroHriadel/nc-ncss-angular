// ng component for pills page
import { Component } from '@angular/core';
import { Pill } from '../../ncss/pills/pill/pill.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Card } from '../../ncss/cards/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'app-pills',
  templateUrl: './pills.page.html',
  styleUrls: ['./pills.page.css'],
  imports: [Pill, Container, Card, Highlight]
})



export class PillsPage {

  onPillClose = () => {
    alert('Pill close btn clicked');
  }

  pillsHtml = `
    <nc-pill class="mr-2" size="small">Small</nc-pill> 
    <nc-pill class="mr-2" [closable]="true" [onClose]="onPillClose">Medium with close btn</nc-pill> 
    <nc-pill [style]="{backgroundColor: 'black', color: 'white'}" class="mr-2">Styled</nc-pill>
    <nc-pill size="large">Large</nc-pill>
  `;

  pillsTS = `
    import { Component } from '@angular/core';
    import { Pill } from '../../ncss/pills/pill/pill.component';

    @Component({
      selector: 'app-pills',
      templateUrl: './pills.page.html',
      styleUrls: ['./pills.page.css'],
      imports: [Pill, Container, Card, Highlight]
    })

  export class PillsPage {
    onPillClose = () => {
      alert('Pill close btn clicked');
    }
  }
  `;

}