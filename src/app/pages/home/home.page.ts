import { Component, ViewChild } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';




@Component({
  selector: 'home-page',
  imports: [Select],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})



export class HomePage {
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