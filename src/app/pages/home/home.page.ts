import { Component, ViewChild } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Card } from '../../ncss/cards/card.component';




@Component({
  selector: 'home-page',
  imports: [Select, Container, Card],
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