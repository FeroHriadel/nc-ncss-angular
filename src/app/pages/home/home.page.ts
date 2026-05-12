import { Component, ViewChild, inject } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { DownloadIcon } from '../../ncss/icons/download.icon';





@Component({
  selector: 'home-page',
  imports: [Container, Card, Button, DownloadIcon],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})



export class HomePage {
  @ViewChild('mySelect') mySelect?: Select;
  
  public logoPath = 'images/logo.png';

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