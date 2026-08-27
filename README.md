# IRHA RAHMAN CONSTRUCTION COMPANY

An interactive, scroll-driven website for a construction, civil-work,
building-material and infrastructure company.

The whole site is built around one idea: **the visitor travels through an
active construction project as they scroll.** A 3D tracked excavator runs
along a road fixed to the bottom of the viewport, moving forward as you scroll
down and backwards as you scroll up — passing the site gate, the company sign,
parked machinery, a barrier that lifts, structures under construction, the
material yard, a tower crane, and finally a completed building beside the
call-to-action.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Requires Node 18 or newer.

---

## Adding your photographs

Everything is file-based. Drop images into `public/assets/` using the
filenames listed in **[public/assets/README.md](public/assets/README.md)** and
they appear immediately — no code changes.

Until an image exists, the site renders a designed graphite/cream placeholder
that names the folder the file belongs in, so you always know what is still
missing. It never shows a broken-image icon.

---

## Editing the content

All copy, contact details and listings live in `src/data/` — components read
from these files and never hard-code content.

| File | What it controls |
| --- | --- |
| `src/data/company.js` | Name, address, phone, email, WhatsApp, working hours, socials, statistics, project-type options |
| `src/data/sections.js` | Navigation links and the vertical progress rail |
| `src/data/services.js` | The six service panels |
| `src/data/projects.js` | Project gallery, viewer content, and each tile's grid footprint |
| `src/data/materials.js` | Materials section |
| `src/data/machinery.js` | Machinery showcase |
| `src/data/gallery.js` | "On Site" horizontal gallery |
| `src/data/whyus.js` | "Why IRHA Rahman?" reasons |

### Contact details

`src/data/company.js` ships with placeholders. Any field left as an empty
string is **hidden automatically**:

- `phone: ''` → the phone rows disappear
- `email: ''` → the email rows disappear
- `whatsapp: ''` → the floating WhatsApp button is not rendered at all
- a social entry with `url: ''` → that icon is not rendered

Set `whatsapp` to an international number with no `+` or spaces, e.g.
`'919999999999'`.

### The enquiry form

The form validates on the client and shows a polished success state. With no
backend configured it logs the enquiry to the console and resolves
successfully, so the whole flow stays testable.

To connect a real endpoint, create a `.env` file in the project root:

```
VITE_ENQUIRY_ENDPOINT=https://your-api.example.com/enquiries
```

The form then POSTs JSON to that URL. All of this lives in
`src/lib/submitEnquiry.js` — no UI code needs to change.

---

## Structure

```
src/
├── components/     Navbar, Button, SectionTitle, ImageReveal, SmartImage,
│                   ProjectCard, ServiceCard, ProjectModal, ScrollProgress,
│                   CustomCursor, Loader, Logo, WhatsAppButton, Footer
├── sections/       Hero, About, Stats, Services, JourneyGate, Projects,
│                   Materials, Machinery, Gallery, WhyUs, QuoteCTA, Contact
├── three/          RoadJourney (the fixed road band), ConstructionVehicle,
│                   ConstructionRoad, Scenery, Dust, VehicleModel,
│                   HeroScene, MaterialsScene, StaticRoad, Lights, roadPath
├── hooks/          useLenis, useSectionTracking, useInView, useMediaQuery,
│                   useReducedMotion, useWebGL
├── lib/            scrollStore, motion, submitEnquiry
├── data/           all editable content
└── styles/         global.css — colour, type and layout tokens
```

### How the journey works

`src/lib/scrollStore.js` is a single mutable object written by Lenis and GSAP
ScrollTrigger and read by Three.js inside `useFrame`. Scroll position never
passes through React state, so the 3D layer never re-renders the component
tree while you scroll.

`src/three/roadPath.js` defines the road: its length, its gentle curve, and
the zone where each section's scenery sits. The road geometry, the scenery
placement and the vehicle's transform all sample the same two functions, which
is what keeps the machine perfectly seated on the surface at any scroll
position.

`src/three/RoadJourney.jsx` slides the world beneath a vehicle that stays in
frame, so the road can run the full length of the site without the camera ever
losing the machine.

---

## Brand system

Derived from the company logo and defined once in `src/styles/global.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--graphite` | `#202224` | Dominant dark surface |
| `--orange` | `#E86A00` | Actions, active states, construction highlights only |
| `--bronze` | `#B88A44` | Premium accents, eyebrows, hairlines |
| `--offwhite` | `#F7F4ED` | Dominant light surface |
| `--concrete` | `#777A7C` | Secondary text |
| `--dark` | `#111315` | Deep background |

Headings use **Barlow Condensed**, body copy uses **Inter**.

The logo artwork is transparent with graphite linework, so on dark surfaces
`Logo.jsx` places it on an off-white disc. The artwork itself is never
recoloured, cropped or stretched — its aspect ratio is locked at 1:1.

---

## Behaviour and fallbacks

Nothing on this site is allowed to break the page.

- **No WebGL** — the road band falls back to a CSS road with an SVG machine,
  the hero to a drafting-grid gradient, the materials scene to a quiet
  gradient. All content stays intact.
- **`prefers-reduced-motion: reduce`** — smooth scrolling is off, the 3D band
  is replaced by the static road, the custom cursor is not mounted, and every
  reveal animation resolves immediately to its final state. Nothing is
  hidden.
- **Missing GLB** — checked with a HEAD request, wrapped in Suspense and an
  error boundary, and falls back to the procedural excavator.
- **Missing images** — designed placeholders naming the target folder.
- **Touch devices** — no custom cursor, no pinned horizontal scroll, single
  column layouts, hamburger navigation, reduced particle counts and DPR.

### Accessibility

Semantic landmarks, a single `h1`, a skip link, visible focus rings, alt text
on every image, `aria-label`s on icon-only controls, arrow-key navigation with
focus trapping in the project viewer and the mobile menu, focus restoration on
close, and full keyboard access to every interactive element.

### Performance

Geometries and materials are created once and shared; tread plates and the
foundation blocks are instanced; there are no shadow maps (the vehicle uses a
cheap contact-shadow plane); the hero and materials canvases pause when
scrolled out of view and the road band stops rendering entirely over the
footer; DPR is capped per device; every ScrollTrigger is created inside a
`gsap.context` and reverted on unmount.
