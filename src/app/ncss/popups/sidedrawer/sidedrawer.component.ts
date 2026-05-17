import { Component, Input, HostListener } from '@angular/core';
import { CloseButton } from '../../buttons/close-button/close-button.component';



@Component({
  selector: 'nc-sidedrawer',
  templateUrl: './sidedrawer.component.html',
  styleUrls: ['./sidedrawer.component.css'],
  imports: [CloseButton]
})



export class SideDrawer {
  @Input() id: string = '';
  @Input() class: string = '';
  @Input() style: { [key: string]: string } = {};
  @Input() width: string = '260px';
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'right';

  public isOpenState: boolean = false;

  public getState(): boolean {
    return this.isOpenState;
  }

  public open(): void {
    this.isOpenState = true;
  }

  public close(): void {
    this.isOpenState = false;
  }

  public toggleDrawer(): void {
    if (this.isOpenState) {
      this.close();
    } else {
      this.open();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.close();
  }

  public onBackdropClick(event: MouseEvent): void {
    // Only close if clicking the backdrop itself, not the drawer
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
