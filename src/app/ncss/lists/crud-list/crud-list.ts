import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, input, output, TemplateRef } from '@angular/core';
import { Button } from '../../buttons/button';
import { DeleteIcon } from '../../icons/delete.icon';
import { EditIcon } from '../../icons/edit.icon';
import { PlusIcon } from '../../icons/plus.icon';

/** The only thing an item needs is `text`. Add any other fields you like: you get the whole item back in the events. */
export interface CrudListItem {
  text: string;
}

/** What a custom `[itemTemplate]` receives: `let-item let-i="index"`. */
export interface ListItemContext<T> {
  $implicit: T;
  index: number;
}

@Component({
  selector: 'nc-crud-list',
  imports: [NgTemplateOutlet, Button, PlusIcon, EditIcon, DeleteIcon],
  templateUrl: './crud-list.html',
  styleUrls: ['../list-base.css', './crud-list.css'],
  host: { class: 'crud-list card card-light' }
})
export class CrudList<T extends CrudListItem = CrudListItem> {
  readonly items = input.required<T[]>();
  readonly heading = input('');
  readonly emptyText = input('No items found');
  readonly striped = input(true, { transform: booleanAttribute });
  /** Makes the text clickable (a real button) and turns on `(open)`. */
  readonly clickable = input(false, { transform: booleanAttribute });
  /** Replaces the text of every item. Use `@if` inside it to vary items. */
  readonly itemTemplate = input<TemplateRef<ListItemContext<T>>>();

  /** Show or hide the buttons. */
  readonly addButton = input(true, { transform: booleanAttribute });
  readonly editButton = input(true, { transform: booleanAttribute });
  readonly removeButton = input(true, { transform: booleanAttribute });
  /** Accessible names of the buttons (translate them). The item's text is added after the name, e.g. "Edit, Buy milk". */
  readonly addLabel = input('Add');
  readonly editLabel = input('Edit');
  readonly removeLabel = input('Delete');

  readonly add = output<void>();
  readonly edit = output<T>();
  readonly remove = output<T>();
  readonly open = output<T>();

  protected label(name: string, item: T): string {
    return item.text ? `${name}, ${item.text}` : name;
  }
}
