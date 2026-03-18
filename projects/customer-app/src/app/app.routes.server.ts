import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Dynamic :lang param — Angular cannot prerender unknown lang values.
    // Use Server rendering for all /:lang/* routes.
    path: ':lang/product/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
