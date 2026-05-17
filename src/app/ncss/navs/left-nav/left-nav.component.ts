import { Component, Input, AfterViewInit } from "@angular/core";
import { RouterLink } from '@angular/router';
import { CloseButton } from '../../buttons/close-button/close-button.component';
import { Collapsible } from '../../popups/collapsible/collapsible.component';
import { SquareButton } from '../../buttons/square-button/square-button.component';
import { ChevronDownIcon } from '../../icons/chevron-down.icon';



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
  imports: [CloseButton, RouterLink, Collapsible, SquareButton, ChevronDownIcon]
})



export class LeftNav implements AfterViewInit {  
    @Input() class: string = '';
    @Input() style: {[key: string]: string} = {}
    @Input() id: string = 'nc-left-nav';
    @Input() top: string = '0px';
    @Input() width: string = '';
    @Input() links: NavLink[] = [];
    
    isOpen: boolean = true;

    ngAfterViewInit() {
        const wrapper = document.getElementById('left-nav-app-wrapper');
        if (wrapper) {
            const navWidth = this.width || '260px';
            wrapper.style.marginLeft = navWidth;
            wrapper.style.transition = 'margin-left 0.3s ease';
        }
    }

    close() {
        this.isOpen = false;
        const wrapper = document.getElementById('left-nav-app-wrapper');
        if (wrapper) {
            wrapper.style.marginLeft = '0';
        }
    }

    open() {
        this.isOpen = true;
        const wrapper = document.getElementById('left-nav-app-wrapper');
        if (wrapper) {
            const navWidth = this.width || '260px';
            wrapper.style.marginLeft = navWidth;
        }
    }
}



