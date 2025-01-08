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
import { LoginComponent } from './modules/auth/login/login.component';
import { PasswordRecoveryComponent } from './modules/auth/password-recovery/password-recovery.component';
import { HomeComponent } from './modules/home/home.component';
import { GoverningBodiesComponent } from './modules/who-are-we/governing-bodies/governing-bodies.component';
import { EditGoverningBodiesContactDialogComponent } from './modules/who-are-we/governing-bodies/edit-governing-bodies-contact-dialog/edit-governing-bodies-contact-dialog.component';
import { StatutesComponent } from './modules/who-are-we/statutes/statutes.component';
import { EventsComponent } from './modules/activity/events/events.component';
import { EditEventFormDialogComponent } from './modules/activity/events/edit-event-form-dialog/edit-event-form-dialog.component';
import { ViewEventDialogComponent } from './modules/activity/events/view-event-dialog/view-event-dialog.component';
import { NewsAndInformationComponent } from './modules/activity/news-and-information/news-and-information.component';
import { EditArticleDialogComponent } from './modules/activity/news-and-information/edit-article-dialog/edit-article-dialog.component';
import { NewsAndInformationArchiveSidebarComponent } from './modules/activity/news-and-information/news-and-information-archive-sidebar/news-and-information-archive-sidebar.component';
import { ViewArticleDialogComponent } from './modules/activity/news-and-information/view-article-dialog/view-article-dialog.component';
import { ProtocolsComponent } from './modules/activity/protocols/protocols.component';
import { LegislationComponent } from './modules/legislation/legislation.component';
import { ContactsComponent } from './modules/contacts/contacts.component';
import { EditContactDialogComponent } from './modules/contacts/edit-contact-dialog/edit-contact-dialog.component';
import { BeAMemberComponent } from './modules/be-a-member/be-a-member.component';
import { QuillEditorComponent } from './shared/quill-editor/quill-editor.component';
import { TopBarComponent } from './shared/top-bar/top-bar.component';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher.component';
import { UnderConstructionComponent } from './shared/under-construction/under-construction.component';
import { OrderByPipe } from './shared/pipes/order-by.pipe';

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
    LoginComponent,
    PasswordRecoveryComponent,
    HomeComponent,
    GoverningBodiesComponent,
    EditGoverningBodiesContactDialogComponent,
    StatutesComponent,
    EventsComponent,
    EditEventFormDialogComponent,
    ViewEventDialogComponent,
    NewsAndInformationComponent,
    EditArticleDialogComponent,
    NewsAndInformationArchiveSidebarComponent,
    ViewArticleDialogComponent,
    ProtocolsComponent,
    LegislationComponent,
    ContactsComponent,
    EditContactDialogComponent,
    BeAMemberComponent,
    QuillEditorComponent,
    TopBarComponent,
    LanguageSwitcherComponent,
    UnderConstructionComponent,
    OrderByPipe
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
