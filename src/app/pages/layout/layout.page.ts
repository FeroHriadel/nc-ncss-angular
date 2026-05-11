import { Component } from '@angular/core';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';



@Component({
    selector: 'app-layout',
    templateUrl: './layout.page.html',
    styleUrl: './layout.page.css',
    imports: [Container, Card]
})



export class LayoutPage {}