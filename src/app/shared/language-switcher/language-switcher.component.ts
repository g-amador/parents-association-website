import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  @Input() sidebarVisible: boolean = true; // Default value, can be overwritten by parent component

  constructor(private translate: TranslateService) {}

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
