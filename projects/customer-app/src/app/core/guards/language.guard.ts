import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

export const languageGuard: CanActivateFn = (route, state) => {
    const languageService = inject(LanguageService);
    const router = inject(Router);

    const lang: string = route.params['lang'] as string;

    if (languageService.isValidLang(lang)) {
        languageService.initLanguage(lang);
        return true;
    }

    // Strip the invalid lang segment and redirect to /en/<rest>
    const withoutLang = state.url.replace(/^\/[^/]+/, '') || '/';
    router.navigate(['en' + withoutLang]);
    return false;
};
