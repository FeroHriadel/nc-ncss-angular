// ng component

import { Component, Input } from '@angular/core';
import { SquareButton } from '../square-button/square-button.component';
import { TimesIcon } from '../../icons';


@Component({  selector: 'nc-close-button',
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.css',
  imports: [SquareButton, TimesIcon]
})



export class CloseButton {
    @Input() id?: string;
    @Input() ariaLabel: string = 'Close';
    @Input() disabled: boolean = false;
    @Input() class: string = '';
    @Input() style: { [key: string]: string } = {};
    @Input() size: number = 20;
    @Input() color: string = 'var(--nc-red-900)';

}