import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CheckIcon } from '../../icons';
import { SquareButton } from '../../buttons/square-button/square-button.component';




export interface SelectOption {
  value: string;
  label: string;
}




@Component({
  selector: 'nc-checkbox',
  imports: [CheckIcon, SquareButton],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})



export class Checkbox {
    @Input() class?: string = '';
    @Input() style?: { [key: string]: string } = {};
    @Input() id?: string = ''
    @Input() onChange?: () => void = () => {};
    @Input() disabled: boolean = false;
    @Input() name?: string = '';
    @Input() checked?: boolean = false;

    public isChecked: boolean = this.checked ?? false;

    toggleChecked() {
        this.isChecked = !this.isChecked;
        if (this.onChange) {
            this.onChange();
        }
        console.log('Checkbox state changed:', this.isChecked);
    }

    public getValue() {
        return this.isChecked;
    }

    public setValue(value: boolean) {
        this.isChecked = value;
    }
}