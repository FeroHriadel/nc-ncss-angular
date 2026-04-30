import { Component, Input, OnInit } from '@angular/core';
import { CheckIcon } from '../../icons';
import { SquareButton } from '../../buttons/square-button/square-button.component';




@Component({
  selector: 'nc-checkbox',
  imports: [CheckIcon, SquareButton],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})



export class Checkbox implements OnInit {
    @Input() class?: string = '';
    @Input() style?: { [key: string]: string } = {};
    @Input() inputClass?: string = '';
    @Input() inputStyle?: { [key: string]: string } = {};
    @Input() id?: string = ''
    @Input() onChange?: () => void;
    @Input() disabled: boolean = false;
    @Input() name?: string = '';
    @Input() checked?: boolean = false;
    @Input() label?: string = '';

    public isChecked: boolean = false;

    ngOnInit() {
        this.isChecked = this.checked ?? false;
    }

    toggleChecked() {
        this.isChecked = !this.isChecked;
        if (this.onChange) { this.onChange(); }
    }

    public getValue() {
        return this.isChecked;
    }

    public setValue(value: boolean) {
        this.isChecked = value;
    }
}