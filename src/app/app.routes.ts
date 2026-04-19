import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { InputsPage } from './pages/inputs/inputs.page';
import { SelectPage } from './pages/select/select.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inputs', component: InputsPage },
  { path: 'inputs/select', component: SelectPage },
  { path: '**', redirectTo: '' }  // fallback route for undefined paths
];
