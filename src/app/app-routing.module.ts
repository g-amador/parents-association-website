import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component'; // Import your home component
import { OrganizationComponent } from './modules/organization/organization.component';
import { NewsComponent } from './modules/news/news.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { isAdminRoute: false } },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'organization', component: OrganizationComponent, data: { isAdminRoute: false } },
  { path: 'organization/admin', component: OrganizationComponent, data: { isAdminRoute: true } },
  { path: 'news', component: NewsComponent, data: { isAdminRoute: false } },
  { path: 'news/admin', component: NewsComponent, data: { isAdminRoute: true } },
  { path: 'calendar', component: CalendarComponent, data: { isAdminRoute: false } },
  { path: 'calendar/admin', component: CalendarComponent, data: { isAdminRoute: true } },
  { path: 'contacts', component: ContactsComponent, data: { isAdminRoute: false } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
