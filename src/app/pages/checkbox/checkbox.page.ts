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
  @ViewChild('switchExample') switchExample!: Switch;

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
        [checked]="true"
      ></nc-checkbox>

      <nc-checkbox [disabled]="true" class="ml-4 mb-4" label="disabled"></nc-checkbox>
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

  getSwitchValue = () => {
    const value = this.switchExample.getValue();
    alert('Switch value: ' + value);
  }

  setSwitchValue = (value: boolean) => {
    this.switchExample.setValue(value);
  }

  onSwitchChange = () => {
    alert('Switch value changed: ' + this.switchExample.getValue());
  }

  public switchHtml = `
      <nc-switch
        #switchExample
        class="mb-4 mr-2"
        id="switch-example"
        label="Optional inbuilt label"
        [style]="{transform: 'translateX(1rem)'}"
        name="switch-example"
        [onChange]="onSwitchChange"
        [checked]="true"
      ></nc-switch>

      <nc-switch [disabled]="true" class="ml-4 mb-4" label="disabled"></nc-switch>
      <br>

      <nc-button class="mb-1 mr-1" variant="dark" (click)="setSwitchValue(true)">Set Switch Value to True</nc-button>
      <nc-button class="mb-1 mr-1" (click)="switchExample.toggleChecked()">Toggle Switch</nc-button>
      <nc-button class="mb-1 mr-1" variant="outline" (click)="getSwitchValue()">Get Switch Value</nc-button>
  `;

  public switchTS = `
    import { Component, ViewChild } from '@angular/core';
    import { Switch } from '../../ncss/inputs/switch/switch.component';

    @Component({
      selector: 'switch-page',
      imports: [Switch],
      templateUrl: './switch.page.html',
      styleUrl: './switch.page.css',
    })

    export class SwitchPage {
      @ViewChild('switchExample') switchExample!: Switch;

      getSwitchValue = () => {
        const value = this.switchExample.getValue();
        alert('Switch value: ' + value);
      }

      setSwitchValue = (value: boolean) => {
        this.switchExample.setValue(value);
      }

      onSwitchChange = () => {
        alert('Switch value changed: ' + this.switchExample.getValue());
      }
    }
      `;

}