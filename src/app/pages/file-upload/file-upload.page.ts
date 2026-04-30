import { Component, ViewChild } from '@angular/core';
import { Card } from '../../ncss/cards/card.component';
import { Container } from '../../ncss/wrappers/container/container.component';
import { Button } from '../../ncss/buttons/button/button.component';
import { FileUpload } from '../../ncss/inputs/file-upload/file-upload.component';
import { Highlight } from 'ngx-highlightjs';




@Component({
  selector: 'file-upload-page',
  imports: [Card, Container, Button, FileUpload, Highlight],
  templateUrl: './file-upload.page.html',
  styleUrl: './file-upload.page.css',
})



export class FileUploadPage {
  @ViewChild('fileUploadExample') fileUploadExample!: FileUpload;

  getFiles = () => {
    const files = this.fileUploadExample.getFiles();
    if (files) {
      if (files instanceof File) {
        alert('Selected file: ' + files.name);
      } else {
        alert('Selected files: ' + files.map(f => f.name).join(', '));
      }
    } else {
      alert('No files selected');
    }
  }

  clearFiles = () => {
    const event = new Event('click');
    this.fileUploadExample.clearFileInput(event);
  }

  onFileChange = (files: File | File[] | null) => {
    if (files) {
      if (files instanceof File) {
        console.log('File selected: ' + files.name);
      } else {
        console.log('Files selected: ' + files.map(f => f.name).join(', '));
      }
    } else {
      console.log('No files selected');
    }
  }

  public fileUploadHtml = `
      <nc-file-upload
        #fileUploadExample
        class="mb-4"
        id="file-upload-example"
        placeholder="Choose a file to upload"
        [onChange]="onFileChange"
        accept="image/*"
      ></nc-file-upload>

      <nc-file-upload [disabled]="true" class="mb-4" placeholder="Disabled file upload"></nc-file-upload>
      <br>

      <nc-button class="mb-1 mr-1" variant="outline" (click)="getFiles()">Get Files</nc-button>
      <nc-button class="mb-1 mr-1" variant="red" (click)="clearFiles()">Clear Files</nc-button>
  `;

  public fileUploadTS = `
    import { Component, ViewChild } from '@angular/core';
    import { FileUpload } from '../../ncss/inputs/file-upload/file-upload.component';

    @Component({
      selector: 'file-upload-page',
      imports: [FileUpload],
      templateUrl: './file-upload.page.html',
      styleUrl: './file-upload.page.css',
    })

    export class FileUploadPage {
      @ViewChild('fileUploadExample') fileUploadExample!: FileUpload;

      getFiles = () => {
        const files = this.fileUploadExample.getFiles();
        if (files) {
          if (files instanceof File) {
            alert('Selected file: ' + files.name);
          } else {
            alert('Selected files: ' + files.map(f => f.name).join(', '));
          }
        } else {
          alert('No files selected');
        }
      }

      clearFiles = () => {
        const event = new Event('click');
        this.fileUploadExample.clearFileInput(event);
      }

      onFileChange = (files: File | File[] | null) => {
        if (files) {
          if (files instanceof File) {
            console.log('File selected: ' + files.name);
          } else {
            console.log('Files selected: ' + files.map(f => f.name).join(', '));
          }
        } else {
          console.log('No files selected');
        }
      }
    }
      `;

  public multipleFileUploadHtml = `
      <nc-file-upload
        #multipleFileUploadExample
        class="mb-4"
        id="multiple-file-upload-example"
        placeholder="Choose files to upload"
        [multiple]="true"
        accept="*"
      ></nc-file-upload>
  `;

}
