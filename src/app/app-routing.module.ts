import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/login.component';
import { HomeComponent } from './modules/home/home.component';
import { OrganizationComponent } from './modules/organization/organization.component';
import { NewsComponent } from './modules/news/news.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

import { AuthGuard } from './core/guards/auth.guard'; // Import AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { isAdminRoute: false } },
  { path: 'organization', component: OrganizationComponent, data: { isAdminRoute: false } },
  { path: 'organization/admin', component: OrganizationComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } }, // Protected route
  { path: 'news', component: NewsComponent, data: { isAdminRoute: false } },
  { path: 'news/admin', component: NewsComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } }, // Protected route
  { path: 'calendar', component: CalendarComponent, data: { isAdminRoute: false } },
  { path: 'calendar/admin', component: CalendarComponent, canActivate: [AuthGuard], data: { isAdminRoute: true } }, // Protected route
  { path: 'contacts', component: ContactsComponent, data: { isAdminRoute: false } },
  { path: 'auth/login', component: LoginComponent }, // Login route
  { path: '**', redirectTo: '/home' } // Wildcard route redirects to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
