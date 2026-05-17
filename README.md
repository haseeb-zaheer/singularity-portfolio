# Singularity Portfolio

Personal portfolio for Haseeb Zaheer, built as a Vite + React single-page site and deployed on Vercel.

## Features

- Animated Three.js background field
- System-initialization loading sequence
- Lenis smooth scrolling
- Hide-on-scroll fixed header
- Public-safe 3E field work section
- Responsive dark technical interface

## Tech Stack

- React 18
- Vite
- Three.js
- Lenis
- Plain CSS

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Deployment

The site is deployed on Vercel as a Vite project.

Vercel settings:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Custom domain:

- `haseebzaheer.dev`
- `www.haseebzaheer.dev`

DNS is managed through Cloudflare and points to Vercel.

## Notes

- Internal/private experience notes are intentionally ignored through `.gitignore`.
- Screenshots and local Playwright artifacts are not part of the repository.
- The portfolio copy avoids internal 3E project or repository names.
