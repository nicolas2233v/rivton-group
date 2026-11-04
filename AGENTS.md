<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All content (properties, settings, team) is read through `src/services/content.ts`; UI never imports data files directly, so a WordPress REST adapter can replace local data later.
- Search filters live in the URL (`/propiedades?…`) and are parsed/applied in `src/lib/filters.ts`, covered by `src/test/filters.test.ts`.
- All form and sorting dropdowns use the shared Radix-based PremiumSelect so keyboard, touch and visual behavior stay consistent.
- Scroll presentation uses CSS variables updated through animation-frame scroll listeners, with reduced-motion fallbacks to keep effects lightweight and accessible.
- Homepage reveal choreography uses a shared intersection observer; horizontally scrolling content stays inside an inset viewport so cards never touch the screen edges.
- The opening search and second architectural scene share one sticky photo stage; scroll-driven hidden scenes are inert so invisible controls cannot receive focus.
