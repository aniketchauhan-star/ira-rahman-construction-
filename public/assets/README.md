# Where your images go

Drop your files into these folders using **exactly these filenames** and they
appear on the site automatically. No code changes needed.

Until a file exists, the site shows a styled placeholder naming the folder —
never a broken image icon.

```
public/assets/
├── logo/
│   └── irha-rahman-logo.png      ← the company logo (already in place)
│
├── projects/                      ← Projects section + full-screen viewer
│   ├── project-01.jpg
│   ├── project-02.jpg
│   ├── project-03.jpg
│   ├── project-04.jpg
│   ├── project-05.jpg
│   └── project-06.jpg
│
├── site/                          ← About photo + "On Site" gallery
│   ├── site-01.jpg                (used in the About section)
│   ├── site-02.jpg
│   ├── site-03.jpg
│   └── site-04.jpg
│
├── materials/                     ← Materials section close-ups (optional)
│   ├── material-stone.jpg
│   ├── material-gravel.jpg
│   ├── material-aggregate.jpg
│   ├── material-sand.jpg
│   └── material-concrete.jpg
│
├── machinery/                     ← cut-outs with transparent backgrounds
│   ├── excavator.png
│   ├── crane.png
│   ├── truck.png
│   └── mixer.png
│
└── models/                        ← optional
    └── construction-vehicle.glb
```

## Notes

**Format.** `.jpg`, `.webp` and `.avif` all work — if you prefer WebP or AVIF,
rename the path in the matching file under `src/data/`.

**Size.** Aim for roughly 1600–2000px on the long edge and keep each file
under ~400KB. Everything below the fold is lazy-loaded.

**Machinery.** Transparent PNG cut-outs look best; these are displayed with
`object-fit: contain` so nothing is cropped.

**The 3D vehicle.** `construction-vehicle.glb` is entirely optional. If the
file is present it is loaded and used; if it is missing — or fails to parse —
the site silently falls back to the built-in procedural excavator. Keep any
model you add low-poly, Y-up, facing **+X**, and roughly 1.6 units long so it
sits correctly on the road.
