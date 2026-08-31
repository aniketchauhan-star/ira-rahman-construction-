/**
 * SITE COPY
 * ---------------------------------------------------------------
 * Every heading, paragraph, label and button on the site. Change a
 * string here and it changes on the page — no component edits.
 *
 * The repeating lists live in their own files next to this one:
 *   services.js · projects.js · materials.js · machinery.js
 *   gallery.js  · whyus.js    · company.js (contact details + stats)
 *
 * TWO SMALL CONVENTIONS
 * ---------------------
 * 1. A `heading` is an array — one string per line, broken exactly
 *    where you want it to break on screen:
 *
 *        heading: ['Built on', 'Strength.']
 *
 * 2. Square brackets highlight a word:
 *
 *        heading: ['Have a project', 'in [mind?]']
 *
 *    The bracketed word is drawn in the accent colour. Brackets work
 *    in headings and in `eyebrow`; everywhere else is plain text.
 */

export const content = {
  /* ---------------------------------------------------------------
     Opening loader
  --------------------------------------------------------------- */
  loader: {
    word: 'BUILDING SOMETHING STRONG',
    /* Read aloud by screen readers while the site loads. */
    srLabel: 'Loading IRHA Construction Company',
  },

  /* ---------------------------------------------------------------
     Navigation
  --------------------------------------------------------------- */
  nav: {
    cta: 'Get a Quote',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  /* ---------------------------------------------------------------
     Hero
  --------------------------------------------------------------- */
  hero: {
    /* Shown separated by dots. Add or remove items freely. */
    eyebrow: ['Engineering', 'Construction', 'Infrastructure'],
    heading: [
      'We do not just',
      'build structures.',
      'We construct the',
      '[pride] of our nation.',
    ],
    copy: 'From construction and civil infrastructure to materials and project execution, IRHA Construction Company builds with strength, precision and reliability.',
    primaryCta: 'Explore our work',
    secondaryCta: 'Get a quote',
    scrollCue: 'Scroll to explore',
  },

  /* ---------------------------------------------------------------
     About
  --------------------------------------------------------------- */
  about: {
    eyebrow: 'About the company',
    heading: ['Built on', 'Strength.'],
    lead: 'IRHA Construction Company works across building construction, civil infrastructure and construction materials. We take on structural work, earthwork and complete project execution — and we run each site with the same discipline, whatever its scale.',
    body: 'Modern construction is a coordination problem as much as a technical one. Our teams plan sequencing, keep material supply ahead of the programme and hold the standard at every pour, every level and every handover.',

    /* Numbered automatically — reorder or add rows as you like. */
    points: [
      { title: 'Experience', text: 'A decade of site-proven construction and civil work delivery.' },
      { title: 'Quality', text: 'Specified materials, checked mixes and finishes built to last.' },
      { title: 'Safety', text: 'Protected work zones and trained supervision at every stage.' },
      { title: 'Execution', text: 'Programmes planned, resourced and met without excuses.' },
    ],

    imageAlt: 'IRHA Construction Company site works in progress',
    captionKicker: 'On site',
    caption: 'Active construction works',
  },

  /* ---------------------------------------------------------------
     Services   (the six cards themselves live in services.js)
  --------------------------------------------------------------- */
  services: {
    eyebrow: 'Capabilities',
    heading: ['What we build'],
    intro:
      'Six disciplines, one delivery standard. Whether the scope is a single foundation or an end-to-end programme, the same team plans it, resources it and stands behind it.',
  },

  /* ---------------------------------------------------------------
     The barrier moment between Services and Projects
  --------------------------------------------------------------- */
  journeyGate: {
    heading: ['From foundation', 'to [finish.]'],
  },

  /* ---------------------------------------------------------------
     Projects   (the six projects live in projects.js)
  --------------------------------------------------------------- */
  projects: {
    eyebrow: 'Selected work',
    heading: ['Projects built', 'with purpose.'],
    intro:
      'Commercial, residential, infrastructure and material supply — each one delivered against a real programme, on a real site.',
    /* Labels in the full-screen project viewer */
    viewer: {
      location: 'Location',
      year: 'Year',
      scope: 'Scope',
      prev: 'Prev',
      next: 'Next',
      close: 'Close project viewer',
    },
  },

  /* ---------------------------------------------------------------
     Materials   (the five materials live in materials.js)
  --------------------------------------------------------------- */
  materials: {
    eyebrow: 'Supply',
    heading: ['Materials that', 'build strength.'],
    intro:
      'We supply and place the materials our own sites depend on. Graded, checked and delivered against the programme — because a structure is only as good as what goes into it.',
    /* The two halves of the "raw material → strong foundation" line */
    captionFrom: 'Raw material',
    captionTo: 'Strong foundation',
  },

  /* ---------------------------------------------------------------
     Machinery   (the four machines live in machinery.js)
  --------------------------------------------------------------- */
  machinery: {
    eyebrow: 'Plant & equipment',
    heading: ['Built with', 'the right machinery.'],
    intro:
      'The right machine for the right task — matched to the ground conditions, the programme and the load.',
    /* Appended on desktop, where selecting a machine reveals its use. */
    introDesktopSuffix: ' Select a machine to see where it works.',
  },

  /* ---------------------------------------------------------------
     On-site gallery   (captions live in gallery.js)
  --------------------------------------------------------------- */
  gallery: {
    eyebrow: 'Photography',
    heading: ['On site'],
    hintDesktop: 'Keep scrolling to move through the site',
    hintMobile: 'Swipe to browse',
    endText: ['More work', 'on request'],
  },

  /* ---------------------------------------------------------------
     Why us   (the four reasons live in whyus.js)
  --------------------------------------------------------------- */
  whyUs: {
    eyebrow: 'The difference',
    heading: ['Why IRHA?'],
  },

  /* ---------------------------------------------------------------
     Quote call-to-action
  --------------------------------------------------------------- */
  quoteCta: {
    heading: ['Have a project', 'in [mind?]'],
    text: 'Let’s build something strong together.',
    button: 'Request a quote',
  },

  /* ---------------------------------------------------------------
     Contact
  --------------------------------------------------------------- */
  contact: {
    eyebrow: 'Get in touch',
    heading: ['Start your', 'project.'],
    lead: 'Send us the scope, the site and the timeline. We will come back with a clear, costed approach — not a vague estimate.',

    /* Labels beside your contact details */
    labels: {
      office: 'Office',
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      hours: 'Working hours',
    },

    /* Form field labels. Changing a label does not change the data
       it collects — that is keyed by `id` in Contact.jsx. */
    fields: {
      name: 'Full name',
      phone: 'Phone number',
      email: 'Email',
      projectType: 'Project type',
      location: 'Location',
      message: 'Message',
    },
    selectPlaceholder: 'Select a project type',
    messagePlaceholder: 'Scope, site conditions, timeline…',

    submit: 'Send project enquiry',
    submitting: 'Sending…',

    successTitle: 'Enquiry received.',
    successText:
      'Thank you. Your project details are with our team and we will respond during working hours.',
    successAgain: 'Send another enquiry',
    errorText: 'Something went wrong sending your enquiry. Please try again, or contact us',

    /* Shown under a field when it is empty or malformed */
    validation: {
      nameRequired: 'Please enter your full name.',
      nameShort: 'That name looks too short.',
      phoneRequired: 'Please enter a phone number.',
      phoneInvalid: 'Please check this phone number.',
      emailRequired: 'Please enter an email address.',
      emailInvalid: 'Please check this email address.',
      projectTypeRequired: 'Please choose a project type.',
      locationRequired: 'Please enter the project location.',
      messageRequired: 'Please tell us about the project.',
      messageShort: 'A little more detail would help.',
    },
  },

  /* ---------------------------------------------------------------
     Footer
  --------------------------------------------------------------- */
  footer: {
    tagline:
      'Building construction, civil infrastructure and construction materials — delivered with strength, precision and reliability.',
    navHeading: 'Navigate',
    servicesHeading: 'Services',
    contactHeading: 'Contact',
    /* Large faint wordmark set into the footer background */
    ghost: 'IRHA CONSTRUCTION',
    rights: 'All rights reserved.',
  },

  /* ---------------------------------------------------------------
     Screen-reader labels
     Not visible on screen. These name each region for people using a
     screen reader, and are what a keyboard user hears when landing on
     a control. Worth keeping accurate if you rename a section.
  --------------------------------------------------------------- */
  a11y: {
    heroRegion: 'Introduction',
    primaryNav: 'Primary',
    footerNav: 'Footer navigation',
    galleryRegion: 'On site gallery',
    machineryTabs: 'Machinery',
    statsRegion: 'Company statistics',
    ctaRegion: 'Request a quote',
    gateRegion: 'From foundation to finish',
    progressRail: 'Page progress',
    scrollCueButton: 'Scroll to explore',
    prevProject: 'Previous project',
    nextProject: 'Next project',
  },

  /* ---------------------------------------------------------------
     Image placeholders — shown until a photograph is added
  --------------------------------------------------------------- */
  placeholders: {
    hint: 'Add image to',
    project: 'Project Image',
    site: 'Site Image',
    material: 'Material',
    machine: 'Machine',
  },
}

/**
 * Splits a `[bracketed]` string into plain and highlighted parts, so
 * copy in this file stays plain text instead of markup.
 * Returns e.g. [{ text: 'in ' }, { text: 'mind?', accent: true }]
 */
export function parseAccents(line) {
  return String(line)
    .split(/(\[[^\]]*\])/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('[') && part.endsWith(']')
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false }
    )
}
