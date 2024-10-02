import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnChanges {
  @Input() sidebarVisible: boolean = true; // Default value, can be overwritten by parent component

  constructor(private translate: TranslateService) {}

  // Detect changes to the sidebarVisible input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarVisible']) {
      this.sidebarVisible = changes['sidebarVisible'].currentValue;
      this.onSidebarVisibilityChange(this.sidebarVisible);
    }
  }

  private onSidebarVisibilityChange(isVisible: boolean) {
    // Logic to execute when the sidebar visibility changes
    console.log('Sidebar is now', isVisible ? 'visible' : 'hidden');
    // You can add more logic here as needed
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
