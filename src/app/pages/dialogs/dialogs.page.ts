import { Component, ViewChild } from '@angular/core';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Modal } from '../../ncss/popups/modal/modal.component';
import { Collapsible } from '../../ncss/popups/collapsible/collapsible.component';
import { Popover } from '../../ncss/popups/popover/popover.component';
import { Button } from '../../ncss/buttons/button/button.component';
import {Highlight } from 'ngx-highlightjs';
import { ToastService } from '../../ncss/services/toast.service';



@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.css'],
  imports: [Container, Card, Modal, Collapsible, Popover, Button, Highlight]
})



export class DialogsPage {
  @ViewChild('modal') modal!: Modal;
  @ViewChild('collapsible') collapsible!: Collapsible;
  @ViewChild('popover') popover!: Popover;

  constructor(private toastService: ToastService) {}

  // Toast methods
  showToast() {
    this.toastService.toast({ text: 'This is a success toast notification!' });
  }

  showError() {
    this.toastService.error({ text: 'This is an error toast notification!' });
  }

  showCustomDuration() {
    this.toastService.toast({ text: 'This toast will stay for 5 seconds', duration: 5000 });
  }

  showMultipleToasts() {
    this.toastService.toast({ text: 'First toast' });
    setTimeout(() => this.toastService.error({ text: 'Second toast (error)' }), 200);
    setTimeout(() => this.toastService.toast({ text: 'Third toast' }), 400);
  }

  // Collapsible methods
  openCollapsible() {
    this.collapsible.open();
  }

  closeCollapsible() {
    this.collapsible.close();
  }

  getCollapsibleState() {
    const state = this.collapsible.getOpen();
    alert(`Collapsible is ${state.open ? 'open' : 'closed'}`);
  }

  onCollapsibleOpen = () => {
    console.log('Collapsible opened!');
  }

  onCollapsibleClose = () => {
    console.log('Collapsible closed!');
  }

  // Popover methods
  openPopover() {
    this.popover.open();
  }

  closePopover() {
    this.popover.close();
  }

  getPopoverState() {
    const state = this.popover.getState();
    alert(`Popover is ${state ? 'open' : 'closed'}`);
  }

  getOpenState() {
    alert(this.modal.isOpen() ? 'Modal is open' : 'Modal is closed');
  }

  openDialog() {
    this.modal.openModal();
  }

  closeDialog() {
    this.modal.closeModal();
  }

  onClose =() => {
    alert('Modal closed');
  }

  onConfirm = () => {
    alert('Confirmed!');
  }

  modalHTML = `
    <div class="flex w-100 justify-center flex-wrap">
      <nc-modal
        #modal
        [onClose]="onClose"
        [onConfirm]="onConfirm"
      >
        <nc-button slot="modal-trigger" class="mr-1 mb-2" width="230px">This is an HTML modal trigger</nc-button>
          <div slot="modal-content">
            <h2>Modal Title</h2>
            <p>This is the content of the modal.</p>
            <p class="text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta, eos sunt quis reiciendis quia eaque culpa tempora velit quod labore nesciunt nobis sequi, odit consequuntur placeat. Voluptatem nesciunt minima odit blanditiis quam soluta exercitationem porro, qui temporibus dignissimos ratione sit voluptatibus error fugit eligendi. Officia ex modi laborum, sequi aspernatur corporis voluptatem non ea provident amet. Delectus, a veritatis! Enim quos perspiciatis repellat debitis quae accusamus facere asperiores laudantium nemo, ullam nihil quo saepe. Suscipit deleniti nisi alias repellendus pariatur itaque eos tenetur ratione sed velit eum laborum obcaecati facilis cum eaque sint aspernatur, mollitia harum dignissimos molestiae ex veritatis?</p>
          </div>
      </nc-modal>

      <nc-button (click)="openDialog()" variant="outline" class="mr-1 mb-2" width="230px">Open Modal Programatically</nc-button>
      <nc-button (click)="getOpenState()" variant="outline" class="mr-1 mb-2" width="230px">Get Modal State</nc-button>
      <nc-button (click)="closeDialog()" variant="red" class="mr-1 mb-2">Close Modal Programatically</nc-button>
    </div>
  `;

  modalTS = `
    import { Component, ViewChild } from '@angular/core';
    import { Modal } from '../../ncss/dialogs/modal/modal.component';

    @Component({
      selector: 'app-dialogs',
      templateUrl: './dialogs.page.html',
      styleUrls: ['./dialogs.page.css'],
      imports: [Modal]
    })

    export class DialogsPage {
      @ViewChild('modal') modal!: Modal;

      getOpenState() {
        alert(this.modal.isOpen() ? 'Modal is open' : 'Modal is closed');
      }

      openDialog() {
        this.modal.openModal();
      }

      closeDialog() {
        this.modal.closeModal();
      }

      onClose =() => {
        alert('Modal closed');
      }

      onConfirm = () => {
        alert('Confirmed!');
      }
    }
  `;

