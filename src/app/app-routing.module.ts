import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/login.component';
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
  { path: 'admin', redirectTo: 'auth/login', pathMatch: 'full' }, // This will redirect /admin to /auth/login

  { path: 'auth/login', component: LoginComponent }, // Login route
  { path: '**', redirectTo: '/home' } // Wildcard route redirects to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
