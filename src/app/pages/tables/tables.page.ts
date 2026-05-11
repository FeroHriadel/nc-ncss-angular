// ng component
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Container } from '../../ncss/layout/container/container.component';
import { VirtualizedTable, FilterPreset, Column } from '../../ncss/tables/virtualized-table/virtualized-table';
import { Table } from '../../ncss/tables/table/table';
import { Card } from '../../ncss/cards/card/card.component';
import { Highlight } from 'ngx-highlightjs';
import { Button } from '../../ncss/buttons/button/button.component';



@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.css'],
  imports: [CommonModule, Container, VirtualizedTable, Table, Card, Highlight, Button]
})



export class TablesPage {
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
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

  // Data for column width and row height demonstration
  public customTableData = [
    { id: 1, name: 'Sarah Johnson', department: 'Engineering', description: 'Senior Full-Stack Developer specializing in Angular and Node.js. Lead architect for microservices platform.', status: 'Active', priority: 'High' },
    { id: 2, name: 'Michael Chen', department: 'Product', description: 'Product Manager', status: 'Active', priority: 'Medium' },
    { id: 3, name: 'Emily Rodriguez', department: 'Design', description: 'UX/UI Designer with expertise in user research, wireframing, prototyping, and design systems. Currently leading the redesign of our mobile application.', status: 'On Leave', priority: 'Low' },
    { id: 4, name: 'David Thompson', department: 'Engineering', description: 'DevOps Engineer responsible for CI/CD pipelines, infrastructure automation, and cloud architecture on AWS and Azure.', status: 'Active', priority: 'High' },
    { id: 5, name: 'Lisa Wang', department: 'Marketing', description: 'Content Marketing Specialist focusing on technical blog posts, case studies, and social media strategy for developer audience.', status: 'Active', priority: 'Medium' },
    { id: 6, name: 'James Anderson', department: 'Sales', description: 'Account Executive', status: 'Active', priority: 'Medium' },
    { id: 7, name: 'Maria Garcia', department: 'Engineering', description: 'Machine Learning Engineer working on recommendation systems and natural language processing models using TensorFlow and PyTorch.', status: 'Active', priority: 'High' },
    { id: 8, name: 'Robert Taylor', department: 'HR', description: 'HR Business Partner managing recruitment, onboarding, employee relations, and performance management for the engineering organization.', status: 'Active', priority: 'Low' },
    { id: 9, name: 'Jennifer Lee', department: 'Engineering', description: 'QA Engineer', status: 'Active', priority: 'Medium' },
    { id: 10, name: 'William Brown', department: 'Finance', description: 'Financial Analyst providing insights on revenue forecasting, budget planning, and financial modeling for strategic initiatives.', status: 'Active', priority: 'High' },
    { id: 11, name: 'Jessica Martinez', department: 'Product', description: 'Product Designer collaborating with engineering and product management to create intuitive user interfaces and seamless user experiences.', status: 'On Leave', priority: 'Medium' },
    { id: 12, name: 'Christopher Davis', department: 'Engineering', description: 'Frontend Developer', status: 'Active', priority: 'Medium' },
    { id: 13, name: 'Amanda Wilson', department: 'Customer Success', description: 'Customer Success Manager dedicated to ensuring client satisfaction, managing escalations, and driving product adoption and retention.', status: 'Active', priority: 'High' },
    { id: 14, name: 'Daniel Moore', department: 'Engineering', description: 'Security Engineer implementing security best practices, conducting vulnerability assessments, and managing incident response procedures.', status: 'Active', priority: 'High' },
    { id: 15, name: 'Michelle Thomas', department: 'Design', description: 'Design Lead', status: 'Active', priority: 'Medium' },
    { id: 16, name: 'Matthew Jackson', department: 'Engineering', description: 'Backend Developer specializing in API design, database optimization, and system architecture for high-traffic applications.', status: 'Active', priority: 'High' },
    { id: 17, name: 'Ashley White', department: 'Marketing', description: 'Digital Marketing Manager overseeing SEO, SEM, email campaigns, and marketing automation to drive lead generation and customer acquisition.', status: 'Active', priority: 'Medium' },
    { id: 18, name: 'Joshua Harris', department: 'Engineering', description: 'Mobile Developer', status: 'Active', priority: 'Medium' },
    { id: 19, name: 'Stephanie Martin', department: 'Operations', description: 'Operations Manager streamlining processes, coordinating cross-functional teams, and implementing operational efficiency improvements.', status: 'On Leave', priority: 'Low' },
    { id: 20, name: 'Andrew Thompson', department: 'Engineering', description: 'Data Engineer building and maintaining data pipelines, ETL processes, and data warehousing solutions for analytics and reporting.', status: 'Active', priority: 'High' },
    { id: 21, name: 'Nicole Garcia', department: 'Legal', description: 'Legal Counsel advising on contracts, compliance, intellectual property, and regulatory matters affecting business operations.', status: 'Active', priority: 'Medium' },
    { id: 22, name: 'Kevin Martinez', department: 'Engineering', description: 'Site Reliability Engineer', status: 'Active', priority: 'High' },
    { id: 23, name: 'Rachel Robinson', department: 'Product', description: 'Technical Product Manager with deep understanding of system architecture, translating complex technical requirements into user stories.', status: 'Active', priority: 'High' },
    { id: 24, name: 'Brandon Clark', department: 'Engineering', description: 'iOS Developer creating native mobile applications with Swift, integrating with backend services and implementing complex UI components.', status: 'Active', priority: 'Medium' },
    { id: 25, name: 'Lauren Rodriguez', department: 'Sales', description: 'Sales Engineer providing technical expertise during sales process, conducting product demonstrations and proof of concept implementations.', status: 'Active', priority: 'Medium' },
    { id: 26, name: 'Justin Lewis', department: 'Engineering', description: 'Tech Lead', status: 'Active', priority: 'High' },
    { id: 27, name: 'Megan Walker', department: 'Design', description: 'Motion Designer creating animations, micro-interactions, and video content to enhance user engagement and brand identity.', status: 'Active', priority: 'Low' },
    { id: 28, name: 'Ryan Hall', department: 'Engineering', description: 'Platform Engineer designing and implementing internal tools, developer platforms, and infrastructure services to improve developer productivity.', status: 'Active', priority: 'High' },
    { id: 29, name: 'Rebecca Allen', department: 'Research', description: 'UX Researcher conducting user interviews, usability testing, surveys, and data analysis to inform product decisions and design direction.', status: 'Active', priority: 'Medium' },
    { id: 30, name: 'Eric Young', department: 'Engineering', description: 'Android Developer building mobile applications with Kotlin, implementing material design patterns and optimizing app performance.', status: 'On Leave', priority: 'Medium' },
    { id: 31, name: 'Samantha King', department: 'Customer Success', description: 'Technical Support Lead', status: 'Active', priority: 'High' },
    { id: 32, name: 'Tyler Wright', department: 'Engineering', description: 'Cloud Architect designing scalable cloud infrastructure, evaluating cloud technologies, and establishing cloud governance and cost optimization strategies.', status: 'Active', priority: 'High' }
  ];

