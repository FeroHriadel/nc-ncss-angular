import { Component, Input, OnInit, OnDestroy, AfterViewInit, HostListener, Renderer2, inject } from '@angular/core';
import { Card } from '../../cards/card/card.component';
import { CloseButton } from '../../buttons/close-button/close-button.component';
import { SquareButton } from '../../buttons/square-button/square-button.component';
import { ChevronDownIcon } from '../../icons/chevron-down.icon';



@Component({
  selector: 'nc-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css'],
  imports: [Card, CloseButton, SquareButton, ChevronDownIcon]
})



export class LeftNav implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string = '';
  @Input() class: string = '';
  @Input() style: { [key: string]: string } = {};
  @Input() width: string = '260px';
  @Input() offsetTop: string = '64px';
  @Input() pushContent: boolean = false;

  public isOpenState: boolean = true;
  private resizeListener?: () => void;
  private contentElement?: HTMLElement;
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    // Set initial state based on screen size
    this.updateStateForScreenSize();
    
    // Add resize listener
    this.resizeListener = () => this.updateStateForScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit(): void {
    // Find the content element to push if pushContent is enabled
    if (this.pushContent) {
      // Use setTimeout to ensure Angular has finished rendering
      setTimeout(() => {
        // Try to find the actual div with class nc-container (not the component wrapper)
        let element = document.querySelector('.nc-container');
        
        if (!element) {
          // Fallback: look for router-outlet and get its next element sibling
          const routerOutlet = document.querySelector('router-outlet');
          if (routerOutlet) {
            let sibling = routerOutlet.nextSibling;
            while (sibling) {
              if (sibling.nodeType === Node.ELEMENT_NODE) {
                element = sibling as HTMLElement;
                break;
              }
              sibling = sibling.nextSibling;
            }
          }
        }
        
        if (element) {
          this.contentElement = element as HTMLElement;
          console.log('LeftNav: Found content element to push:', this.contentElement);
          // Apply initial margin based on current state
          this.updateContentMargin(this.isOpenState);
        } else {
          console.warn('LeftNav: No content element found to push. Make sure your page content is wrapped in a container.');
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    // Reset margin when component is destroyed
    if (this.pushContent && this.contentElement) {
      this.renderer.setStyle(this.contentElement, 'margin-left', '0');
    }
  }

  private updateStateForScreenSize(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 1260) {
      this.isOpenState = false;
      this.updateContentMargin(false);
    } else {
      this.isOpenState = true;
      this.updateContentMargin(true);
    }
  }

  private updateContentMargin(isOpen: boolean): void {
    if (this.pushContent && this.contentElement) {
      console.log(`LeftNav: Updating margin, isOpen: ${isOpen}, width: ${this.width}`);
      if (isOpen) {
        this.renderer.setStyle(this.contentElement, 'margin-left', this.width);
        this.renderer.setStyle(this.contentElement, 'margin-right', 'auto');
      } else {
        this.renderer.setStyle(this.contentElement, 'margin-left', 'auto');
        this.renderer.setStyle(this.contentElement, 'margin-right', 'auto');
      }
      this.renderer.setStyle(this.contentElement, 'transition', 'margin-left 0.3s ease-out');
    }
  }

  public getState(): boolean {
    return this.isOpenState;
  }

  public open(): void {
    this.isOpenState = true;
    this.updateContentMargin(true);
  }

  public close(): void {
    this.isOpenState = false;
    this.updateContentMargin(false);
  }

  public toggle(): void {
    if (this.isOpenState) {
      this.close();
    } else {
      this.open();
    }
  }
}
