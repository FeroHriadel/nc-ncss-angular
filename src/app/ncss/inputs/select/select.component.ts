import { Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChevronDownIcon, CheckIcon } from '../../icons';



export interface SelectOption {
  value: string;
  label: string;
}




@Component({
  selector: 'nc-select',
  imports: [ChevronDownIcon, CheckIcon],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})



export class Select implements OnInit {
  @ContentChild('[slot="trigger"]') trigger?: ElementRef;
  @ViewChild('defaultTrigger') defaultTrigger?: ElementRef;
  @Input() options?: SelectOption[] = [];
  @Input() width?: string = 'var(--nc-select-width)';
  @Input() optionsWidth?: string = 'var(--nc-select-width)';
  @Input() multiple?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() defaultValue?: string | string[] = '';
  @Input() onChange?: (value: string | string[]) => void = () => {};
  @Input() class?: string = '';
  @Input() style?: { [key: string]: string } = {};
  @Input() name?: string = '';
  @Input() required?: boolean = false;
  @Input() id?: string = '';
  @Input() ariaLabel?: string = this.name || 'Select an option';
  @Input() toggleOpen? = () => {};

  public value: string | string[] = '';
  public triggerText: string = '';
  public isOpen: boolean = false;



  ngOnInit(): void {
    console.log('isOpen on init:', this.isOpen);
      this.populateDefaultValue();
      this.checkMultipleValue();
  }

  checkMultipleValue() {
    if (this.multiple && !Array.isArray(this.value)) {
      this.value = [];
    }
  }

  populateDefaultValue() {
    if (this.multiple && Array.isArray(this.defaultValue)) {
      this.value = this.defaultValue;
    } else if (!this.multiple && typeof this.defaultValue === 'string') {
      this.value = this.defaultValue;
    }
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  handleOptionClick(option: SelectOption) {
    if (this.disabled) return;
    if (this.multiple) {
      const index = (this.value as string[]).indexOf(option.value);
      if (index > -1) {
        (this.value as string[]).splice(index, 1);
      } else {
        (this.value as string[]).push(option.value);
      }
    } else {
      this.value = option.value;
    }
    this.onChange?.(this.value);
  }

  isSelected(option: SelectOption): boolean {
    if (this.multiple) {
      return (this.value as string[]).includes(option.value);
    } else {
      return this.value === option.value;
    }
  }

  getTriggerText() {
    if (this.multiple && this.value.length) {
      return `${this.value.length} selected`;
    } else if (!this.multiple && this.value) {
      const selectedOption = this.options?.find(opt => opt.value === this.value);
      return selectedOption ? selectedOption.label : '';
    } else {
      return '';
    }
  }

  getOptionsDirection() {
    const triggerElement = this.trigger?.nativeElement || this.defaultTrigger?.nativeElement;
    if (!triggerElement) throw new Error('Trigger element not found, cannot open select options');
    const triggerBottom = triggerElement.getBoundingClientRect().bottom;
    const optionsCount = this.options?.length || 0;
    const optionHeight = 40; // from CSS => 2.5rem
    const maxOptionsShown = 6; // maxHeight from CSS => calc(6 * 2.5rem)
    const margin = 8 // 0.5rem => ensure dropdown doesn't touch the edge of the viewport
    const optionsHeight = Math.min(optionsCount, maxOptionsShown) * optionHeight;
    const hasSpaceBelow = triggerBottom + optionsHeight + margin < window.innerHeight;
    const hasSpaceAbove = triggerElement.getBoundingClientRect().top - optionsHeight - margin > 0;
    if (hasSpaceBelow) return 'down'
    else if (hasSpaceAbove) return 'up';
    else return 'down'; // default to down if no space above or below
  }

}