// ng component
import { Component, Input, OnInit } from '@angular/core';



@Component({  selector: 'nc-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
})



export class Switch implements OnInit {
    @Input() class?: string = '';
    @Input() style?: { [key: string]: string } = {};
    @Input() id?: string = ''
    @Input() onChange?: () => void = () => {};
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