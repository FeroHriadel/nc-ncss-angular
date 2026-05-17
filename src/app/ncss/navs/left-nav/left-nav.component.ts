import { Component, Input } from "@angular/core";
import { RouterLink } from '@angular/router';
import { CloseButton } from '../../buttons/close-button/close-button.component';
import { Collapsible } from '../../popups/collapsible/collapsible.component';



interface NavLink {
    label: string;
    link?: string;
    hasOptions?: boolean;
    options?: { label: string; value: string }[];
}


@Component({
  selector: 'nc-left-nav',
  standalone: true,
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.css',
  imports: [CloseButton, RouterLink, Collapsible]
})



export class LeftNav {  
    @Input() class: string = '';
    @Input() style: {[key: string]: string} = {}
    @Input() id: string = 'nc-left-nav';
    @Input() top: string = '0px';
    @Input() width: string = '';
    @Input() links: NavLink[] = [];
}



