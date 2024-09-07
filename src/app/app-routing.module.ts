import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component'; // Import your home component
import { OrganizationComponent } from './modules/organization/organization.component';
import { NewsComponent } from './modules/news/news.component';
import { CalendarComponent } from './modules/calendar/calendar.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/organization', pathMatch: 'full' },
  { path: 'organization', component: OrganizationComponent },
  { path: 'news', component: NewsComponent },
  { path: 'calendar', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
