import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nc-reload-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      aria-hidden="true"
      [attr.id]="id()"
      [attr.class]="class()"
      [ngStyle]="style()"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [style.display]="'inline-block'"
      [style.vertical-align]="'middle'"
    >
      <g [attr.transform]="'scale(' + size() / 24 + ')'">
        <path
          d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
          [attr.stroke]="color()"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `],
})
export class ReloadIcon {
  size = input<number>(24);
  color = input<string>('currentColor');
  class = input<string>('');
  id = input<string>('');
  style = input<{ [key: string]: string }>({});
}
