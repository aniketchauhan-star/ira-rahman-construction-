# IRHA CONSTRUCTION COMPANY

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

Until an image exists, the site renders a designed graphite placeholder
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
| `src/data/whyus.js` | "Why IRHA?" reasons |

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

The palette is sampled from the company logo rather than invented. The mark is
polished steel: mean saturation **0.07** with a consistent cool cast (hue ~215°).
Measured values — specular `#FDFEFF`, bright chrome `#C4C9D1`, mid chrome
`#72767E`, deep field `#020202` — become the ramp, defined once in
`src/styles/global.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--specular` | `#FDFEFF` | Brightest highlight |
| `--platinum` | `#EEF1F5` | Light text, accent on dark ground |
| `--silver` | `#C4C9D1` | Bright chrome faces |
| `--steel` | `#72767E` | Mid chrome, secondary text |
| `--graphite` | `#14171A` | Dominant dark surface |
| `--dark` | `#0A0B0D` | Deep background |
| `--offwhite` | `#F2F3F5` | Dominant light surface (cooled to match) |

### The accent flips with the surface

The identity is monochrome, so emphasis comes from **contrast, not hue**. One
set of tokens serves both grounds:

| Token | On dark | On light |
| --- | --- | --- |
| `--accent` | `--platinum` | `--graphite` |
| `--accent-2` | `--steel-light` | `--steel` |
| `--on-accent` | `--black` | `--platinum` |

`.section--light` redeclares them, so a component written once works on either
ground. A dark island inside a light section (a project tile, a hovered service
panel) adds `.on-dark` — or redeclares them locally — to take the bright end
back.

Headings use **Barlow Condensed**, body copy uses **Inter**.

### Logo

The artwork is chrome on a transparent background, so it needs dark ground.
Two files, both generated from the supplied original and never recoloured or
stretched:

| File | Ratio | Used in |
| --- | --- | --- |
| `irha-construction-logo.png` | 3:2 | Loader, footer — the full lockup |
| `irha-construction-mark-sm.png` | 2.32:1 | Navbar — buildings only |
| `favicon.png` | 1:1 | Browser tab |

The lockup's own type turns to mush below ~90px tall, so anywhere small uses
the cropped building mark and lets real type carry the name. `surface="plate"`
seats the mark on a dark panel for use on light ground.

### Metals in the 3D scenes

A metallic material has almost no diffuse response — with nothing to reflect it
renders black. `three/ChromeEnvironment.jsx` bakes a small studio cubemap from
in-scene geometry (graded shell, overhead softbox, two side cards) at
`frames={1}`, so it costs nothing per frame and needs no HDR file or network
request. Bodywork additionally raises `envMapIntensity`.

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
- **Touch devices** — no custom cursor, no pinned horizontal scroll,
  hamburger navigation, reduced particle counts and DPR.

### Mobile

Phones get their own layout rather than a narrowed desktop — see
`@media (max-width: 767px)` in `src/styles/global.css` for the type ramp
and spacing tokens, and the matching block at the foot of each component
stylesheet.

| | Desktop | Phone |
| --- | --- | --- |
| About | Two columns, photo beside the copy | Photo directly under the heading; key points become a hairline spec list |
| Services | Three-up architectural panels | Compact spec rows — icon and reference number in a left rail |
| Projects | Asymmetric 12-column editorial grid | Two-up index; captions move out of the image into their own band, tap opens the full viewer |
| Materials | Five across | Two-up tiles, the fifth closing the grid full width |
| Machinery | Tabbed showcase | A plain list with every machine's use already on screen — a tab panel would hide four short lines behind four taps |
| Gallery | Pinned horizontal scroll | Native swipe with snap points |
| Footer | Four columns | Navigate and Services stay side by side; every row is a 44px target |
| Road band | 286px tall | 150px — the desktop height took a quarter of an 844px screen |

Form inputs are set to 16px on phones, below which iOS Safari zooms the
page the moment a field is focused. Every tap target is at least 40px.
The headline is sized so its three authored lines each hold from 320px
up, rather than breaking into five ragged ones.

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
