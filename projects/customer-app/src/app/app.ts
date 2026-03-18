import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageService } from './core/services/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, TranslocoModule],
  template: `<router-outlet />`,
})
export class App {
  private readonly langService = inject(LanguageService);

  constructor() {
    // Guard handles URL-based lang; this ensures signals and html attributes
    // are initialised on first load from localStorage / defaults
    this.langService.initLanguage();
  }
}
