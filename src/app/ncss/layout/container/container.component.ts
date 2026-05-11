import { Component, Input } from '@angular/core';



@Component({
  selector: 'nc-container',
  imports: [],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
})



export class Container {
  @Input() id?: string;
  @Input() class: string = '';
  @Input() style: { [key: string]: string } = {};
}