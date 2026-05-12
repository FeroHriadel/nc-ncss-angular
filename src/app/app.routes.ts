import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

// form elements
import { InputsPage } from './pages/inputs/inputs.page';
import { ButtonsPage } from './pages/buttons/buttons.page';
import { SelectPage } from './pages/select/select.page';
import { TextInputsPage } from './pages/text-inputs/text-inputs.page';
import { CheckboxPage } from './pages/checkbox/checkbox.page';
import { FileUploadPage } from './pages/file-upload/file-upload.page';
import { FormServicePage } from './pages/form-service/form-service.page';

// navs
import { NavsPage } from './pages/navs/navs.page';

// pills and tags
import { PillsPage } from './pages/pills/pills.page';

// dialogs
import { DialogsPage } from './pages/dialogs/dialogs.page';

// lists
import { ListsPage } from './pages/lists/lists.page';

// tables
import { TablesPage } from './pages/tables/tables.page';

// layout
import { LayoutPage } from './pages/layout/layout.page';



export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inputs', component: InputsPage },
  { path: 'inputs/select', component: SelectPage },
  { path: 'inputs/buttons', component: ButtonsPage },
  { path: 'inputs/text-inputs', component: TextInputsPage },
  { path: 'inputs/checkbox', component: CheckboxPage },
  { path: 'inputs/file-upload', component: FileUploadPage },
  { path: 'inputs/form-service', component: FormServicePage },
  { path: 'navs', component: NavsPage },
  { path: 'pills', component: PillsPage },
  { path: 'popups', component: DialogsPage },
  { path: 'lists', component: ListsPage },
  { path: 'tables', component: TablesPage },
  { path: 'layout', component: LayoutPage },
  { path: '**', redirectTo: '' }  // fallback route for undefined paths
];
