import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HamburgerIcon } from '../../icons';



interface NavLink {
    label: string;
    link: string;
}



@Component({
  selector: 'top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, HamburgerIcon],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css',
})



export class TopNav {
  @Input() links: NavLink[] = [];

}