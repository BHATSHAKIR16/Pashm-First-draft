import { SupportedLang } from './language.models';

/** Type for any JSONB translatable field stored in Supabase */
export type TranslatableField = Record<SupportedLang, string>;

/**
 * Extract the value for a given language.
 * Falls back to English if translation is missing.
 * Falls back to first available value if English is also missing.
 */
export function localize(
    field: TranslatableField | null | undefined,
    lang: string,
    fallback = 'en'
): string {
    if (!field) return '';
    return (
        field[lang as SupportedLang] ??
        field[fallback as SupportedLang] ??
        Object.values(field).find((v) => v !== '') ??
        ''
    );
}

/**
 * Build a TranslatableField with a value for one language
 * and empty strings for all others.
 * Used in dashboard when creating new content.
 */
export function buildTranslatable(
    value: string,
    lang: string
): TranslatableField {
    const SUPPORTED: SupportedLang[] = [
        'en', 'ar', 'de', 'fr', 'es', 'it', 'nl', 'tr',
    ];
    return SUPPORTED.reduce((acc, l) => {
        acc[l] = l === lang ? value : '';
        return acc;
    }, {} as TranslatableField);
}

/**
 * Check if a TranslatableField has at least one non-empty translation.
 */
export function hasTranslation(
    field: TranslatableField | null | undefined
): boolean {
    if (!field) return false;
    return Object.values(field).some((v) => v !== '');
}

/**
 * Get completion status of translations.
 * Useful in dashboard to show which languages still need translating.
 */
export function getTranslationStatus(
    field: TranslatableField | null | undefined
): Record<SupportedLang, boolean> {
    const SUPPORTED: SupportedLang[] = [
        'en', 'ar', 'de', 'fr', 'es', 'it', 'nl', 'tr',
    ];
    return SUPPORTED.reduce((acc, l) => {
        acc[l] = !!(field?.[l]);
        return acc;
    }, {} as Record<SupportedLang, boolean>);
}
