import { Component } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'select-page',
  imports: [Select, Card, Container, Highlight],
  templateUrl: './select.page.html',
  styleUrl: './select.page.css',
})



export class SelectPage {
    multipleSelectExampleValue: string[] = ['option3', 'option5'];

    onMultiselectChange(value: string | string[]) {
        this.multipleSelectExampleValue = value as string[];
    }

    htmlCode = `
    <nc-select
        placeholder="Default Trigger"
        [options]="options"
        [multiple]="true"
        [defaultValue]="['option3', 'option5']"
        [searchable]="true"
        [width]="'260px'"
        [optionsWidth]="'260px'"
        [onChange]="onMultiselectChange.bind(this)"
    ></nc-select>
        `;

    tsCode = `
    multipleSelectExampleValue: string[] = ['option3', 'option5'];

    onMultiselectChange(value: string | string[]) {
        this.multipleSelectExampleValue = value as string[];
    }
    `;
}