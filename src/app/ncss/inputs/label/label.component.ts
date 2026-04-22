import { Component, Input } from '@angular/core';



@Component({
  selector: 'nc-label',
  imports: [],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
})



export class Label {
  @Input() class?: string = '';
  @Input() style?: { [key: string]: string } = {};
  @Input() id?: string = '';
  @Input() for?: string = '';
}