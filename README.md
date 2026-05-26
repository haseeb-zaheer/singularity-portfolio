# Singularity Portfolio

Personal portfolio for Haseeb Zaheer, built as a Vite + React single-page site and deployed on Vercel.

## Features

- Animated Three.js background field
- System-initialization loading sequence on direct landing-page entry
- Article archive and detail pages with lightweight route transitions
- Lenis smooth scrolling
- Hide-on-scroll fixed header
- Embedded second-brain chat through a server-side Vercel proxy
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

## Articles

Articles are stored as Markdown files under:

```text
src/content/articles/<number>-<slug>/index.md
```

Use a numeric folder prefix to keep local browsing ordered, for example:

```text
src/content/articles/01-revisiting-the-roots-of-ai/index.md
src/content/articles/02-building-private-rag-backend-portfolio-chatbot/index.md
```

The numeric prefix is only for the filesystem. It is not shown on the site, and it is not part of the public URL. Public article URLs come from the article frontmatter `slug` field:

```markdown
---
title: "Revisiting the Roots of AI"
slug: "revisiting-the-roots-of-ai"
date: "2026-05-19"
description: "Short public-safe summary."
tags: ["AI", "RAG"]
readTime: "8 min"
type: "Article"
---
```

Article images live beside the article:

```text
src/content/articles/01-revisiting-the-roots-of-ai/images/image1.png
```

Reference local article images from Markdown with a relative path:

```markdown
![Descriptive alt text](./images/image1.png)
```

The article loader resolves images through the real folder path, so prefixed folders still work with clean public slugs.

## Route Loading

The full custom boot loader is intended only for direct visits to the landing page `/`.

Article routes use a smaller archive-style loader instead:

```text
/articles
/articles/<slug>
```

During article navigation, the page behind the loader is blurred. The article loader waits for the target route to render, fonts to be ready, and article images to finish loading or error before it exits. In-site navigation back to `/` should not show the full custom boot loader.

## Deployment

The site is deployed on Vercel as a Vite project.

Vercel settings:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Second-brain chat environment:

```text
SECOND_BRAIN_BACKEND_SECRET=
SECOND_BRAIN_API_URL=https://rag.haseebzaheer.dev/api/chat
SECOND_BRAIN_RATE_LIMIT_PER_MINUTE=5
SECOND_BRAIN_RATE_LIMIT_PER_DAY=25
SECOND_BRAIN_REQUEST_TIMEOUT_MS=55000
```

`SECOND_BRAIN_BACKEND_SECRET` must match the protected RAG backend secret and must only be set in Vercel/server-side environments. Do not expose it through `VITE_*` variables.

Second-brain chat flow:

```text
Browser chatbox
 -> /api/second-brain-chat Vercel function
 -> https://rag.haseebzaheer.dev/api/chat
 -> backend streams Server-Sent Events
 -> Vercel function passes the stream through to the browser
```

The browser never receives `SECOND_BRAIN_BACKEND_SECRET`. The proxy keeps public validation, per-visitor rate limits, request timeout handling, and JSON error responses for validation/rate-limit/backend pre-stream failures. Successful chat responses are `text/event-stream` and the UI renders `delta` events progressively until the backend sends `done`.

Custom domain:

- `haseebzaheer.dev`
- `www.haseebzaheer.dev`

DNS is managed through Cloudflare and points to Vercel.

## Notes

- Internal/private experience notes are intentionally ignored through `.gitignore`.
- Screenshots and local Playwright artifacts are not part of the repository.
- The portfolio copy avoids internal 3E project or repository names.
- After changing article content, route loaders, or Markdown rendering, run `npm run lint` and `npm run build`.
