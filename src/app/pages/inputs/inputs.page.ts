import { Component, ViewChild } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';




@Component({
  selector: 'inputs-page',
  imports: [Select],
  templateUrl: './inputs.page.html',
  styleUrl: './inputs.page.css',
})



export class InputsPage {
  @ViewChild('mySelect') mySelect?: Select;

  onSelectChange (value: string | string[]) {
    console.log('Selected value:', value);
  }

  getSelectedValue() {
    const value = this.mySelect?.value;
    console.log('Current selected value:', value);
  }

  setSelectedValue(value: string | string[]) {
    this.mySelect?.setValue(value);
  }

  clearSelectedValue() {
    this.mySelect?.clear();
  }


}