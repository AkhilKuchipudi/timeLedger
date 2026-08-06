import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Tasks } from './components/tasks/tasks';
import { Profile } from './components/profile/profile';
import { Sidebar } from './components/sidebar/sidebar';
import { Notifications } from './components/notifications/notifications';
import { NotFound } from './components/not-found/not-found';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Timesheets } from './components/timesheets/timesheets';
import { Teams } from './components/teams/teams';
import { Settings } from './components/settings/settings';
import { Approvals } from './components/approvals/approvals';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AdminLogs } from './components/admin-logs/admin-logs';


@NgModule({
  declarations: [
    App,
    Dashboard,
    Login,
    Register,
    Tasks,
    Profile,
    Sidebar,
    Notifications,
    Timesheets,
    Teams,
    Settings,
    Approvals,
    NotFound,
    AdminLogs,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
    BaseChartDirective
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [App]
})
export class AppModule { }
