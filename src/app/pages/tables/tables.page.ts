// ng component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Container } from '../../ncss/layout/container/container.component';
import { VirtualizedTable, FilterPreset } from '../../ncss/tables/virtualized-table/virtualized-table';
import { Card } from '../../ncss/cards/card/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.css'],
  imports: [CommonModule, Container, VirtualizedTable, Card, Highlight]
})



export class TablesPage {
  // Sample data for the table
  public tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, role: 'Designer', active: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager', active: false },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', age: 29, role: 'Developer', active: true },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', age: 52, role: 'Director', active: true },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 31, role: 'Designer', active: true },
    { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', age: 38, role: 'Developer', active: false },
    { id: 8, name: 'Fiona Green', email: 'fiona@example.com', age: 27, role: 'Analyst', active: true },
    { id: 9, name: 'George Miller', email: 'george@example.com', age: 41, role: 'Manager', active: true },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', age: 33, role: 'Developer', active: true },
    { id: 11, name: 'Ian Malcolm', email: 'ian@example.com', age: 47, role: 'Scientist', active: false },
    { id: 12, name: 'Julia Roberts', email: 'julia@example.com', age: 36, role: 'Designer', active: true },
    { id: 13, name: 'Kevin Hart', email: 'kevin@example.com', age: 29, role: 'Developer', active: true },
    { id: 14, name: 'Laura Palmer', email: 'laura@example.com', age: 25, role: 'Intern', active: true },
    { id: 15, name: 'Mike Ross', email: 'mike@example.com', age: 30, role: 'Developer', active: true },
    { id: 16, name: 'Nancy Drew', email: 'nancy@example.com', age: 26, role: 'Detective', active: true },
    { id: 17, name: 'Oscar Wilde', email: 'oscar@example.com', age: 43, role: 'Writer', active: true },
    { id: 18, name: 'Patricia Clark', email: 'patricia@example.com', age: 35, role: 'Manager', active: true },
    { id: 19, name: 'Quinn Turner', email: 'quinn@example.com', age: 29, role: 'Developer', active: false },
    { id: 20, name: 'Rachel Green', email: 'rachel@example.com', age: 32, role: 'Designer', active: true },
    { id: 21, name: 'Samuel Jackson', email: 'samuel@example.com', age: 48, role: 'Director', active: true },
    { id: 22, name: 'Tina Fey', email: 'tina@example.com', age: 40, role: 'Developer', active: true },
    { id: 23, name: 'Uma Thurman', email: 'uma@example.com', age: 37, role: 'Analyst', active: false },
    { id: 24, name: 'Victor Stone', email: 'victor@example.com', age: 31, role: 'Developer', active: true },
    { id: 25, name: 'Wendy Adams', email: 'wendy@example.com', age: 28, role: 'Designer', active: true },
    { id: 26, name: 'Xavier Charles', email: 'xavier@example.com', age: 55, role: 'Director', active: true },
    { id: 27, name: 'Yolanda Martinez', email: 'yolanda@example.com', age: 33, role: 'Manager', active: true },
    { id: 28, name: 'Zachary Taylor', email: 'zachary@example.com', age: 42, role: 'Developer', active: false },
    { id: 29, name: 'Amy Santiago', email: 'amy@example.com', age: 30, role: 'Analyst', active: true },
    { id: 30, name: 'Bruce Wayne', email: 'bruce@example.com', age: 38, role: 'Developer', active: true },
    { id: 31, name: 'Catherine Zeta', email: 'catherine@example.com', age: 44, role: 'Designer', active: true },
    { id: 32, name: 'David Martinez', email: 'david@example.com', age: 27, role: 'Intern', active: true },
    { id: 33, name: 'Emma Watson', email: 'emma@example.com', age: 29, role: 'Developer', active: true },
    { id: 34, name: 'Frank Castle', email: 'frank@example.com', age: 41, role: 'Manager', active: false },
    { id: 35, name: 'Grace Hopper', email: 'grace@example.com', age: 35, role: 'Developer', active: true },
    { id: 36, name: 'Henry Cavill', email: 'henry@example.com', age: 36, role: 'Designer', active: true },
    { id: 37, name: 'Iris West', email: 'iris@example.com', age: 28, role: 'Analyst', active: true },
    { id: 38, name: 'Jack Sparrow', email: 'jack@example.com', age: 45, role: 'Developer', active: false },
    { id: 39, name: 'Karen Page', email: 'karen@example.com', age: 32, role: 'Designer', active: true },
    { id: 40, name: 'Leonard Hofstadter', email: 'leonard@example.com', age: 37, role: 'Scientist', active: true },
    { id: 41, name: 'Monica Geller', email: 'monica@example.com', age: 34, role: 'Manager', active: true },
    { id: 42, name: 'Natasha Romanoff', email: 'natasha@example.com', age: 35, role: 'Developer', active: true },
    { id: 43, name: 'Oliver Queen', email: 'oliver@example.com', age: 39, role: 'Director', active: false },
    { id: 44, name: 'Phoebe Buffay', email: 'phoebe@example.com', age: 36, role: 'Designer', active: true },
    { id: 45, name: 'Quentin Beck', email: 'quentin@example.com', age: 40, role: 'Developer', active: true },
    { id: 46, name: 'Rose Tyler', email: 'rose@example.com', age: 26, role: 'Analyst', active: true },
    { id: 47, name: 'Steve Rogers', email: 'steve@example.com', age: 42, role: 'Manager', active: true },
    { id: 48, name: 'Tara King', email: 'tara@example.com', age: 29, role: 'Developer', active: false },
    { id: 49, name: 'Ursula Vernon', email: 'ursula@example.com', age: 31, role: 'Designer', active: true },
    { id: 50, name: 'Violet Baudelaire', email: 'violet@example.com', age: 24, role: 'Intern', active: true },
    { id: 51, name: 'Walter White', email: 'walter@example.com', age: 50, role: 'Scientist', active: true },
    { id: 52, name: 'Xena Warrior', email: 'xena@example.com', age: 33, role: 'Developer', active: true },
    { id: 53, name: 'Yvonne Strahovski', email: 'yvonne@example.com', age: 37, role: 'Analyst', active: false },
    { id: 54, name: 'Zoe Saldana', email: 'zoe@example.com', age: 38, role: 'Designer', active: true },
    { id: 55, name: 'Aaron Paul', email: 'aaron@example.com', age: 39, role: 'Developer', active: true },
    { id: 56, name: 'Betty Cooper', email: 'betty@example.com', age: 25, role: 'Analyst', active: true },
    { id: 57, name: 'Clark Kent', email: 'clark@example.com', age: 32, role: 'Developer', active: true },
    { id: 58, name: 'Dorothy Gale', email: 'dorothy@example.com', age: 27, role: 'Designer', active: false },
    { id: 59, name: 'Edward Elric', email: 'edward@example.com', age: 22, role: 'Intern', active: true },
    { id: 60, name: 'Felicity Smoak', email: 'felicity@example.com', age: 30, role: 'Developer', active: true },
    { id: 61, name: 'Garfield Logan', email: 'garfield@example.com', age: 28, role: 'Designer', active: true },
    { id: 62, name: 'Hermione Granger', email: 'hermione@example.com', age: 31, role: 'Manager', active: true },
    { id: 63, name: 'Isaac Newton', email: 'isaac@example.com', age: 46, role: 'Scientist', active: true },
    { id: 64, name: 'Jessica Jones', email: 'jessica@example.com', age: 34, role: 'Developer', active: false },
    { id: 65, name: 'Kara Danvers', email: 'kara@example.com', age: 27, role: 'Analyst', active: true },
    { id: 66, name: 'Luke Cage', email: 'luke@example.com', age: 36, role: 'Developer', active: true },
    { id: 67, name: 'Matt Murdock', email: 'matt@example.com', age: 35, role: 'Manager', active: true },
    { id: 68, name: 'Nora Allen', email: 'nora@example.com', age: 29, role: 'Designer', active: true },
    { id: 69, name: 'Ororo Munroe', email: 'ororo@example.com', age: 38, role: 'Developer', active: false },
    { id: 70, name: 'Peter Parker', email: 'peter@example.com', age: 24, role: 'Intern', active: true },
    { id: 71, name: 'Quincy Adams', email: 'quincy@example.com', age: 43, role: 'Director', active: true },
    { id: 72, name: 'Raven Darkholme', email: 'raven@example.com', age: 40, role: 'Developer', active: true },
    { id: 73, name: 'Selina Kyle', email: 'selina@example.com', age: 33, role: 'Designer', active: true },
    { id: 74, name: 'Tony Stark', email: 'tony@example.com', age: 48, role: 'Director', active: true },
    { id: 75, name: 'Ulysses Grant', email: 'ulysses@example.com', age: 51, role: 'Manager', active: false },
    { id: 76, name: 'Veronica Mars', email: 'veronica@example.com', age: 28, role: 'Analyst', active: true },
    { id: 77, name: 'Wade Wilson', email: 'wade@example.com', age: 37, role: 'Developer', active: true },
    { id: 78, name: 'Ximena Rodriguez', email: 'ximena@example.com', age: 26, role: 'Designer', active: true },
    { id: 79, name: 'Yara Greyjoy', email: 'yara@example.com', age: 32, role: 'Manager', active: true },
    { id: 80, name: 'Zara Larsson', email: 'zara@example.com', age: 25, role: 'Developer', active: false },
    { id: 81, name: 'Arthur Curry', email: 'arthur@example.com', age: 35, role: 'Developer', active: true },
    { id: 82, name: 'Barbara Gordon', email: 'barbara@example.com', age: 29, role: 'Analyst', active: true },
    { id: 83, name: 'Connor Kent', email: 'connor@example.com', age: 23, role: 'Intern', active: true },
    { id: 84, name: 'Donna Troy', email: 'donna@example.com', age: 31, role: 'Designer', active: true },
    { id: 85, name: 'Eric Brooks', email: 'eric@example.com', age: 44, role: 'Developer', active: false },
    { id: 86, name: 'Frost Emma', email: 'frost@example.com', age: 39, role: 'Manager', active: true },
    { id: 87, name: 'Gwen Stacy', email: 'gwen@example.com', age: 26, role: 'Developer', active: true },
    { id: 88, name: 'Hal Jordan', email: 'hal@example.com', age: 38, role: 'Developer', active: true },
    { id: 89, name: 'Ivy Pepper', email: 'ivy@example.com', age: 30, role: 'Designer', active: true },
    { id: 90, name: 'James Rhodes', email: 'james@example.com', age: 42, role: 'Director', active: true },
    { id: 91, name: 'Kate Kane', email: 'kate@example.com', age: 34, role: 'Manager', active: false },
    { id: 92, name: 'Logan Howlett', email: 'logan@example.com', age: 47, role: 'Developer', active: true },
    { id: 93, name: 'May Parker', email: 'may@example.com', age: 28, role: 'Analyst', active: true },
    { id: 94, name: 'Ned Leeds', email: 'ned@example.com', age: 25, role: 'Developer', active: true },
    { id: 95, name: 'Odin Borson', email: 'odin@example.com', age: 60, role: 'Director', active: true },
    { id: 96, name: 'Peggy Carter', email: 'peggy@example.com', age: 41, role: 'Manager', active: false },
    { id: 97, name: 'Riri Williams', email: 'riri@example.com', age: 22, role: 'Intern', active: true },
    { id: 98, name: 'Scott Lang', email: 'scott@example.com', age: 36, role: 'Developer', active: true },
    { id: 99, name: 'Thor Odinson', email: 'thor@example.com', age: 45, role: 'Developer', active: true },
    { id: 100, name: 'Wanda Maximoff', email: 'wanda@example.com', age: 30, role: 'Designer', active: true },
  ];

  // Filter presets for quick filtering
  public filterPresets: FilterPreset[] = [
    {
      name: 'Active Developers',
      filters: [
        { column: 'role', condition: 'equals', value: 'Developer', operator: 'and' },
        { column: 'active', condition: 'equals', value: 'true', operator: null }
      ]
    },
    {
      name: 'Senior Staff (40+)',
      filters: [
        { column: 'age', condition: 'greater_than', value: '40', operator: null }
      ]
    }
  ];



  public vtHTML = `
    <nc-virtualized-table
        [data]="tableData"
        [controls]="true"
        [horizontalSeparators]="true" //true is default - set to false to disable horizontal lines between rows
        [verticalSeparators]="true" // true is default - set to false to disable vertical lines between columns
        [striped]="true"
        [hover]="true"
        [filterPresets]="filterPresets"
        ariaLabel="Employee data table"
    />
  `;

  public vtTS = `
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { VirtualizedTable, FilterPreset } from '../../ncss/tables/virtualized-table/virtualized-table';

    @Component({
        selector: 'app-tables',
        templateUrl: './tables.page.html',
        styleUrls: ['./tables.page.css'],
        imports: [CommonModule, Container, VirtualizedTable, Card]
    })



    export class TablesPage {
        public tableData = [
          {{ '{' }} id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', active: true {{ '}' }},
          {{ '{' }} id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, role: 'Designer', active: true {{ '}' }},
          // ... more data
        ];

        public filterPresets: FilterPreset[] = [
          {{ '{' }}
              name: 'Active Developers',
              filters: [
              {{ '{' }} column: 'role', condition: 'equals', value: 'Developer', operator: 'and' {{ '}' }},
              {{ '{' }} column: 'active', condition: 'equals', value: 'true', operator: null {{ '}' }}
              ]
          {{ '}' }}
        ];
    }
  `;
}
