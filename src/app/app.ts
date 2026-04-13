import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNav } from './ncss/navs/topnav/topnav.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})



export class App {

}
