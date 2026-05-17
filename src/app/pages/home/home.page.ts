import { Component, ViewChild, inject } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { NoLicenceIcon, NpmIcon, SettingsIcon, ChevronDownIcon, WindowIcon, InfoIcon, WarningIcon, HamburgerIcon } from '../../ncss/icons';
import { Table } from "../../ncss/tables/table/table";
import { Switch } from '../../ncss/inputs/switch/switch.component';
import { FileUpload } from '../../ncss/inputs/file-upload/file-upload.component';
import { FormService } from '../../ncss/services/form.service';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { Modal } from '../../ncss/popups/modal/modal.component';
import { ToastService } from '../../ncss/services/toast.service';
import { CardList, CardListItem } from '../../ncss/lists/card-list/card-list.component';
import { Popover } from '../../ncss/popups/popover/popover.component';




@Component({
  selector: 'home-page',
  imports: [Container, Card, Button, NoLicenceIcon, NpmIcon, SettingsIcon, Table, Select, Switch, FileUpload, SquareButton, ChevronDownIcon, WindowIcon, InfoIcon, Modal, WarningIcon, HamburgerIcon, CardList, Popover],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})



export class HomePage {
  @ViewChild('mySelect') mySelect?: Select;
  public formService = inject(FormService);
  public toastService = inject(ToastService);
  
  public logoPath = 'images/logo.png';
  public vtData = [
    { number: 1, string: 'John Doe',boolean: true, html: '<span class="vt-html-example-text" style="color: var(--nc-red-800);">span</span>' },
    { number: 2, string: 'Jane Smith', boolean: false, html: '<h1 class="vt-html-example-text" style="color: var(--nc-gray-500">h1</h1>' },
    { number: 3, string: 'Alice Johnson', boolean: true, html: '<button class="vt-html-example-button">Button</button>' },
  ]

  public getFormValues() {
    const values = this.formService.getFormValues('example-form');
    alert(JSON.stringify(values, null, 2));
  }

  public clearForm() {
    this.formService.clearFormValues('example-form');
  }

  public setFormValues() {
    this.formService.setFormValues('example-form', {
      name: 'My Project',
      region: 'us-east-1',
      database: 'postgres',
      overwriteExisting: true,
      note: 'This is a sample project.'
    });
  }

  public showToast() {
    this.toastService.toast({text: 'This is a toast message!'});
  }

  public showErrorToast() {
    this.toastService.error({text: 'This is an error toast message!'});
  }

  public basicItems: CardListItem[] = [
    { title: 'Task Management', text: 'Pre-built CRUD operations with edit & delete' },
    { title: 'Form Handling', text: 'Service-based form state management' },
  ];

    public onBasicCreate = () => {
    this.basicItems.push({ title: `New Feature ${this.basicItems.length + 1}`, text: 'Click edit to customize' });
  };

  public onBasicUpdate = (item: CardListItem) => {
    const index = this.basicItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicItems[index].title = this.basicItems[index].title + ' ✓';
    }
  };

  public onBasicDelete = (item: CardListItem) => {
    const index = this.basicItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicItems.splice(index, 1);
    }
  };


}