---
trigger: always_on
---

# E-Commerce Monorepo — Workspace Rules

## Project Overview
- E-commerce platform with two Angular 21 apps
- Customer-facing storefront (with SSR + i18n)
- Admin dashboard (English only, no SSR)
- Monorepo with shared libs

## Repo Structure
my-project/
├── projects/
│   ├── customer-app/              ← customer facing storefront
│   └── dashboard/                 ← admin dashboard
├── libs/
│   ├── shared-models/             ← interfaces, DB types, language config
│   ├── shared-services/           ← supabase client, auth service
│   └── shared-ui/                 ← components used in both apps
├── supabase/
│   ├── functions/                 ← edge functions
│   └── migrations/                ← SQL migrations
├── CLAUDE.md
├── angular.json
├── package.json
└── tsconfig.json

## Stack
- Angular 21 (standalone components only)
- Supabase (auth, database, edge functions)
- Vercel (deployment — two separate Vercel projects)
- @jsverse/transloco (i18n — customer-app only)
- Angular CDK (Directionality for RTL support)
- SSR enabled on customer-app only
- No FastAPI — all backend logic via Supabase Edge Functions

## Path Aliases (always use these, never relative paths to libs)
- @lib/shared-models   → libs/shared-models/src/index.ts
- @lib/shared-services → libs/shared-services/src/index.ts
- @lib/shared-ui       → libs/shared-ui/src/index.ts

## Apps — customer-app
- Root         → projects/customer-app/
- Styles       → projects/customer-app/src/styles.scss
- Env          → projects/customer-app/src/environments/
- Routes       → projects/customer-app/src/app/app.routes.ts
- Config       → projects/customer-app/src/app/app.config.ts
- Services     → projects/customer-app/src/app/core/services/
- Guards       → projects/customer-app/src/app/core/guards/
- Shared UI    → projects/customer-app/src/app/shared/components/
- Pages        → projects/customer-app/src/app/pages/
- Translations → projects/customer-app/src/assets/i18n/
- SSR          → enabled (main.server.ts, outputMode: static)
- Build cmd    → ng build customer-app

## Apps — dashboard
- Root         → projects/dashboard/
- Styles       → projects/dashboard/src/styles.scss
- Env          → projects/dashboard/src/environments/
- Routes       → projects/dashboard/src/app/app.routes.ts
- Config       → projects/dashboard/src/app/app.config.ts
- Services     → projects/dashboard/src/app/core/services/
- Guards       → projects/dashboard/src/app/core/guards/
- Shared UI    → projects/dashboard/src/app/shared/components/
- Pages        → projects/dashboard/src/app/pages/
- SSR          → disabled
- i18n         → none — English only
- Build cmd    → ng build dashboard

## Libs Rules

shared-models (no Angular dependencies)
- TypeScript interfaces and types only
- Supabase generated DB types
- Language and i18n config:
  SUPPORTED_LANGUAGES, RTL_LANGUAGES constants
  Language interface
- Order, Product, User, Cart interfaces
- No services, no components, no Angular imports

shared-services (can have Angular dependencies)
- Supabase client singleton
- AuthService
- No UI, no components

shared-ui (fully standalone components)
- Components used by BOTH apps only
- If only one app uses it → keep it inside that app
- Uses CSS logical properties exclusively
- Uses CSS variables only — no hardcoded values
- Must work correctly in both LTR and RTL layouts
- Must work in both app themes

