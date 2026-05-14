// ng component
import { Component, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Container } from '../../ncss/layout/container/container.component';
import { CrudList, CrudListItem } from '../../ncss/lists/crud-list/crud-list.component';
import { CardList, CardListItem } from '../../ncss/lists/card-list/card-list.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.css'],
  imports: [CommonModule, Container, CrudList, CardList, Card, Highlight]
})



export class ListsPage implements AfterViewInit {
  @ViewChild('boldTemplate') boldTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;
  @ViewChild('cardTemplate') cardTemplate!: TemplateRef<any>;
  @ViewChild('cardListBoldTemplate') cardListBoldTemplate!: TemplateRef<any>;
  @ViewChild('cardListColorTemplate') cardListColorTemplate!: TemplateRef<any>;
  @ViewChild('cardListAccentTemplate') cardListAccentTemplate!: TemplateRef<any>;
  
  // CRUD List Examples
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

  // Card List Examples
  // Example 1: Basic card items
  public basicCardItems: CardListItem[] = [
    { title: 'Project Alpha', text: 'Main application development' },
    { title: 'Project Beta', text: 'Testing and QA phase' },
    { title: 'Project Gamma' }
  ];

  // Example 2: Advanced card items
  public advancedCardItems: CardListItem[] = [
    { title: 'Feature Request', text: 'Add dark mode support' },
    { title: 'Bug Fix', text: 'Fix login validation' }
  ];

  // Example 3: Card items with custom templates
  public cardItems: CardListItem[] = [
    { title: 'Regular Documentation', text: 'Standard card appearance with default styling' },
    { title: 'Featured Release v2.0', text: 'Major update with breaking changes' },
    { title: 'Critical Security Patch', text: 'Requires immediate attention' },
    { title: 'Quick Update', text: 'Minor bug fixes and improvements' }
  ];

  public cardListTitle: string = 'Release Notes';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Assign templates to CRUD list items
    this.items[1].template = this.boldTemplate;
    this.items[2].template = this.colorTemplate;
    this.items[4].template = this.cardTemplate;

    // Assign templates to Card list items
    this.cardItems[1].template = this.cardListBoldTemplate;
    this.cardItems[2].template = this.cardListColorTemplate;
    this.cardItems[3].template = this.cardListAccentTemplate;
    
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

  // Card List callbacks
  // Example 1 callbacks
  public onCardBasicCreate = () => {
    this.basicCardItems.push({ 
      title: `Project ${this.basicCardItems.length + 1}`, 
      text: 'New project description' 
    });
  };

  public onCardBasicUpdate = (item: CardListItem) => {
    const index = this.basicCardItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicCardItems[index].title = this.basicCardItems[index].title + ' ✓';
    }
  };

  public onCardBasicDelete = (item: CardListItem) => {
    const index = this.basicCardItems.findIndex(i => i === item);
    if (index !== -1) {
      this.basicCardItems.splice(index, 1);
    }
  };

  public onCardClick = (item: CardListItem) => {
    alert('Clicked card: ' + item.title);
  };

  // Example 2 callbacks
  public onCardAdvancedCreate = () => {
    this.advancedCardItems.push({ 
      title: `Task ${this.advancedCardItems.length + 1}`,
      text: 'Task description'
    });
  };

  public onCardAdvancedDelete = (item: CardListItem) => {
    const index = this.advancedCardItems.findIndex(i => i === item);
    if (index !== -1) {
      this.advancedCardItems.splice(index, 1);
    }
  };

  // Example 3 callbacks
  public onCardCreate = () => {
    const newItemNumber = this.cardItems.length + 1;
    this.cardItems.push({ 
      title: `Card Item ${newItemNumber}`,
      text: 'Description for new item'
    });
  };

  public onCardUpdate = (item: CardListItem) => {
    const index = this.cardItems.findIndex(i => i === item);
    if (index !== -1) {
      this.cardItems[index].title = this.cardItems[index].title + ' UPDATED';
    }
  };

  public onCardDelete = (item: CardListItem) => {
    const index = this.cardItems.findIndex(i => i === item);
    if (index !== -1) {
      this.cardItems.splice(index, 1);
    }
  };

  // C
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

  // Card List code examples
  cardBasicHtml = `<nc-card-list 
  [items]="items" 
  [title]="'My Projects'"
  [onCreate]="onCreate" 
  [onClick]="onClick" 
  [onUpdate]="onUpdate" 
  [onDelete]="onDelete"
></nc-card-list>`;

  cardBasicTs = `import { Component } from '@angular/core';
import { CardList, CardListItem } from '../../ncss/lists/card-list/card-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CardList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage {
  public items: CardListItem[] = [
    { title: 'Project Alpha', text: 'Main application development' },
    { title: 'Project Beta', text: 'Testing and QA phase' },
    { title: 'Project Gamma' }
  ];

  public onCreate = () => {
    this.items.push({ 
      title: \`Project \${this.items.length + 1}\`,
      text: 'New project description'
    });
  };

  public onClick = (item: CardListItem) => {
    alert('Clicked: ' + item.title);
  };

  public onUpdate = (item: CardListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items[index].title += ' ✓';
    }
  };

  public onDelete = (item: CardListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;

  cardAdvancedHtml = `<nc-card-list 
  [items]="items" 
  [title]="'Task List'"
  [striped]="true"
  [noItemsText]="'Add your first task using the + button'"
  [createButton]="true"
  [updateButton]="false"
  [deleteButton]="true"
  [onCreate]="onCreate" 
  [onClick]="onClick" 
  [onDelete]="onDelete"
  class="my-custom-class"
