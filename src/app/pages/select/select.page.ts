import { Component, ViewChild } from '@angular/core';
import { Select } from '../../ncss/inputs/select/select.component';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Highlight } from 'ngx-highlightjs';
import { HamburgerIcon } from '../../ncss/icons';
import { Button } from '../../ncss/buttons/button/button.component';



@Component({
  selector: 'select-page',
  imports: [Select, Card, Container, Highlight, HamburgerIcon, Button],
  templateUrl: './select.page.html',
  styleUrl: './select.page.css',
})



export class SelectPage {
    @ViewChild('mySelect') mySelect?: Select;

    multipleSelectExampleValue: string[] = ['option3', 'option5'];

    onMultiselectChange(value: string | string[]) {
        this.multipleSelectExampleValue = value as string[];
    }

    onSelectChange (value: string | string[]) {
        alert('Selected value: ' + value);
    }

    getSelectedValue() {
        const value = this.mySelect?.value;
        alert('Current selected value: ' + value);
    }

    setSelectedValue(value: string | string[]) {
        this.mySelect?.setValue(value);
    }

    clearSelectedValue() {
        this.mySelect?.clear();
    }

    htmlCode = `
    <nc-select
        placeholder="Choose options"
        name="multiple-select-example"
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
    import { Select, SelectOption } from '../../ncss/inputs/select/select.component';

    @Component({
        selector: 'my-page',
        imports: [Select, Card, Container, Highlight],
        templateUrl: './my-page.html',
        styleUrl: './my-page.css',
    })

    export class MyPage {
        public options: SelectOption[] = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
            { label: 'Option 4', value: 'option4' },
            { label: 'Option 5', value: 'option5' },
            { label: 'Option 6', value: 'option6' },
            { label: 'Option 7', value: 'option7' },
            { label: 'Option 8', value: 'option8' },
            { label: 'Option 9', value: 'option9' },
            { label: 'Option 10', value: 'option10' }
        ];

        public multipleSelectValue: string[] = ['option3', 'option5'];

        public onMultiselectChange(value: string | string[]) {
            this.multipleSelectValue = value as string[];
        }
    
    }
    `;

    customTriggerHtmlCode = `
    <nc-select
        [customTrigger]="true"
        [options]="[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
        ]"
    >
        <nc-hamburger-icon></nc-hamburger-icon>
    </nc-select>
    `;

    programmaticControlHtmlCode = `
    <nc-select
        #mySelect
        placeholder="Choose an option"
        name="programmatic-control-example"
        [options]="[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' }
        ]"
        [onChange]="onSelectChange.bind(this)"
    ></nc-select>

    <button (click)="getSelectedValue()">Get Selected Value</button>
    <button (click)="setSelectedValue('option2')">Set Value to Option 2</button>
    <button (click)="clearSelectedValue()">Clear Value</button>
    `;

    programmaticControlTsCode = `
    import { Component, ViewChild } from '@angular/core';
    import { Select } from '../../ncss/inputs/select/select.component';

    @Component({
        selector: 'my-page',
        imports: [Select, Card, Container, Highlight],
        templateUrl: './my-page.html',
        styleUrl: './my-page.css',
    })

    export class MyPage {
        @ViewChild('mySelect') mySelect?: Select;

        onSelectChange (value: string | string[]) {
            alert('Selected value: ' + value);
        }

        getSelectedValue() {
            const value = this.mySelect?.value;
            alert('Current selected value: ' + value);
        }

        setSelectedValue(value: string | string[]) {
            this.mySelect?.setValue(value);
        }

        clearSelectedValue() {
            this.mySelect?.clear();
        }
    }
    `;


}