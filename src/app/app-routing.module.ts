import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { PasswordRecoveryComponent } from './modules/auth/password-recovery/password-recovery.component';
import { HomeComponent } from './modules/home/home.component';
import { GoverningBodiesComponent } from './modules/who-are-we/governing-bodies/governing-bodies.component';
import { StatutesComponent } from './modules/who-are-we/statutes/statutes.component';
import { EventsComponent } from './modules/activity/events/events.component';
import { NewsAndInformationComponent } from './modules/activity/news-and-information/news-and-information.component';
import { ProtocolsComponent } from './modules/activity/protocols/protocols.component';
import { LegislationComponent } from './modules/legislation/legislation.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'who-are-we/governing-bodies', component: GoverningBodiesComponent },
  { path: 'who-are-we/statutes', component: StatutesComponent },
  { path: 'activity/events', component: EventsComponent },
  { path: 'activity/news-and-information', component: NewsAndInformationComponent },
  { path: 'activity/protocols', component: ProtocolsComponent },
  { path: 'legislation', component: LegislationComponent },
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
  exports: [RouterModule]
})
export class AppRoutingModule { }
