import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/login/login.component';
import { PasswordRecoveryComponent } from './modules/auth/password-recovery/password-recovery.component'; // Import Password Recovery Component
import { HomeComponent } from './modules/home/home.component';
import { OrganizationComponent } from './modules/organization/organization.component';
import { NewsComponent } from './modules/news/news.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'news', component: NewsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'contacts', component: ContactsComponent },

  // Admin hidden route redirects to login
  { path: 'admin', redirectTo: 'auth/login', pathMatch: 'full' }, // Redirect /admin to /auth/login

  // Authentication routes
  { path: 'auth/login', component: LoginComponent }, // Login route
  { path: 'auth/password-recovery', component: PasswordRecoveryComponent }, // Password recovery route

  // Wildcard route for invalid URLs
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
