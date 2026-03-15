import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import {
    DEFAULT_LANGUAGE,
    Language,
    RTL_LANGUAGES,
    SUPPORTED_LANGUAGES,
    SupportedLang,
} from '@lib/shared-models';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly transloco = inject(TranslocoService);
    private readonly document = inject(DOCUMENT);

    // ── Signals ────────────────────────────────────────────────────────────────

    readonly currentLang = signal<string>(DEFAULT_LANGUAGE);

    readonly isRTL = computed(() =>
        RTL_LANGUAGES.includes(this.currentLang())
    );

    readonly currentDir = computed<'ltr' | 'rtl'>(() =>
        this.isRTL() ? 'rtl' : 'ltr'
    );

    readonly currentLanguage = computed<Language>(
        () =>
            SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLang()) ??
            SUPPORTED_LANGUAGES[0]
    );

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Switch the active language.
     * Falls back to DEFAULT_LANGUAGE if the code is invalid.
     * Syncs Transloco, signals, html attributes, and localStorage.
     */
    setLanguage(code: string): void {
        const lang: string = this.isValidLang(code) ? code : DEFAULT_LANGUAGE;

        // 1. Delegate translation loading/lookup to Transloco
        this.transloco.setActiveLang(lang);

        // 2. Update signal — triggers all computed signals and pure:false pipes
        this.currentLang.set(lang);

        // 3. Set html[lang] for CSS :root[lang="ar"] rules and screen readers
        this.document.documentElement.setAttribute('lang', lang);

        // 4. Set html[dir] for RTL layout — lets the browser handle flex direction
        this.document.documentElement.setAttribute(
            'dir',
            RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
        );

        // 5. Persist preference so it survives page reloads
        localStorage.setItem('preferred-lang', lang);
    }

    /**
     * Resolve and apply the correct language on startup.
     * Priority: URL param → localStorage → DEFAULT_LANGUAGE.
     * Called by the language guard and app.component.ts.
     */
    initLanguage(langFromUrl?: string): void {
        const fromUrl = langFromUrl && this.isValidLang(langFromUrl)
            ? langFromUrl
            : null;

        const fromStorage = localStorage.getItem('preferred-lang');
        const fromStorageValid =
            fromStorage && this.isValidLang(fromStorage) ? fromStorage : null;

        const resolved: string = fromUrl ?? fromStorageValid ?? DEFAULT_LANGUAGE;
        this.setLanguage(resolved);
    }

    /**
     * Check whether a language code is in SUPPORTED_LANGUAGES.
     */
    isValidLang(code: string): boolean {
        return SUPPORTED_LANGUAGES.some((l) => l.code === code);
    }
}
