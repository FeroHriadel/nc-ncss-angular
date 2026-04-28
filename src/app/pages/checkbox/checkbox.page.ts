import { Component, ViewChild } from '@angular/core';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { Checkbox } from '../../ncss/inputs/checkbox/checkbox.component';
import { Switch } from '../../ncss/inputs/switch/switch.component';
import { Highlight } from 'ngx-highlightjs';




@Component({
  selector: 'checkbox-page',
  imports: [Card, Container, Button, Checkbox, Switch, Highlight],
  templateUrl: './checkbox.page.html',
  styleUrl: './checkbox.page.css',
})



export class CheckboxPage {
  @ViewChild('checkboxExample') checkboxExample!: Checkbox;

  getCheckboxValue = () => {
    const value = this.checkboxExample.getValue();
    alert('Checkbox value: ' + value);
  }

  setCheckboxValue = (value: boolean) => {
    this.checkboxExample.setValue(value);
  }

  onCheckboxChange = () => {
    alert('Checkbox value changed: ' + this.checkboxExample.getValue());
  }

  public checkboxHtml = `
      <nc-checkbox
        #checkboxExample
        class="mb-4 mr-2"
        id="checkbox-example"
        label="Optional inbuilt label"
        [style]="{transform: 'translateX(1rem)'}"
        name="checkbox-example"
        [onChange]="onCheckboxChange"
      ></nc-checkbox>
      <br>
      <nc-button class="mb-1 mr-1" variant="dark" (click)="setCheckboxValue(true)">Set Checkbox Value to True</nc-button>
      <nc-button class="mb-1 mr-1" (click)="checkboxExample.toggleChecked()">Toggle Checkbox</nc-button>
      <nc-button class="mb-1 mr-1" variant="outline" (click)="getCheckboxValue()">Get Checkbox Value</nc-button>
  `;

  public checkboxTS = `
    import { Component, ViewChild } from '@angular/core';
    import { Checkbox } from '../../ncss/inputs/checkbox/checkbox.component';

    @Component({
      selector: 'checkbox-page',
      imports: [Checkbox],
      templateUrl: './checkbox.page.html',
      styleUrl: './checkbox.page.css',
    })

    export class CheckboxPage {
      @ViewChild('checkboxExample') checkboxExample!: Checkbox;

      getCheckboxValue = () => {
        const value = this.checkboxExample.getValue();
        alert('Checkbox value: ' + value);
      }

      setCheckboxValue = (value: boolean) => {
        this.checkboxExample.setValue(value);
      }

      onCheckboxChange = () => {
        alert('Checkbox value changed: ' + this.checkboxExample.getValue());
      }
    }
      `;

}