  // Column configuration with custom widths
  public customColumnsConfig = [
    { column: 'id', displayValue: 'ID', width: '60px' },
    { column: 'name', displayValue: 'Name', width: '180px' },
    { column: 'department', displayValue: 'Department', width: '140px' },
    { column: 'description', displayValue: 'Description', width: '400px' },
    { column: 'status', displayValue: 'Status', width: '100px' },
    { column: 'priority', displayValue: 'Priority', width: '100px' }
  ];

  // Regular Table (non-virtualized) code examples
  public regularTableHTML = `
    <nc-table
        [data]="tableData"
        [controls]="true"
        [horizontalSeparators]="true"
        [verticalSeparators]="true"
        [striped]="true"
        [hover]="true"
        [filterPresets]="filterPresets"
        ariaLabel="Employee data table"
    />
  `;

  public regularTableTS = `
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { Table, FilterPreset } from '../../ncss/tables/table/table';

    @Component({
        selector: 'app-tables',
        templateUrl: './tables.page.html',
        styleUrls: ['./tables.page.css'],
        imports: [CommonModule, Container, Table, Card]
    })

    export class TablesPage {
        public tableData = [
          {id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', active: true },
          {id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, role: 'Designer', active: true },
          // ... more data
        ];

        public filterPresets: FilterPreset[] = [
          {{ '{' }}
              name: 'Active Developers',
              filters: [
              {column: 'role', condition: 'equals', value: 'Developer', operator: 'and' },
              {column: 'active', condition: 'equals', value: 'true', operator: null }
              ]
          }
        ];
    }
  `;

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
          {id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', active: true },
          {id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 34, role: 'Designer', active: true },
          // ... more data
        ];

