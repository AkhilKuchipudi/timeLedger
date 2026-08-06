import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';
import { Tasks } from './components/tasks/tasks';
import { Notifications } from './components/notifications/notifications';
import { Timesheets } from './components/timesheets/timesheets';
import { Teams } from './components/teams/teams';
import { Settings } from './components/settings/settings';
import { Approvals } from './components/approvals/approvals';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { NotFound } from './components/not-found/not-found';
import { AdminLogs } from './components/admin-logs/admin-logs';

import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'timesheets', component: Timesheets, canActivate: [authGuard] },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
  { path: 'teams', component: Teams, canActivate: [authGuard] },
  { path: 'approvals', component: Approvals, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'admin/logs', component: AdminLogs, canActivate: [authGuard] },
  { path: '**', component: NotFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
