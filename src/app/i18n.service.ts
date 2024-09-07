import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('pt');
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }
}