## The Shared Code Decision Rule
  Before adding anything new, ask:
  "Does the other app need this too?"
  Yes → libs/
  No  → keep it inside the app

  Never duplicate code between apps.
  Never import from projects/other-app/ directly.
  Always import shared code via @lib/* aliases only.

## Angular Rules (both apps)
- Standalone components ONLY — no NgModules
- inject() over constructor injection always
- input() and output() signals over 
  @Input() / @Output() decorators always
- @if, @for, @switch only — 
  never *ngIf, *ngFor, *ngSwitch
- Typed reactive forms always — 
  never untyped FormGroup or FormControl
- Signals for ALL local component state
- toSignal() to bridge Observables into components
- RxJS only in services for complex async operations
  (debounce, combining streams etc.)
- When manual subscription is unavoidable:
  takeUntilDestroyed(this.destroyRef) always
- provideHttpClient() in app.config.ts — 
  never HttpClientModule
- Functional guards and resolvers only — 
  never class-based
- OnPush change detection on every component
- No any types — strictly type everything

## Supabase Rules
- Single client instance →
  libs/shared-services/src/supabase.client.ts
- Generated types →
  libs/shared-models/src/supabase.types.ts
  Run: supabase gen types typescript --project-id YOUR_ID
  Regenerate every time DB schema changes
- Import all DB types from @lib/shared-models only
- Never manually write DB row types
- Always destructure { data, error } —
  check error before using data, never assume success
- All DB calls through a dedicated service —
  never supabase.from() directly in a component
- All auth through AuthService (@lib/shared-services) —
  never supabase.auth directly in a component
- Never use service_role key in any frontend code

## Environment Files
Both apps have their own environments/ folder.
Shape must match exactly:
{
  production: boolean,
  supabaseUrl: string,
  supabaseAnonKey: string,
  geminiApiKey: string       ← customer-app only, empty string in dashboard
}
- Never add API keys to angular.json define block
- Never commit real keys — use placeholder strings only

## Security Rules
- Every protected route must have BOTH:
  1. Angular functional route guard (client side)
  2. Supabase RLS policy (server side)
  Never rely on just one
- customer-app → public signup allowed
- dashboard    → NO public signup ever
                 Admin users created manually 
                 in Supabase console only
                 Email domain restriction enabled

## Internationalisation (customer-app only)

### Setup
- Library         → @jsverse/transloco
- RTL support     → Angular CDK Directionality
- Languages       → en, ar, de, fr, es, it, nl, tr
- RTL languages   → ar only
- Translation files →
  projects/customer-app/src/assets/i18n/
  en.json, ar.json, de.json, fr.json,
  es.json, it.json, nl.json, tr.json
- Language config → @lib/shared-models
  (SUPPORTED_LANGUAGES, RTL_LANGUAGES, Language interface)
- Language service →
  projects/customer-app/src/app/core/services/
  language.service.ts

### Routing
- All customer-app routes prefixed with /:lang/
- Default redirect: / → /en/
- Language always set in:
  1. URL prefix (/en/, /ar/ etc.)
  2. html[lang] attribute
  3. html[dir] attribute (ltr or rtl)
- hreflang tags on every SSR rendered page
  for all 8 languages
- Language guard validates :lang param against
  SUPPORTED_LANGUAGES — redirects to /en/ if invalid

### Translation Keys
- Always use nested keys organised by domain:
  {
    "nav":     { "home": "", "products": "" },
    "auth":    { "login": "", "signup": "" },
    "cart":    { "title": "", "empty": "" },
    "product": { "addToCart": "", "outOfStock": "" },
    "checkout":{ "title": "", "placeOrder": "" },
    "account": { "profile": "", "orders": "" },
    "errors":  { "generic": "", "notFound": "" }
  }
- Never use raw strings in templates
- Always use transloco pipe:
  {{ 'nav.home' | transloco }}
- Never hardcode any UI-visible text anywhere

### Arabic Specific
- Load Arabic font alongside default font:
  Noto Sans Arabic or Cairo (Google Fonts)
- Apply Arabic font when lang is ar:
  :root[lang="ar"] { font-family: 'Noto Sans Arabic', sans-serif; }
- Use Angular DatePipe with locale for 
  date formatting — never format manually
- Use Angular CurrencyPipe with locale —
  never format currency manually

## CSS Rules (customer-app — CRITICAL)
The customer-app must support RTL (Arabic).
All CSS must use logical properties exclusively.

### NEVER use these directional properties:
  margin-left          use → margin-inline-start
  margin-right         use → margin-inline-end
  padding-left         use → padding-inline-start
  padding-right        use → padding-inline-end
  left: (positioning)  use → inset-inline-start
  right: (positioning) use → inset-inline-end
  text-align: left     use → text-align: start
  text-align: right    use → text-align: end
  border-left          use → border-inline-start
  border-right         use → border-inline-end
  border-radius per    use → border-start/end-
  corner                     radius-inline/block

### ALWAYS use CSS logical properties:
  margin-inline-start / margin-inline-end
  padding-inline-start / padding-inline-end
  inset-inline-start / inset-inline-end
  text-align: start / end
  border-inline-start / border-inline-end

### Flexbox in RTL
- Never reverse flex direction manually for RTL
- Set dir="rtl" on html element and let the
  browser handle flex direction automatically
- Use gap instead of margin between flex children

### Icons and directional elements
- Icons that imply direction (arrows, chevrons)
  must be flipped in RTL:
  :root[dir="rtl"] .icon-directional {
    transform: scaleX(-1);
  }

## Design Rules

### customer-app
- ALWAYS read projects/customer-app/src/styles.scss
  before writing any UI code
- ALWAYS reference existing pages in
  projects/customer-app/src/app/pages/
  for design patterns before creating new ones
- NEVER introduce new CSS variables or fonts
- NEVER invent a new design style —
  match existing components exactly
- All spacing, color, typography via
  CSS variables from styles.scss only

### dashboard
- Separate design language from customer-app
- Functional, data-dense UI — not customer facing
- ALWAYS read projects/dashboard/src/styles.scss
  before writing any dashboard UI
- Reference existing dashboard pages for patterns

### shared-ui
- CSS variables only — no hardcoded values
- CSS logical properties only — no directional CSS
- Must render correctly in both LTR and RTL
- Must work in both app themes

## Error Handling
- Each app has its own ErrorService:
  projects/customer-app/src/app/core/services/error.service.ts
  projects/dashboard/src/app/core/services/error.service.ts
- All Supabase errors go through ErrorService only
- Never handle Supabase errors ad-hoc in components
- No console.log in any final code

## Supabase Edge Functions
- Location → supabase/functions/
- Naming convention — prefix by domain:
  customer-*  for customer-app functions
  admin-*     for dashboard functions
- Always verify JWT in every Edge Function
- Never put service_role key in Angular —
  Edge Functions handle all privileged operations
- Always return consistent shape: { data, error }

## SQL Migrations
- Location → supabase/migrations/
- Never modify DB schema directly in production
- Every schema change needs a new migration file
- RLS policy changes are schema changes —
  always a new migration file
- Never edit existing migration files —
  always add a new one

## Build and Verify Rule
After touching any file in libs/ →
always verify both apps still build:
  ng build customer-app
  ng build dashboard
Never push if either app fails to build.

## Global Files — Ask Before Touching
These affect the entire monorepo.
Always list intended changes and wait for approval
before modifying:
- angular.json
- tsconfig.json
- package.json
- libs/*/src/index.ts
- supabase/migrations/
- projects/*/src/app/app.config.ts
- projects/*/src/app/app.routes.ts
- projects/*/src/styles.scss