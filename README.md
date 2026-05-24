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
