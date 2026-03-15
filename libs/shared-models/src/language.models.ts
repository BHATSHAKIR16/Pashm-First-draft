export interface Language {
    code: string;
    label: string;
    nativeLabel: string;
    dir: 'ltr' | 'rtl';
    flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr', flag: '🇬🇧' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', flag: '🇸🇦' },
    { code: 'de', label: 'German', nativeLabel: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
    { code: 'fr', label: 'French', nativeLabel: 'Français', dir: 'ltr', flag: '🇫🇷' },
    { code: 'es', label: 'Spanish', nativeLabel: 'Español', dir: 'ltr', flag: '🇪🇸' },
    { code: 'it', label: 'Italian', nativeLabel: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
    { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands', dir: 'ltr', flag: '🇳🇱' },
    { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
];

export const RTL_LANGUAGES: string[] = ['ar'];

export const DEFAULT_LANGUAGE = 'en';

export type SupportedLang =
    'en' | 'ar' | 'de' | 'fr' |
    'es' | 'it' | 'nl' | 'tr';
