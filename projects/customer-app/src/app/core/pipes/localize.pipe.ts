import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslatableField, localize } from '@lib/shared-models';
import { LanguageService } from '../services/language.service';

/**
 * Pipe to localize a TranslatableField to the current active language.
 * pure: false is required so the pipe re-evaluates when the language signal changes.
 *
 * Usage: {{ product.name | localize }}
 * Add LocalizePipe to the component's imports array to use it.
 */
@Pipe({
    name: 'localize',
    standalone: true,
    pure: false,
})
export class LocalizePipe implements PipeTransform {
    private readonly langService = inject(LanguageService);

    transform(
        field: TranslatableField | null | undefined,
        fallback = 'en'
    ): string {
        if (!field) return '';
        const lang: string = this.langService.currentLang();
        return localize(field, lang, fallback);
    }
}
