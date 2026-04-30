import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { EyeIcon, EyeCrossedIcon } from '../../icons';
import { SquareButton } from '../../buttons/square-button/square-button.component';




export interface SelectOption {
  value: string;
  label: string;
}




@Component({
  selector: 'nc-password',
  imports: [EyeIcon, EyeCrossedIcon, SquareButton],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})



export class Password {
  @Input() class?: string = '';
  @Input() style?: { [key: string]: string } = {};
  @Input() id?: string = '';
  @Input() width?: string = '';
  @Input() onClick?: () => void = () => {};
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() value: string = '';
  @Input() onChange: (value: string) => void = () => {};
  @Input() name: string = '';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() required: boolean = false;
  @Input() defaultValue: string = '';

  @ViewChild('passwordInputRef') passwordInputRef!: ElementRef<HTMLInputElement>;
  public isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public getValue() {
    return this.passwordInputRef.nativeElement.value;
  }

  public setValue(value: string) {
    this.passwordInputRef.nativeElement.value = value;
  }

  public clear() {
    this.setValue('');
  }

  
}