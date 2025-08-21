Lemonbrand UI Spec (Aceternity UI)

Scope: Reference for building UI in our web app using Aceternity UI components with React/Next.js, Tailwind CSS (v3 or v4), and Framer Motion. This spec defines tokens, patterns, accessibility, performance, and code conventions. Treat this as the single source of truth for front-end implementation.

1) Tech Baseline

Framework: React 18+ (Next.js App Router preferred).

Styling: Tailwind CSS (v4 preferred; v3 allowed for legacy).

Animation: Framer Motion.

Icons: Lucide or Heroicons.

Dark mode: Class-based .dark on <html>.

TypeScript: Strict mode on.

Project structure (Next.js):

/app
  /(marketing)  # public pages
  /(app)        # authenticated app
/components    # UI building blocks
/lib           # helpers (cn, motion configs)
/styles        # tailwind + theme css

2) Design Tokens (Tailwind-first)

Set tokens in CSS (Tailwind v4) or tailwind.config (v3). All UI must use tokens (not hard-coded values).

2.1 Colors

Brand

--lb-primary-50..900 (blue)

--lb-accent-50..900 (lime)

--lb-neutral-50..900 (stone)

Semantic

--lb-success, --lb-warning, --lb-danger, --lb-info (500 + 700 for dark text)

Surface

--lb-bg, --lb-bg-elev-1, --lb-bg-elev-2, --lb-border, --lb-overlay

Dark mode mapping: Shift surfaces toward neutral-900, borders to neutral-700, maintain AA contrast.

2.2 Typography

Font families: --lb-font-sans: Inter, system-ui, sans-serif;

Scale (Tailwind): text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl

Weights: 300/400/500/600/700

Line heights: tight (1.15) for headings; relaxed (1.6) for body.

2.3 Spacing & Sizing

Spacing: Tailwind scale; app defaults 4 (1rem) for section padding; 6 on md+.

Radii: rounded-lg, xl, 2xl; default rounded-2xl for cards.

Shadows: --lb-shadow-1 (sm), --lb-shadow-2 (md), --lb-shadow-3 (xl, colored). Prefer drop shadows over blurs.

2.4 Motion

Durations: 120ms (snappy), 240ms (default), 420ms (attention).

Easing: cubic-bezier(0.2, 0.8, 0.2, 1).

Spring: { type: "spring", stiffness: 260, damping: 24 } for micro-interactions.

Reduced motion: Wrap decorative motion with a useReducedMotion guard.

3) Core Patterns (mapped to Aceternity UI)

Use Aceternity UI components as primitives + patterns. When picking a component, prefer the simplest animation that communicates intent.

3.1 Navigation

Top Nav: “Navbar Menu” pattern with animated underline + active state.

Floating/Sticky Nav: Use floating dock only on marketing pages; avoid in app shell.

Breadcrumbs: Always on data-heavy pages; truncate middle items on sm screens.

3.2 Hero & Section Frames

Hero: Title (max 2 lines) + one CTA primary, one CTA secondary. Optional decorative effects (sparkles/spotlight) behind content only (no text masking).

Section: container mx-auto px-6 md:px-8 max-w-7xl with space-y-8.

3.3 Cards & Grids

Card: rounded-2xl border bg-[--lb-bg-elev-1] shadow-[--lb-shadow-2] with hover:shadow-[--lb-shadow-3].

Interactive: Magnetic/hover effects allowed only for marketing; disable in forms/tables.

Bento/Feature grid: 2–3 cols on md+, stacked on mobile.

3.4 Lists, Tables, and Data

Table: Sticky header + row hover, 12–16px cells, zebra optional.

Empty states: Illustration (optional) + primary CTA + secondary “Learn more”.

3.5 Forms

Inputs: Large click targets (min 40px).

Labels: Always visible; no placeholder-as-label.

Validation: Inline (onBlur), summary on submit.

Layout: One column mobile; two columns md+ for dense forms.

Submit: Full-width on mobile; w-auto md+.

3.6 Feedback

Toasts: Top-right stack, 3.5s auto-dismiss, pause on hover.

Loaders: Skeleton for >400ms; loading dots for buttons.

3.7 Motion Micro‑interactions

Buttons: Scale 1.02 on hover, 0.98 on press; 120ms.

Cards: Y-translate 2–4px on hover for marketing only.

Entrances: Fade+slide 12px for above-the-fold; stagger children (50–80ms).

4) Accessibility (non-negotiable)

Color contrast: AA for text, AAA for body on surfaces.

Focus: High-contrast 2px ring (ring-2 ring-offset-2 ring-[--lb-primary-500]).

Keyboard: All interactive elements tabbable; visible focus order.

ARIA: Provide roles/labels on custom components; announce toast messages via aria-live="polite".

