# Apex Growth — Marketing Site

Premium dark marketing site for Apex Growth Operations with scroll-driven VSL/iPad hero, glass UI, and interactive partnership folder cards.

## Run locally

```bash
cd /Users/daniel/Desktop/apex-growth
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Hero VSL** — YouTube video (`jgdmsjppcio`) scales and flattens on scroll into an iPad frame, then autoplays muted
- **Partnership folders** — Build + Manage / Revenue Partnership tabs with hover switch and 3D tilt + dynamic highlights
- **Glass UI** — Frosted panels, glimmer cards, electric blue accents on black

## Customize

- Copy & URLs: `src/lib/content.ts`
- Colors: `tailwind.config.ts` and `src/app/globals.css`
- Team photos: replace placeholders in `src/components/TeamSection.tsx`

## Deploy

```bash
npm run build
npm start
```

Or deploy to Vercel connected to this folder.
