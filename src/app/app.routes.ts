import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Projects } from './projects/projects';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
];
