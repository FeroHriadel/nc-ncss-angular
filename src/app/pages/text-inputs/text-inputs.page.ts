import { Component, ViewChild } from '@angular/core';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Card } from '../../ncss/cards/card.component';
import { Highlight } from 'ngx-highlightjs';
import { Password } from '../../ncss/inputs/password/password.component';
import { Button } from '../../ncss/buttons/button/button.component';



@Component({
  selector: 'text-inputs-page',
  imports: [Container, Card, Highlight, Password, Button],
  templateUrl: './text-inputs.page.html',
  styleUrl: './text-inputs.page.css',
})



export class TextInputsPage {
  @ViewChild('passwordInput') passwordInput!: Password;

  inputsHtml = `
    <label for="text-input">Label</label>
    <input type="text" id="text-input" placeholder="Type something..." class="mb-4">
    <label for="textarea">Label</label>
    <textarea id="textarea" placeholder="Type something..." class="mb-4"></textarea>
  `

  public setPasswordValue() {
    this.passwordInput.setValue('abc');
  }

  public getPasswordValue() {
    const value = this.passwordInput.getValue();
    alert(value);
  }

  public clearPasswordValue() {
    this.passwordInput.clear();
  }

  passwordHtml = `
      <nc-password #passwordInput id="password-input" placeholder="Enter your password" class="mb-4 mr-1"></nc-password>
      <nc-button class="mr-1" (click)="setPasswordValue()">Set Value to "abc"</nc-button>
      <nc-button class="mr-1" (click)="getPasswordValue()" variant="outline">Get Value</nc-button>
      <nc-button class="mr-1" (click)="clearPasswordValue()" variant="red">Clear</nc-button>
  `;

  passwordTS = `
    import { Component, ViewChild } from '@angular/core';

    @Component({
      selector: 'text-inputs-page',
      imports: [Container, Card, Highlight, Password, Button],
      templateUrl: './text-inputs.page.html',
      styleUrl: './text-inputs.page.css',
    })

    export class TextInputsPage {
      @ViewChild('passwordInput') passwordInput!: Password;

        public setPasswordValue() {
          this.passwordInput.setValue('abc');
        }

        public getPasswordValue() {
          const value = this.passwordInput.getValue();
          alert(value);
        }

        public clearPasswordValue() {
          this.passwordInput.clear();
        }

    }

  `;
}