import { TranslatableField, localize } from './i18n.utils';

/** Raw shape from Supabase — JSONB fields intact */
export interface Product {
    id: string;
    price: number;
    stock: number;
    images: string[];
    is_active: boolean;
    sku?: string;
    category_id?: string;
    created_at: string;
    updated_at: string;
    /** JSONB translatable fields */
    name: TranslatableField;
    description: TranslatableField;
    slug: TranslatableField;
}

/** Resolved shape after localization — what components actually use */
export interface ProductLocalized {
    id: string;
    price: number;
    stock: number;
    images: string[];
    is_active: boolean;
    sku?: string;
    category_id?: string;
    name: string;
    description: string;
    slug: string;
}

/** Convert raw Product → ProductLocalized for the active language */
export function localizeProduct(
    product: Product,
    lang: string
): ProductLocalized {
    return {
        id: product.id,
        price: product.price,
        stock: product.stock,
        images: product.images,
        is_active: product.is_active,
        sku: product.sku,
        category_id: product.category_id,
        name: localize(product.name, lang),
        description: localize(product.description, lang),
        slug: localize(product.slug, lang),
    };
}