></nc-card-list>`;

  cardAdvancedTs = `import { Component } from '@angular/core';
import { CardList, CardListItem } from '../../ncss/lists/card-list/card-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CardList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage {
  public items: CardListItem[] = [
    { title: 'Feature Request', text: 'Add dark mode support' },
    { title: 'Bug Fix', text: 'Fix login validation' }
  ];

  public onCreate = () => {
    this.items.push({ 
      title: \`Task \${this.items.length + 1}\`,
      text: 'Task description'
    });
  };

  public onClick = (item: CardListItem) => {
    console.log('Clicked:', item);
  };

  public onDelete = (item: CardListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;

  cardTemplateHtml = `<!-- Define custom templates - component wraps in nc-card-list-item-content -->\n<ng-template #featuredTemplate let-item>\n  <span style=\"display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); \n               color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; \n               font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;\">Featured</span>\n  <span class=\"nc-card-list-item-title section-title-light\">\n    <strong>{{ item.title }}</strong>\n  </span>\n  @if (item.text) {\n    <span class=\"nc-card-list-item-text section-subtitle-light\">{{ item.text }}</span>\n  }\n</ng-template>\n\n<ng-template #urgentTemplate let-item>\n  <div style=\"display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;\">\n    <span style=\"display: inline-block; width: 8px; height: 8px; background-color: #e74c3c; \n                 border-radius: 50%; box-shadow: 0 0 8px rgba(231, 76, 60, 0.6);\"></span>\n    <span style=\"color: #e74c3c; font-size: 0.75rem; font-weight: 700; \n                 text-transform: uppercase; letter-spacing: 0.5px;\">Urgent</span>\n  </div>\n  <span class=\"nc-card-list-item-title section-title-light\" style=\"color: #e74c3c;\">\n    <strong>{{ item.title }}</strong>\n  </span>\n  @if (item.text) {\n    <span class=\"nc-card-list-item-text section-subtitle-light\" style=\"color: #c0392b;\">\n      {{ item.text }}\n    </span>\n  }\n</ng-template>\n\n<ng-template #quickTemplate let-item>\n  <div style=\"display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;\">\n    <span style=\"font-size: 1rem;\">\u26a1</span>\n    <span style=\"font-size: 0.75rem; font-weight: 700; text-transform: uppercase; \n                 letter-spacing: 0.5px; color: var(--nc-text-color-light);\">Quick</span>\n  </div>\n  <span class=\"nc-card-list-item-title section-title-light\">\n    {{ item.title }}\n  </span>\n  @if (item.text) {\n    <span class=\"nc-card-list-item-text section-subtitle-light\">{{ item.text }}</span>\n  }\n</ng-template>\n\n<nc-card-list \n  [items]=\"items\" \n  [title]=\"'Release Notes'\"\n  [onCreate]=\"onCreate\" \n  [onClick]=\"onClick\" \n  [onUpdate]=\"onUpdate\" \n  [onDelete]=\"onDelete\"\n></nc-card-list>`;

  cardTemplateTs = `import { Component, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CardList, CardListItem } from '../../ncss/lists/card-list/card-list.component';

@Component({
  selector: 'app-my-page',
  imports: [CardList],
  templateUrl: './my-page.html',
  styleUrls: ['./my-page.css']
})
export class MyPage implements AfterViewInit {
  @ViewChild('featuredTemplate') featuredTemplate!: TemplateRef<any>;
  @ViewChild('urgentTemplate') urgentTemplate!: TemplateRef<any>;
  @ViewChild('quickTemplate') quickTemplate!: TemplateRef<any>;
  
  public items: CardListItem[] = [
    { title: 'Regular Documentation', text: 'Standard card appearance' },
    { title: 'Featured Release v2.0', text: 'Major update with breaking changes' },
    { title: 'Critical Security Patch', text: 'Requires immediate attention' },
    { title: 'Quick Update', text: 'Minor bug fixes' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // IMPORTANT: Assign templates AFTER view is initialized
    this.items[1].template = this.featuredTemplate;
    this.items[2].template = this.urgentTemplate;
    this.items[3].template = this.quickTemplate;
    this.cdr.detectChanges(); // Trigger change detection
  }

  public onCreate = () => {
    this.items.push({ 
      title: \`Release \${this.items.length + 1}\`,
      text: 'New release notes'
    });
  };

  public onClick = (item: CardListItem) => {
    alert('Clicked: ' + item.title);
  };

  public onUpdate = (item: CardListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items[index].title += ' [UPDATED]';
    }
  };

  public onDelete = (item: CardListItem) => {
    const index = this.items.findIndex(i => i === item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };
}`;
}
