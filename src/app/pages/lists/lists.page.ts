// ng component
import { Component, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Container } from '../../ncss/wrappers/container/container.component';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';
import { Card } from '../../ncss/cards/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.css'],
  imports: [CommonModule, Container, CrudList, Card, Highlight]
})



export class ListsPage implements AfterViewInit {
  @ViewChild('boldTemplate') boldTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;
  @ViewChild('cardTemplate') cardTemplate!: TemplateRef<any>;
  
  // Example 1: Basic items
  public basicItems: CrudListItem[] = [
    { text: 'Learn Angular' },
    { text: 'Build awesome apps' },
    { text: 'Deploy to production' }
  ];

  // Example 2: Advanced items
  public advancedItems: CrudListItem[] = [
    { text: 'Item with no update button' },
    { text: 'Delete-only item' }
  ];
  
  // Example 3: Items with custom templates
  public items: CrudListItem[] = [
    { text: 'Regular text item' },
    { text: 'Bold custom item' },
    { text: 'Colored custom item' },
    { text: 'Another regular item' },
    { text: 'Card style item' }
  ];
  
  public title: string = 'Custom Template List';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Assign templates to specific items after view is ready
    this.items[1].template = this.boldTemplate;
    this.items[2].template = this.colorTemplate;
    this.items[4].template = this.cardTemplate;
    this.cdr.detectChanges(); // Trigger change detection
  }

  // Example 1 callbacks
  public onBasicCreate = () => {
    this.basicItems.push({ text: `New task ${this.basicItems.length + 1}` });
  };

  public onBasicUpdate = (item: CrudListItem) => {
    const index = this.basicItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicItems[index].text = this.basicItems[index].text + ' ✓';
    }
  };

  public onBasicDelete = (item: CrudListItem) => {
    const index = this.basicItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicItems.splice(index, 1);
    }
  };

  // Example 2 callbacks
  public onAdvancedCreate = () => {
    this.advancedItems.push({ text: `Item ${this.advancedItems.length + 1}` });
  };

  public onAdvancedDelete = (item: CrudListItem) => {
    const index = this.advancedItems.findIndex(i => i === item);
    if (index !== -1) {
      this.advancedItems.splice(index, 1);
    }
  };

  // Example 3 callbacks
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

  // Code examples for documentation
  basicHtml = `<nc-crud-list 
  [items]="items" 
  [title]="'My Tasks'"
  [onCreate]="onCreate" 
  [onClick]="onClick" 
  [onUpdate]="onUpdate" 
  [onDelete]="onDelete"
></nc-crud-list>`;

  basicTs = `import { Component } from '@angular/core';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CrudList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage {
  public items: CrudListItem[] = [
    { text: 'Learn Angular' },
    { text: 'Build awesome apps' },
    { text: 'Deploy to production' }
  ];

  public onCreate = () => {
    this.items.push({ text: \`New task \${this.items.length + 1}\` });
  };

  public onClick = (item: CrudListItem) => {
    alert('Clicked: ' + item.text);
  };

  public onUpdate = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items[index].text += ' ✓';
    }
  };

  public onDelete = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;

  advancedHtml = `<nc-crud-list 
  [items]="items" 
  [title]="'Custom Styled List'"
  [striped]="false"
  [noItemsText]="'Add your first item using the + button'"
  [createButton]="true"
  [updateButton]="false"
  [deleteButton]="true"
  [onCreate]="onCreate" 
  [onClick]="onClick" 
  [onDelete]="onDelete"
  class="my-custom-class"
></nc-crud-list>`;

  advancedTs = `import { Component } from '@angular/core';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CrudList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage {
  public items: CrudListItem[] = [
    { text: 'Item with no update button' },
    { text: 'Delete-only item' }
  ];

  public onCreate = () => {
    this.items.push({ text: \`Item \${this.items.length + 1}\` });
  };

  public onClick = (item: CrudListItem) => {
    console.log('Clicked:', item);
  };

  public onDelete = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;

  templateHtml = `<!-- Define custom templates -->
<ng-template #boldTemplate let-item let-i="index">
  <span class="nc-crud-list-item-text" (click)="onClick(item)">
    <strong>{{ item.text }}</strong> 🔥
  </span>
</ng-template>

<ng-template #colorTemplate let-item>
  <span class="nc-crud-list-item-text" (click)="onClick(item)" 
        style="color: #e74c3c;">
    {{ item.text }} ✨
  </span>
</ng-template>

<nc-crud-list 
  [items]="items" 
  [title]="'Custom Template List'"
  [onCreate]="onCreate" 
  [onClick]="onClick" 
  [onUpdate]="onUpdate" 
  [onDelete]="onDelete"
></nc-crud-list>`;

  templateTs = `import { Component, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CrudList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage implements AfterViewInit {
  @ViewChild('boldTemplate') boldTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;
  
  public items: CrudListItem[] = [
    { text: 'Regular text item' },
    { text: 'Bold custom item' },
    { text: 'Colored custom item' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // IMPORTANT: Assign templates AFTER view is initialized
    this.items[1].template = this.boldTemplate;
    this.items[2].template = this.colorTemplate;
    this.cdr.detectChanges(); // Trigger change detection
  }

  public onCreate = () => {
    this.items.push({ text: \`Item \${this.items.length + 1}\` });
  };

  public onClick = (item: CrudListItem) => {
    alert('Clicked: ' + item.text);
  };

  public onUpdate = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items[index].text += ' UPDATED';
    }
  };

  public onDelete = (item: CrudListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;
}
