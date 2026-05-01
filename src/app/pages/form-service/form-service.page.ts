import { Component, inject } from '@angular/core';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { RouterLink } from '@angular/router';
import { Button } from '../../ncss/buttons/button/button.component';
import { Select } from '../../ncss/inputs/select/select.component';
import { Checkbox } from '../../ncss/inputs/checkbox/checkbox.component';
import { Switch } from '../../ncss/inputs/switch/switch.component';
import { SquareButton } from '../../ncss/buttons/square-button/square-button.component';
import { Password } from '../../ncss/inputs/password/password.component';
import { FileUpload } from '../../ncss/inputs/file-upload/file-upload.component';
import { ToolsIcon } from '../../ncss/icons/tools.icon';
import { FormService } from '../../ncss/services/form.service';
import { Highlight } from 'ngx-highlightjs';



@Component({
  selector: 'form-service-page',
  imports: [Card, Container, RouterLink, Button, ToolsIcon, Select, Checkbox, Switch, SquareButton, Password, FileUpload, Highlight],
  templateUrl: './form-service.page.html',
  styleUrl: './form-service.page.css',
})



export class FormServicePage {
    private formService = inject(FormService);

    submitForm(event: Event) {
        event.preventDefault();
        const formValues = this.formService.getFormValues('my-form');
        alert('Form Values:\n' + JSON.stringify(formValues, null, 2));
    }

    getFormValuesHTML = `
        <form id="my-form" class="mb-2">
            <label for="text-input" class="mb-1">
                Text Input
            </label>
            <input 
                type="text" 
                id="text-input" 
                name="text-input" // !! ADD "NAME" ATTRIBUTE !!
                placeholder="Type something..." 
                class="w-100 mb-4"
                [defaultValue]="'There is a lady...'"
            >
            ... other form elements with "name" attributes ...

            <button 
                type="submit" 
                (click)="submitForm($event)"
            >
                Submit
            </button>
        </form>

    `;

    getFormValuesTS = `
        import { Component, inject } from '@angular/core';
        import { FormService } from '../../ncss/services/form.service';

        @Component({
            selector: 'form-service-page',
            templateUrl: './form-service.page.html',
            styleUrl: './form-service.page.css',
        })

        export class FormServicePage {
            private formService = inject(FormService);

            submitForm(event: Event) {
                event.preventDefault();
                const formValues = this.formService.getFormValues('my-form');
                alert('Form Values:\\n' + JSON.stringify(formValues, null, 2));
            }
        }
    `;
}