import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, input, output, TemplateRef } from '@angular/core';
import { Button } from '../../buttons/button';
import { DeleteIcon } from '../../icons/delete.icon';
import { EditIcon } from '../../icons/edit.icon';
import { PlusIcon } from '../../icons/plus.icon';
import type { ListItemContext } from '../crud-list/crud-list';

/** Every field is optional. Add any other fields you like: you get the whole item back in the events. */
export interface CardListItem {
  title?: string;
  text?: string;
}

@Component({
  selector: 'nc-card-list',
  imports: [NgTemplateOutlet, Button, PlusIcon, EditIcon, DeleteIcon],
  templateUrl: './card-list.html',
  styleUrls: ['../list-base.css', './card-list.css'],
  host: { class: 'card-list' }
})
export class CardList<T extends CardListItem = CardListItem> {
  readonly items = input.required<T[]>();
  readonly heading = input('');
  readonly emptyText = input('No items found');
  readonly striped = input(false, { transform: booleanAttribute });
  /** Makes the content clickable (a real button) and turns on `(open)`. */
  readonly clickable = input(false, { transform: booleanAttribute });
  /** Replaces the title and text of every card. Use `@if` inside it to vary cards. */
  readonly itemTemplate = input<TemplateRef<ListItemContext<T>>>();

  /** Show or hide the buttons. */
  readonly addButton = input(true, { transform: booleanAttribute });
  readonly editButton = input(true, { transform: booleanAttribute });
  readonly removeButton = input(true, { transform: booleanAttribute });
  /** Accessible names of the buttons (translate them). The item's title is added after the name, e.g. "Edit, Buy milk". */
  readonly addLabel = input('Add');
  readonly editLabel = input('Edit');
  readonly removeLabel = input('Delete');

  readonly add = output<void>();
  readonly edit = output<T>();
  readonly remove = output<T>();
  readonly open = output<T>();

  protected label(name: string, item: T): string {
    const subject = item.title || item.text;
    return subject ? `${name}, ${subject}` : name;
  }
}
