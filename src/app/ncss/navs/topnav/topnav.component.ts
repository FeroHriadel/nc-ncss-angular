import { Component, Input, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HamburgerIcon } from '../../icons';
import { Select, SelectOption } from '../../inputs/select/select.component';



interface NavLink {
    label: string;
    link?: string;
    hasOptions?: boolean;
    options?: { label: string; value: string }[];
}



@Component({
  selector: 'top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, HamburgerIcon, Select],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css',
})



export class TopNav {
  @Input() links: NavLink[] = [];
  @Input() class: string = '';
  @Input() style: { [key: string]: string } = {};
  @Input() id: string = '';

  private router = inject(Router);

  getHamburgerOptions(): SelectOption[] {
    return this.links.flatMap(link => {
      if (link.hasOptions) return link.options?.map(option => ({ label: option.label, value: option.value })) || [];
      return [{ label: link.label, value: link.link || '' }];
    });
  }

  navigateToLink(value: string | string[]) {
    if (typeof value === 'string') this.router.navigate([value]);
  }

}