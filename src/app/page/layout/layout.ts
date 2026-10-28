import { Component } from '@angular/core';
import { Code } from '../../components/code/code';
import { Card, Container } from '../../ncss';

@Component({
  selector: 'app-layout-page',
  imports: [Container, Card, Code],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutPage {
  protected readonly importCode = `// my-page.ts
import { Component } from '@angular/core';
import { Container } from '../../ncss';

@Component({
  selector: 'app-my-page',
  imports: [Container],
  templateUrl: './my-page.html'
})
export class MyPage {}`;

  protected readonly usageCode = `<nc-container>
  <h1>Page title</h1>
  <p>Content stays centered and never wider than 1200px.</p>
</nc-container>`;

  protected readonly semanticCode = `<!-- The container has no meaning of its own. Put it inside, or on, a landmark -->
<main>
  <nc-container>...</nc-container>
</main>

<nc-container role="main" id="content">...</nc-container>`;

  protected readonly classStyleCode = `<!-- class, [style], id and any attribute go on nc-container itself -->
<nc-container class="my-container" id="content">Custom class</nc-container>

<!-- [style] overrides everything else -->
<nc-container [style]="{ maxWidth: '600px' }">Narrow</nc-container>`;

  protected readonly variablesCode = `/* Override the variables globally, e.g. in styles.css */
:root {
    --container-max-width: 1440px;
    --container-padding-x: 1.5rem;
}

/* ...or only inside one part of the page */
.article {
    --container-max-width: 720px;
}`;

  protected readonly variablesList = `--container-max-width
--container-padding-x
--container-padding-x-small   (used at 320px wide and below)`;
}
