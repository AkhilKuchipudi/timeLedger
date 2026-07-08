import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './components/profile/profile';
import { Dashboard } from './components/dashboard/dashboard';
import { Tasks } from './components/tasks/tasks';
import { Notifications } from './components/notifications/notifications';
import { Timesheets } from './components/timesheets/timesheets';
import { Teams } from './components/teams/teams';
import { Settings } from './components/settings/settings';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { NotFound } from './components/not-found/not-found';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'timesheets', component: Timesheets },
  { path: 'tasks', component: Tasks },
  { path: 'teams', component: Teams },
  { path: 'settings', component: Settings },
  { path: 'notifications', component: Notifications },
  { path: 'profile', component: Profile },
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
