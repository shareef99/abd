# NZ Constructions — Website

A static, fully-animated marketing site for **NZ Constructions** (Hyderabad, India),
built in the spirit of an Apple product page: cinematic scroll, editorial type, a live
WebGL hero, and buttery micro-interactions.

> Design language drawn from the inspiration board (`docs/nz_2.png`): warm **ivory**
> surfaces, **charcoal** ink, and a **bronze‑gold** accent — with the logo's electric
> **blue + clay‑orange** reserved for select "funky" moments.

---

## Tech stack

| Concern        | Choice                                                            |
| -------------- | ----------------------------------------------------------------- |
| Framework      | [Astro 5](https://astro.build) — static output, zero-JS by default |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme`)   |
| Islands        | React 19 (only where interactivity is needed)                    |
| 3D             | three.js + React Three Fiber + drei (`client:only` hero scene)   |
| Smooth scroll  | [Lenis](https://lenis.darkroom.engineering)                       |
| Scroll FX      | [GSAP](https://gsap.com) + ScrollTrigger                          |
| UI motion      | [Motion](https://motion.dev) (framer-motion) for the testimonial carousel |
| Type           | Fraunces (display serif) + Inter (UI) via Fontsource (self-hosted) |

## Run it

```bash
npm install      # already done
npm run dev      # http://localhost:4321  (currently running)
npm run build    # static output → ./dist
npm run preview  # serve the production build
```

The site is 100% static — `npm run build` emits plain HTML/CSS/JS you can host anywhere
(Netlify, Vercel, S3, GitHub Pages, a plain web server…).

## Pages

- `/` — immersive homepage: 3D hero · marquee · why-choose · process · services ·
  pinned horizontal projects gallery · about · testimonials carousel · CTA
- `/services` — detailed services with three pricing tiers each
- `/projects` — filterable portfolio grid (All / Residential / Commercial)
- `/about` — story, animated stats, mission & vision, values, working hours
- `/contact` — info cards, embedded map, validated consultation form

## Where things live

```
src/
├─ lib/content.ts            ← ALL copy & data (edit here to change text/prices/projects)
├─ styles/global.css         ← design tokens (colors, fonts, animations) + utilities
├─ scripts/motion.ts         ← global motion engine (Lenis + GSAP, reveals, cursor, magnetic, tilt)
├─ layouts/Base.astro        ← shared shell (head, nav, footer, scroll progress)
├─ components/
│  ├─ ui/        Icon · Logo · Button
│  ├─ sections/  Nav · Hero · Marquee · WhyChoose · Process · Services · Projects ·
│  │             AboutPreview · Testimonials · CTA · Footer · PageHeader
│  └─ react/     HeroScene.tsx (3D) · TestimonialsCarousel.tsx
└─ pages/        index · services · projects · about · contact
public/images/   ← architectural photography + logo.png
```

## Customising

- **Text / pricing / projects** → `src/lib/content.ts`
- **Colors / fonts / animation timings** → the `@theme` block in `src/styles/global.css`
- **Hero 3D scene** (tower sizes, materials, colors) → `src/components/react/HeroScene.tsx`
- **Logo** → the nav/footer use a crisp SVG wordmark (`src/components/ui/Logo.astro`);
  the original raster logo is shown on the dark brand panel in `/about` and lives at
  `public/images/logo.png`.

## Notes

- **Imagery** is curated architectural photography from Unsplash, downloaded locally so
  the site stays self-contained. Swap any file in `public/images/` (keep the names) to use
  real NZ project photos.
- **The 3D hero** is a `client:only` React island (~255 KB gzip, code-split so only the
  homepage loads it). It renders on the GPU; a soft gradient fallback shows on reduced-motion
  or while it mounts.
- **Accessibility**: respects `prefers-reduced-motion` (disables smooth scroll, the custom
  cursor, and heavy 3D, and reveals all content immediately). All copy is real text, not
  baked into images.
- The contact form is front-end only (shows a success state) — wire it to your backend /
  form service when ready.
