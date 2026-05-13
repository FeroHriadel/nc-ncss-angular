import { Component, ViewChild, inject } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { DownloadIcon, NoLicenceIcon, NpmIcon, SettingsIcon } from '../../ncss/icons';
import { Table } from "../../ncss/tables/table/table";




@Component({
  selector: 'home-page',
  imports: [Container, Card, Button, DownloadIcon, NoLicenceIcon, NpmIcon, SettingsIcon, Table],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})



export class HomePage {
  @ViewChild('mySelect') mySelect?: Select;
  
  public logoPath = 'images/logo.png';
  public vtData = [
    { number: 1, string: 'John Doe',boolean: true, html: '<span class="vt-html-example-text" style="color: var(--nc-red-800);">span</span>' },
    { number: 2, string: 'Jane Smith', boolean: false, html: '<h1 class="vt-html-example-text" style="color: var(--nc-gray-500">h1</h1>' },
    { number: 3, string: 'Alice Johnson', boolean: true, html: '<button class="vt-html-example-button">Button</button>' },
  ]




}