  toastHTML = `
    <div class="flex w-100 justify-center flex-wrap">
      <nc-button (click)="showToast()" class="mr-1 mb-2" width="230px">Show Toast</nc-button>
      <nc-button (click)="showError()" variant="red" class="mr-1 mb-2" width="230px">Show Error Toast</nc-button>
      <nc-button (click)="showCustomDuration()" variant="outline" class="mr-1 mb-2" width="230px">Custom Duration (5s)</nc-button>
      <nc-button (click)="showMultipleToasts()" variant="outline" class="mr-1 mb-2" width="230px">Show Multiple Toasts</nc-button>
    </div>
  `;

  toastTS = `
    import { Component } from '@angular/core';
    import { ToastService } from '../../ncss/services/toast.service';

    @Component({
      selector: 'app-dialogs',
      templateUrl: './dialogs.page.html',
      styleUrls: ['./dialogs.page.css']
    })

    export class DialogsPage {
      constructor(private toastService: ToastService) {}

      showToast() {
        this.toastService.toast({ text: 'This is a success toast notification!' });
      }

      showError() {
        this.toastService.error({ text: 'This is an error toast notification!' });
      }

      showCustomDuration() {
        this.toastService.toast({ 
          text: 'This toast will stay for 5 seconds', 
          duration: 5000 
        });
      }

      showMultipleToasts() {
        this.toastService.toast({ text: 'First toast' });
        setTimeout(() => this.toastService.error({ text: 'Second toast (error)' }), 200);
        setTimeout(() => this.toastService.toast({ text: 'Third toast' }), 400);
      }
    }
  `;

  collapsibleHTML = `
    <nc-collapsible
      #collapsible
      [onOpen]="onCollapsibleOpen"
      [onClose]="onCollapsibleClose"
      class="mb-4"
    >
      <nc-button slot="collapsible-trigger" width="230px">Click to Toggle</nc-button>
      <div slot="collapsible-content" class="mt-4">
        <nc-card>
          <p class="text">This is collapsible content that expands and collapses smoothly.</p>
          <p class="text">You can put any content here - text, images, forms, or other components.</p>
        </nc-card>
      </div>
    </nc-collapsible>

    <div class="flex w-100 justify-center flex-wrap">
      <nc-button (click)="openCollapsible()" class="mr-1 mb-2" width="230px">Open Programmatically</nc-button>
      <nc-button (click)="closeCollapsible()" variant="red" class="mr-1 mb-2" width="230px">Close Programmatically</nc-button>
      <nc-button (click)="getCollapsibleState()" variant="outline" class="mr-1 mb-2" width="230px">Get State</nc-button>
    </div>
  `;

  collapsibleTS = `
    import { Component, ViewChild } from '@angular/core';
    import { Collapsible } from '../../ncss/popups/collapsible/collapsible.component';

    @Component({
      selector: 'app-dialogs',
      templateUrl: './dialogs.page.html',
      styleUrls: ['./dialogs.page.css'],
      imports: [Collapsible]
    })

    export class DialogsPage {
      @ViewChild('collapsible') collapsible!: Collapsible;

      openCollapsible() {
        this.collapsible.open();
      }

      closeCollapsible() {
        this.collapsible.close();
      }

      getCollapsibleState() {
        const state = this.collapsible.getOpen();
        alert(\`Collapsible is \${state.open ? 'open' : 'closed'}\`);
      }

      onCollapsibleOpen = () => {
        console.log('Collapsible opened!');
      }

      onCollapsibleClose = () => {
        console.log('Collapsible closed!');
      }
    }
  `;

  popoverHTML = `
    <!-- Basic Popover with trigger -->
    <nc-popover #popover>
      <nc-button slot="popover-trigger" width="200px">Click to Open Popover</nc-button>
      
      <div slot="popover-content" class="p-4">
        <h4 class="section-subtitle">Popover Content</h4>
        <p class="text">This is a smart popover that positions itself automatically!</p>
        <p class="text mt-2">It will open below by default, but if there's no space, it opens above.</p>
      </div>
    </nc-popover>

    <!-- Programmatic Control -->
    <div class="flex w-100 justify-center flex-wrap mt-4">
      <nc-button (click)="openPopover()" class="mr-1 mb-2" width="200px">Open Programmatically</nc-button>
      <nc-button (click)="closePopover()" variant="red" class="mr-1 mb-2" width="200px">Close Programmatically</nc-button>
      <nc-button (click)="getPopoverState()" variant="outline" class="mr-1 mb-2" width="200px">Get State</nc-button>
    </div>

    <!-- Force Direction -->
    <nc-popover forceDirection="up">
      <nc-button slot="popover-trigger" variant="outline" width="200px">Force Open Upward</nc-button>
      
      <div slot="popover-content" class="p-4">
        <p class="text">This popover always opens above the trigger!</p>
      </div>
    </nc-popover>
  `;

  popoverTS = `
    import { Component, ViewChild } from '@angular/core';
    import { Popover } from '../../ncss/popups/popover/popover.component';

    @Component({
      selector: 'app-dialogs',
      templateUrl: './dialogs.page.html',
      styleUrls: ['./dialogs.page.css'],
      imports: [Popover]
    })

    export class DialogsPage {
      @ViewChild('popover') popover!: Popover;

      openPopover() {
        this.popover.open();
      }

      closePopover() {
        this.popover.close();
      }

      getPopoverState() {
        const state = this.popover.getState();
        alert(\`Popover is \${state ? 'open' : 'closed'}\`);
      }
    }
  `;
}