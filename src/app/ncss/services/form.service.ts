import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})



export class FormService {

  private getFormElements(formId: string): Element[] {
    const form = document.getElementById(formId);
    if (!form) throw new Error(`Form with id "${formId}" not found`);

    // Get all elements with a [name] attribute
    const elements = form.querySelectorAll('[name]');
    return Array.from(elements);
  }


  public getFormValues(formId: string): { [key: string]: string | string[] | boolean } {
    const elements = this.getFormElements(formId);
    const formValues: { [key: string]: string | string[] | boolean } = {};

    elements.forEach((element) => {
      const name = element.getAttribute('name');
      if (!name) return; // skip elements without name

      // Try to get value from data-value attribute first
      const dataValue = element.getAttribute('data-value');
      
      if (dataValue !== null && dataValue !== '') {
        // Parse booleans
        if (dataValue === 'true') {
          formValues[name] = true;
        } else if (dataValue === 'false') {
          formValues[name] = false;
        }
        // Parse if it looks like JSON array
        else {
          try {
            if (dataValue.startsWith('[') && dataValue.endsWith(']')) {
              formValues[name] = JSON.parse(dataValue);
            } else {
              formValues[name] = dataValue;
            }
          } catch (e) {
            formValues[name] = dataValue;
          }
        }
      }
      // Otherwise try to get value from .value property (native form elements)
      else if ('value' in element) {
        const htmlElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        // Handle checkboxes (multiple values with same name)
        if (htmlElement instanceof HTMLInputElement && htmlElement.type === 'checkbox') {
          if (htmlElement.checked) {
            if (formValues[name]) {
              // Convert to array if not already
              if (!Array.isArray(formValues[name])) {
                formValues[name] = [formValues[name] as string];
              }
              (formValues[name] as string[]).push(htmlElement.value);
            } else {
              formValues[name] = htmlElement.value;
            }
          }
        }
        // Handle radio buttons
        else if (htmlElement instanceof HTMLInputElement && htmlElement.type === 'radio') {
          if (htmlElement.checked) {
            formValues[name] = htmlElement.value;
          }
        }
        // Handle all other native form elements
        else {
          formValues[name] = htmlElement.value;
        }
      }
    });

    return formValues;
  }
}