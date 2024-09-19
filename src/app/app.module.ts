import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRippleModule } from '@angular/material/core';

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
import { EditContactDialogComponent } from './modules/organization/edit-contact-dialog/edit-contact-dialog.component';
import { EditArticleDialogComponent } from './modules/news/edit-article-dialog/edit-article-dialog.component';
import { ViewEventDialogComponent } from './modules/calendar/view-event-dialog/view-event-dialog.component';
import { ViewArticleDialogComponent } from './modules/news/view-article-dialog/view-article-dialog.component';
import { ContactsComponent } from './modules/contacts/contacts.component';

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
        EditArticleDialogComponent,
        ViewEventDialogComponent,
        ViewArticleDialogComponent,
        ContactsComponent
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
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRippleModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(translate: TranslateService) {
        translate.setDefaultLang('pt'); // Default language
    }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
