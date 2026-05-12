import { Component, ViewChild } from '@angular/core';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Modal } from '../../ncss/dialogs/modal/modal.component';
import { Button } from '../../ncss/buttons/button/button.component';
import {Highlight } from 'ngx-highlightjs';
import { ToastService } from '../../ncss/services/toast.service';



@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.css'],
  imports: [Container, Card, Modal, Button, Highlight]
})



export class DialogsPage {
  @ViewChild('modal') modal!: Modal;

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
}