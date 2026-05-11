import { Component } from '@angular/core';
import { Container } from '../../ncss/layout/container/container.component';
import { Card } from '../../ncss/cards/card/card.component';
import { Highlight } from 'ngx-highlightjs';



@Component({
    selector: 'app-layout',
    templateUrl: './layout.page.html',
    styleUrl: './layout.page.css',
    imports: [Container, Card, Highlight]
})



export class LayoutPage {
    public containerHTML = `
    <nc-container [style]="{ backgroundColor: 'var(--nc-gray-500)' }" class="py-4">
        <!-- just put you content here -->
        <nc-card width="260px" [style]="{height: '300px', margin: 'auto'}" class="flex flex-center">
        <p class="text text-center">This is inside a container. The container is the dark gray box around this card.</p>
        </nc-card>
    </nc-container>
    `;

    public containerTS = `
        import { Component } from '@angular/core';
        import { Container } from '../../ncss/layout/container/container.component';

        @Component({
            selector: 'app-layout',
            templateUrl: './layout.page.html',
            styleUrl: './layout.page.css',
            imports: [Container]
        })

        export class LayoutPage {}
    `;
    public cardHTML = `
    <nc-card width="400px" class="p-4">
        <h3>Card Title</h3>
        <p class="text mt-2">This is a card component that provides a clean, bordered container for your content. Cards are perfect for grouping related information.</p>
    </nc-card>
    `;

    public cardTS = `
        import { Component } from '@angular/core';
        import { Card } from '../../ncss/cards/card/card.component';

        @Component({
            selector: 'app-layout',
            templateUrl: './layout.page.html',
            styleUrl: './layout.page.css',
            imports: [Card]
        })

        export class LayoutPage {}
    `;}