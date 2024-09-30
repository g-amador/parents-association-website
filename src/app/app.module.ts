import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

// Services
import { AuthService } from './core/services/auth.service';

// Components
import { LoginComponent } from './modules/auth/login.component';
import { HomeComponent } from './modules/home/home.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { OrganizationComponent } from './modules/organization/organization.component';
import { NewsComponent } from './modules/news/news.component';
import { NewsArchiveSidebarComponent } from './modules/news/news-archive-sidebar/news-archive-sidebar.component';
import { QuillEditorComponent } from './shared/quill-editor/quill-editor.component';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher.component';
import { OrderByPipe } from './shared/pipes/order-by.pipe';
import { EditEventFormDialogComponent } from './modules/calendar/edit-event-form-dialog/edit-event-form-dialog.component';
import { EditContactDialogComponent } from './modules/contacts/edit-contact-dialog/edit-contact-dialog.component';
import { EditOrganizationContactDialogComponent } from './modules/organization/edit-organization-contact-dialog/edit-organization-contact-dialog.component';
import { EditArticleDialogComponent } from './modules/news/edit-article-dialog/edit-article-dialog.component';
import { ViewEventDialogComponent } from './modules/calendar/view-event-dialog/view-event-dialog.component';
import { ViewArticleDialogComponent } from './modules/news/view-article-dialog/view-article-dialog.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    CalendarComponent,
    OrganizationComponent,
    NewsComponent,
    NewsArchiveSidebarComponent,
    QuillEditorComponent,
    LanguageSwitcherComponent,
    OrderByPipe,
    EditEventFormDialogComponent,
    EditContactDialogComponent,
    EditOrganizationContactDialogComponent,
    EditArticleDialogComponent,
    ViewEventDialogComponent,
    ViewArticleDialogComponent,
    ContactsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    // Conditionally initialize Firebase based on the environment
    ...(environment.firebaseConfig
      ? [
        AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
        AngularFirestoreModule // Include Firestore
      ]
      : [] // Skip Firebase in development
    )
  ],
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()), // Provide HTTP client with interceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('pt'); // Set default language to Portuguese
  }
}

// Factory function for translation loader
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