        public filterPresets: FilterPreset[] = [
          {{ '{' }}
              name: 'Active Developers',
              filters: [
              {column: 'role', condition: 'equals', value: 'Developer', operator: 'and' },
              {column: 'active', condition: 'equals', value: 'true', operator: null }
              ]
          }
        ];
    }
  `;

  public customWidthHTML = `
    <nc-virtualized-table
        [data]="customTableData"
        [columnsConfig]="customColumnsConfig"
        [controls]="true"
        [horizontalSeparators]="true"
        [verticalSeparators]="true"
        [striped]="true"
        [hover]="true"
        ariaLabel="Custom width table"
    />
  `;

  public customWidthTS = `
    import { Component } from '@angular/core';
    import { VirtualizedTable, Column } from '../../ncss/tables/virtualized-table/virtualized-table';

    export class TablesPage {
        // Define ALL columns with custom widths
        public customColumnsConfig: Column[] = [
          {column: 'id', displayValue: 'ID', width: '60px' },
          {column: 'name', displayValue: 'Name', width: '180px' },
          {column: 'department', displayValue: 'Department', width: '140px' },
          {column: 'description', displayValue: 'Description', width: '400px' },
          {column: 'status', displayValue: 'Status', width: '100px' },
          {column: 'priority', displayValue: 'Priority', width: '100px' }
        ];

        public customTableData = [
          {
            id: 1, 
            name: 'Sarah Johnson', 
            department: 'Engineering',
            description: 'Senior Full-Stack Developer specializing in Angular and Node.js.',
            status: 'Active',
            priority: 'High'
          },
          // ... more data
        ];
    }
  `;

  public heightAdjustmentHTML = `
    <!-- Adjust table height using CSS custom properties or inline styles -->
    <nc-virtualized-table
        [data]="tableData"
        [controls]="true"
        [style]="{'--table-max-height': '400px' }"
        ariaLabel="Custom height table"
    />

    <!-- Or use a CSS class -->
    <nc-virtualized-table
        [data]="tableData"
        [controls]="true"
        className="custom-height-table"
        ariaLabel="Custom height table"
    />
  `;

  public heightAdjustmentCSS = `
    /* In your component CSS file */
    .custom-height-table ::ng-deep .virtualized-table-body {
      max-height: 400px;
    }

    /* Or for a taller table */
    .tall-table ::ng-deep .virtualized-table-body {
      max-height: 800px;
    }

    /* Or remove height limit entirely */
    .no-height-limit ::ng-deep .virtualized-table-body {
      max-height: none;
    }
  `;

  // Reordered and renamed columns configuration
  public reorderedColumnsConfig: Column[] = [
    { column: 'name', displayValue: 'Full Name', width: '180px' },
    { column: 'role', displayValue: 'Job Title', width: '140px' },
    { column: 'email', displayValue: 'Email Address', width: '220px' },
    { column: 'age', displayValue: 'Age (Years)', width: '100px' },
    { column: 'active', displayValue: 'Status', width: '100px' },
    { column: 'id', displayValue: 'User ID', width: '80px' }
  ];

  public columnsConfigHTML = `
    <nc-virtualized-table
        [data]="tableData"
        [columnsConfig]="reorderedColumnsConfig"
        [controls]="true"
        [horizontalSeparators]="true"
        [verticalSeparators]="true"
        ariaLabel="Reordered and renamed columns table"
    />
  `;

  public columnsConfigTS = `
    import { Component } from '@angular/core';
    import { VirtualizedTable, Column } from '../../ncss/tables/virtualized-table/virtualized-table';

    export class TablesPage {
        // Your data - fields in any order
        public tableData = [
          {
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            age: 28, 
            role: 'Developer', 
            active: true 
          },
          // ... more data
        ];

        // Configure columns: reorder AND rename fields
        public reorderedColumnsConfig: Column[] = [
          // Put 'name' first instead of 'id'
          {column: 'name', displayValue: 'Full Name', width: '180px'},
          // Rename 'role' to 'Job Title'
          {column: 'role', displayValue: 'Job Title', width: '140px'},
          // Rename 'email' to 'Email Address'
          {column: 'email', displayValue: 'Email Address', width: '220px'},
          // Rename 'age' to 'Age (Years)'
          {column: 'age', displayValue: 'Age (Years)', width: '100px'},
          // Rename 'active' to 'Status'
          {column: 'active', displayValue: 'Status', width: '100px'},
          // Put 'id' last and rename to 'User ID'
          {column: 'id', displayValue: 'User ID', width: '80px'}
        ];
    }
  `;

  public columnsConfigNotes = `
    Key Points:
    
    1. REORDERING: The order of items in columnsConfig determines column display order
       - Data field order doesn't matter
       - columnsConfig order controls the visual order
    
    2. RENAMING: Use 'displayValue' to change column headers
       - 'column': references the data field name (must match exactly)
       - 'displayValue': the label shown in the table header
    
    3. DRAG & DROP: Users can reorder columns interactively
       - Click and drag any column header to reposition it
       - The new order persists during the session
    
    4. SHOW/HIDE: Control column visibility via the controls bar
       - Click the "Show/Hide Columns" button in the controls
       - Toggle checkboxes to show or hide specific columns
       - Hidden columns are excluded from display and filtering
  `;

  // Data with HTML content and templates
  public customHtmlTableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', role: 'Manager' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'pending', role: 'Developer' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'active', role: 'Director' }
  ];

  // HTML strings data example
  public htmlStringsTableData = [
    { 
      id: 1, 
      name: 'John Doe', 
      status: '<span style="color: green; font-weight: bold;">✓ Active</span>', 
      priority: '<span style="background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px;">High</span>'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: '<span style="color: red; font-weight: bold;">✗ Inactive</span>', 
      priority: '<span style="background: #64748b; color: white; padding: 4px 8px; border-radius: 4px;">Low</span>'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      status: '<span style="color: orange; font-weight: bold;">⏸ Pending</span>', 
      priority: '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px;">Medium</span>'
    }
  ];

  // Column config with templates (initialized in ngAfterViewInit)
  public customHtmlColumnsConfig: Column[] = [];

  ngAfterViewInit() {
    // Create a new array reference with templates to trigger change detection
    this.customHtmlColumnsConfig = [
      { column: 'id', displayValue: 'ID' },
      { column: 'name', displayValue: 'Name' },
      { column: 'email', displayValue: 'Email' },
      { column: 'status', displayValue: 'Status', template: this.statusTemplate },
      { column: 'role', displayValue: 'Actions', template: this.actionsTemplate }
    ];
  }

  handleEdit(row: any) {
    console.log('Edit clicked for:', row);
    alert(`Edit: ${row.name}`);
  }

  handleDelete(row: any) {
    console.log('Delete clicked for:', row);
    alert(`Delete: ${row.name}`);
  }

  // Code examples for custom HTML
  public customHtmlMethodOneHTML = `
    <!-- Method 1: HTML Strings (Auto-detected) -->
    <nc-virtualized-table
        [data]="htmlStringsTableData"
        [controls]="true"
        ariaLabel="Table with HTML string content"
    />
  `;

  public customHtmlMethodOneTS = `
    import { Component } from '@angular/core';
    import { VirtualizedTable } from '../../ncss/tables/virtualized-table/virtualized-table';

    export class TablesPage {{
        // HTML is automatically detected and rendered
        public htmlStringsTableData = [
          {
            id: 1,
            name: 'John Doe',
            status: '<span style="color: green; font-weight: bold;">✓ Active</span>',
            priority: '<span style="background: #22c55e; color: white; padding: 4px 8px;">High</span>'
          },
          {
            id: 2,
            name: 'Jane Smith',
            status: '<span style="color: red; font-weight: bold;">✗ Inactive</span>',
            priority: '<span style="background: #64748b; color: white; padding: 4px 8px;">Low</span>'
          }
        ];
    }}
  `;

  public customHtmlMethodTwoHTML = `
    <!-- Method 2: Angular Templates (Full Component Access) -->
    
    <!-- Define templates -->
    <ng-template #statusTemplate let-row>
      <span [style.color]="row.status === 'active' ? 'green' : row.status === 'inactive' ? 'red' : 'orange'"
            [style.font-weight]="'bold'">
        {{ '{{' }} row.status === 'active' ? '✓' : row.status === 'inactive' ? '✗' : '⏸' {{ '}}' }}
        {{ '{{' }} row.status | titlecase {{ '}}' }}
      </span>
    </ng-template>

    <ng-template #actionsTemplate let-row>
      <div style="display: flex; gap: 0.5rem;">
        <nc-button size="small" (click)="handleEdit(row)">Edit</nc-button>
        <nc-button size="small" variant="red" (click)="handleDelete(row)">Delete</nc-button>
      </div>
    </ng-template>

    <!-- Use table with templates -->
    <nc-virtualized-table
        [data]="customHtmlTableData"
        [columnsConfig]="customHtmlColumnsConfig"
        [controls]="true"
        ariaLabel="Table with custom templates"
    />
  `;

  public customHtmlMethodTwoTS = `
    import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
    import { VirtualizedTable, Column } from '../../ncss/tables/virtualized-table/virtualized-table';
    import { Button } from '../../ncss/buttons/button/button.component';

    @Component({{
      selector: 'app-tables',
      templateUrl: './tables.page.html',
      imports: [VirtualizedTable, Button]
    }})
    export class TablesPage implements AfterViewInit {{
      // ViewChild references to templates (must use static: true)
      @ViewChild('statusTemplate', {static: true }) statusTemplate!: TemplateRef<any>;
      @ViewChild('actionsTemplate', {static: true }) actionsTemplate!: TemplateRef<any>;

      public customHtmlTableData = [
        {id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Developer' },
        {id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'Designer' }
      ];

      // Initialize as empty array - will be populated in ngAfterViewInit
      public customHtmlColumnsConfig: Column[] = [];

      ngAfterViewInit() {{
        // IMPORTANT: Create a new array reference with templates after view initialization
        // This ensures templates are available and triggers change detection
        this.customHtmlColumnsConfig = [
          {column: 'id', displayValue: 'ID' },
          {column: 'name', displayValue: 'Name' },
          {column: 'email', displayValue: 'Email' },
          {column: 'status', displayValue: 'Status', template: this.statusTemplate },
          {column: 'role', displayValue: 'Actions', template: this.actionsTemplate }
        ];
      }}

      handleEdit(row: any) {{
        console.log('Edit:', row);
      }}

      handleDelete(row: any) {{
        console.log('Delete:', row);
      }}
    }}
  `;

  public customHtmlTemplateContext = `
    Template Context Variables:
    
    The template receives the following context:
    
    • $implicit - The entire row object (default variable)
    • row - The entire row object (named variable)
    • column - The column name (string)
    
    Usage examples:
    
    <ng-template #myTemplate let-row>
      <!-- Access using 'let-row' -->
      {{ '{{' }} row.name {{ '}}' }}
    </ng-template>
    
    <ng-template #myTemplate let-data let-col="column">
      <!-- Access using custom names -->
      {{ '{{' }} data[col] {{ '}}' }}
    </ng-template>
    
    <ng-template #myTemplate let-row="row" let-column="column">
      <!-- Access both explicitly -->
      Column: {{ '{{' }} column {{ '}}' }}, Value: {{ '{{' }} row[column] {{ '}}' }}
    </ng-template>
    
    
    IMPORTANT - Using ngAfterViewInit:
    
    When using templates with @ViewChild, you MUST:
    
    1. Use static: true in @ViewChild decorator
       @ViewChild('myTemplate', { static: true }) myTemplate!: TemplateRef<any>;
    
    2. Implement AfterViewInit lifecycle hook
       export class MyComponent implements AfterViewInit
    
    3. Create a NEW array reference in ngAfterViewInit() 
       This is required to trigger Angular's change detection!
       
       ✗ WRONG - Modifying existing array elements:
       ngAfterViewInit() {
         this.columnsConfig[3].template = this.myTemplate; // Won't trigger change detection
       }
       
       ✓ CORRECT - Creating new array reference:
       ngAfterViewInit() {
         this.columnsConfig = [
           { column: 'name', displayValue: 'Name' },
           { column: 'status', displayValue: 'Status', template: this.myTemplate }
         ];
       }
    
    4. Initialize columnsConfig as empty array
       public columnsConfig: Column[] = []; // Not with template: undefined
  `;
}
