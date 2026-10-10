import { Component } from '@angular/core';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.html',
  styleUrl: './colors.css'
})
export class Colors {
  protected readonly steps = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];
  protected readonly scales = ['gray', 'red'];
}
