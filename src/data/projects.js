/**
 * PROJECTS
 * ---------------------------------------------------------------
 * Drop your photographs into /public/assets/projects/ using the
 * same filenames and they appear automatically. Until then a
 * styled placeholder tells you exactly where the image belongs.
 *
 * size — the tile's footprint in the editorial grid:
 *   'wide'     7 of 12 columns, 2 rows
 *   'standard' 5 of 12 columns, 2 rows
 *   'tall'     4 of 12 columns, 3 rows
 *   'feature'  8 of 12 columns, 3 rows
 * Pair them so each row adds up to 12 (7+5, 5+7, 4+8).
 */

export const projects = [
  {
    id: 'p1',
    title: 'Commercial Complex',
    category: 'Civil & Structural Construction',
    location: 'Add location',
    year: '2024',
    image: '/assets/projects/project-01.jpg',
    size: 'wide',
    description:
      'A multi-level commercial structure delivered from foundation to finish, covering RCC framing, façade support works and internal civil packages.',
  },
  {
    id: 'p2',
    title: 'Road Development',
    category: 'Infrastructure',
    location: 'Add location',
    year: '2024',
    image: '/assets/projects/project-02.jpg',
    size: 'standard',
    description:
      'Sub-grade preparation, aggregate base laying and surfacing works executed with full drainage integration and site coordination.',
  },
  {
    id: 'p3',
    title: 'Residential Project',
    category: 'Building Construction',
    location: 'Add location',
    year: '2023',
    image: '/assets/projects/project-03.jpg',
    size: 'standard',
    description:
      'Residential blocks constructed with precise structural execution, quality-checked concrete and an on-schedule handover.',
  },
  {
    id: 'p4',
    title: 'Industrial Foundation',
    category: 'Structural Work',
    location: 'Add location',
    year: '2023',
    image: '/assets/projects/project-04.jpg',
    size: 'wide',
    description:
      'Heavy-load foundation systems and plinth works engineered for industrial machinery, with full reinforcement detailing.',
  },
  {
    id: 'p5',
    title: 'Site Development',
    category: 'Earthwork & Levelling',
    location: 'Add location',
    year: '2022',
    image: '/assets/projects/project-05.jpg',
    size: 'tall',
    description:
      'Large-scale excavation, cutting, filling and grading works that turned raw land into a construction-ready platform.',
  },
  {
    id: 'p6',
    title: 'Material Supply Contract',
    category: 'Construction Materials',
    location: 'Add location',
    year: '2022',
    image: '/assets/projects/project-06.jpg',
    size: 'feature',
    description:
      'Continuous supply of stone, aggregate and sand to an active site, managed against a live construction programme.',
  },
]
