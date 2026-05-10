import { Component, Input } from '@angular/core';



@Component({
  selector: 'ncss-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.css']
})



export class IconCard {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}