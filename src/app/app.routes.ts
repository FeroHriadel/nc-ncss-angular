import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { InputsPage } from './pages/inputs/inputs.page';
import { ButtonsPage } from './pages/buttons/buttons.page';
import { SelectPage } from './pages/select/select.page';
import { TextInputsPage } from './pages/text-inputs/text-inputs.page';
import { CheckboxPage } from './pages/checkbox/checkbox.page';
import { FileUploadPage } from './pages/file-upload/file-upload.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inputs', component: InputsPage },
  { path: 'inputs/select', component: SelectPage },
  { path: 'inputs/buttons', component: ButtonsPage },
  { path: 'inputs/text-inputs', component: TextInputsPage },
  { path: 'inputs/checkbox', component: CheckboxPage },
  { path: 'inputs/file-upload', component: FileUploadPage },
  { path: '**', redirectTo: '' }  // fallback route for undefined paths
];
