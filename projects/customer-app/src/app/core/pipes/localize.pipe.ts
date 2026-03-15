import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TranslatableField, localize } from '@lib/shared-models';

/**
 * Pipe to localize a TranslatableField to the current active language.
 * pure: false is required so the pipe re-evaluates when the language changes.
 * Will delegate to LanguageService once it is created.
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
    private readonly transloco = inject(TranslocoService);

    transform(
        field: TranslatableField | null | undefined,
        fallback = 'en'
    ): string {
        if (!field) return '';
        const lang: string = this.transloco.getActiveLang();
        return localize(field, lang, fallback);
    }
}
