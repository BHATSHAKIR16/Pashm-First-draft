import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

/**
 * Prepends the current language code to a path.
 * pure: false so it re-evaluates when the language signal changes.
 *
 * Usage: [routerLink]="'/collection' | langLink"
 * Add LangLinkPipe to the component's imports array.
 */
@Pipe({
    name: 'langLink',
    standalone: true,
    pure: false,
})
export class LangLinkPipe implements PipeTransform {
    private readonly langService = inject(LanguageService);

    transform(path: string): string {
        const lang: string = this.langService.currentLang();
        const clean = path.startsWith('/') ? path : '/' + path;
        return '/' + lang + clean;
    }
}
