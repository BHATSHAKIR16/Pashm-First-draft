import { TranslatableField, localize } from './i18n.utils';

/**
 * Maps to the content_blocks table in Supabase.
 * Key naming convention: 'page.section.element'
 * e.g. 'home.hero.title' | 'home.hero.subtitle' | 'about.mission.title'
 */
export interface ContentBlock {
    id: string;
    key: string;
    content: TranslatableField;
    updated_at: string;
    updated_by?: string;
}

/** Resolved shape for components */
export interface ContentBlockLocalized {
    key: string;
    value: string;
}

/** Convert ContentBlock → localized string value */
export function localizeContentBlock(
    block: ContentBlock,
    lang: string
): ContentBlockLocalized {
    return {
        key: block.key,
        value: localize(block.content, lang),
    };
}

/** Raw category shape from Supabase */
export interface Category {
    id: string;
    slug: string;
    name: TranslatableField;
    description: TranslatableField;
}

/** Resolved category shape for components */
export interface CategoryLocalized {
    id: string;
    slug: string;
    name: string;
    description: string;
}

/** Convert Category → CategoryLocalized for the active language */
export function localizeCategory(
    category: Category,
    lang: string
): CategoryLocalized {
    return {
        id: category.id,
        slug: category.slug,
        name: localize(category.name, lang),
        description: localize(category.description, lang),
    };
}