Motion: Respect prefers-reduced-motion.

Content: Don’t animate essential text (use background effects only).

5) Component Catalogue (Usage Contracts)

We use Aceternity UI examples as starting points; wrap them in typed components that expose a small, consistent prop surface.

5.1 Buttons

Variants: primary, secondary, ghost, destructive

Sizes: sm, md (default), lg

API:

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

Defaults: rounded-xl px-4 py-2 font-medium with animated press.

Do: Use icons at 18–20px left of label. Don’t: Use gradients on destructive.

5.2 Card

Props: title?: string; subtitle?: string; media?: ReactNode; footer?: ReactNode;

States: default, hover (marketing), disabled.

Slots: Card.Header, Card.Content, Card.Footer.

5.3 NavbarMenu

Behavior: Hover/press animations, active route underline.

Mobile: Slide-in sheet with focus trap.

Props: items: {label: string; href: string; icon?: ReactNode}[].

5.4 HeroFrame

Composition: Title, lead, CTAs, decorative background (sparkles/spotlight).

Constraints: Content must remain legible with effects off.

5.5 Timeline / Tracing Beam

Use for showcasing process or case studies.

Keep steps ≤6; each step has title, kpi, body.

5.6 Dock / Floating Nav (marketing only)

Dock items are icons with labels; 48–56px targets; blur background.

5.7 Animated Tooltip

delay={120}; place on icon-only buttons; avoid on links with clear labels.

5.8 Marquee / Infinite Cards (marketing only)

Cap speed; pause on hover and when offscreen; reduce motion variant.

6) Layout Rules

Grid: 12-column mental model; Tailwind container with max-w-7xl for app, max-w-5xl for forms/docs.

Gutters: px-6 mobile, px-8 md+.

Section rhythm: py-12 mobile, py-16 md+.

Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

7) Code Conventions

File names: PascalCase.tsx for components; kebab-case.ts for utils.

Class merging: use cn(...classes) helper.

Variants: co-locate in the component (variants.ts).

Props: minimal; prefer composition and className passthrough.

Testing: write one Story per variant; add Playwright test for critical flows.

8) Performance & Quality

SSR: Defer motion-heavy elements to client components; dynamic(() => import(...), { ssr: false }) when necessary.

lazyMotion: Bundle framer features lazily for heavy pages.

Images: next/image with priority only for LCP media.

CLS safety: Reserve heights for animated blocks; avoid layout shift.

9) Accessibility Checklist (per screen)



10) Implementation Snippets

10.1 Theme (Tailwind v4 CSS example)

/* styles/theme.css */
@import "tailwindcss";
@theme inline {
  --lb-font-sans: "Inter", system-ui, sans-serif;
  --lb-bg: oklch(0.98 0.01 95);
  --lb-bg-elev-1: oklch(0.96 0.01 95);
  --lb-bg-elev-2: oklch(0.92 0.02 95);
  --lb-border: oklch(0.85 0.02 95);
  --lb-primary-500: oklch(0.72 0.16 255);
  --lb-accent-500: oklch(0.87 0.12 125);
}
:root { color-scheme: light dark; }
.dark {
  --lb-bg: oklch(0.16 0.02 95);
  --lb-bg-elev-1: oklch(0.18 0.02 95);
  --lb-bg-elev-2: oklch(0.22 0.02 95);
  --lb-border: oklch(0.32 0.02 95);
}

10.2 Motion helpers

// lib/motion.ts
export const ease = [0.2, 0.8, 0.2, 1] as const
export const durations = { fast: 0.12, base: 0.24, slow: 0.42 }
export const spring = { type: 'spring', stiffness: 260, damping: 24 }

10.3 Button (spec-compliant)

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--lb-primary-500] disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98] transition-transform'
const sizes: Record<Size, string> = { sm: 'h-9 px-3 text-sm', md: 'h-10 px-4', lg: 'h-11 px-5 text-lg' }
const variants: Record<Variant, string> = {
  primary: 'bg-[--lb-primary-500] text-white hover:brightness-105',
  secondary: 'bg-[--lb-bg-elev-2] text-foreground border',
  ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5',
  destructive: 'bg-red-600 text-white hover:bg-red-600/90'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} className={cn(base, sizes[size], variants[variant], className)} {...props} />
  )
}

11) Usage Rules (Do & Don’t)

Do

Use decorative animations to support content (not replace it).

Keep hero effects behind text; never reduce legibility.

Provide no‑motion fallbacks.

Prefer composition over prop bloat.

Don’t

Stack multiple heavy effects on the same section.

Animate form fields.

Use parallax or marquee in the app shell.

12) Review & Definition of Done (PR Checklist)



13) Component Requests

If a needed pattern doesn’t exist, file a **Component Reque