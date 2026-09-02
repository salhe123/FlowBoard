import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { ProjectDetail } from './project-detail/project-detail';
import { Projects } from './projects/projects';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
  { path: 'projects/:id', component: ProjectDetail, canActivate: [authGuard] },
];
