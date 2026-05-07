// ng component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Card } from '../../ncss/cards/card.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';



@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.css'],
  imports: [CommonModule, RouterLink, Container, Card, Button, CrudList]
})



export class ListsPage {
  public items: CrudListItem[] = [
    { text: 'Item 1' },
    { text: 'Item 2 with a longer description' },
    { text: 'Item 3 where someone got carried out and wrote a lot and lot of text to demonstrate text overflow handling in the UI - like users sometimes do' }
  ];
  public title: string = 'My List';

  public onCreate = () => {
    const newItemNumber = this.items.length + 1;
    this.items.push({ text: `Item ${newItemNumber}` });
  };

  public onClick = (item: CrudListItem) => {
    alert('Clicked item: ' + item.text);
  };

  public onUpdate = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items[index].text = this.items[index].text + ' UPDATED';
    }
  };

  public onDelete = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}
