# LingQ Clone (Nuxt 4)

A language-learning web app inspired by LingQ, focused on reading practice, lesson progress, and vocabulary review.

## Live Demo

- Demo Reader: https://langoda.com/DemoReader

## Why I Built This

This project was built to practice full-stack frontend architecture in a real product flow:
- login/signup
- lesson browsing
- in-reader word interaction
- lesson completion and review flow

## Core Features

- Authentication flow (`/`, `/signup`)
- Homepage with lesson/course discovery (`/HomepageLingQ`)
- Reader experience (sentence/phrase selection, word status tracking, sidebar details, audio controls, lesson navigation)
- Review page after finishing a lesson (`/ReviewVocabs`)
- Lesson/course import related UI (text/audio/youtube components)

## Tech Stack

- Nuxt 4 (Vue 3 + Nitro)
- Tailwind CSS
- VueUse
- Font Awesome
- Server API proxy routes in `server/api/*` for backend communication and cookie forwarding

## Project Structure

```txt
app/
  pages/                 # Route pages (reader, homepage, auth, review, etc.)
  components/            # UI components by domain (homepage, reading, createLesson)
  composables/           # Reusable logic (csrf, lesson data, keyboard, notifications...)
server/
  api/                   # Nitro server routes acting as backend proxy
public/
  images/ icons/ sounds/ # Static assets
```

## Environment Variables

Create a `.env` file:

```bash
NUXT_API_PROXY_BASE=http://localhost:8000
NUXT_PUBLIC_API_BASE=/api
```

Notes:
- `NUXT_API_PROXY_BASE` is used server-side to forward API requests to your backend.
- `NUXT_PUBLIC_API_BASE` is used client-side. Keeping it as `/api` lets Nuxt proxy requests through Nitro routes.

## Run Locally

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Generate static output:

```bash
npm run generate
```

## API Proxy Notes

This app uses Nitro API routes like:
- `server/api/login.post.ts`
- `server/api/get_data_courses_cards.get.ts`
- `server/api/[...path].ts`
- `server/api/media/[...path].ts`

These routes forward cookies and selected headers to the backend so authenticated requests work cleanly from the frontend.

## Current Limitations

- UI is primarily optimized for larger screens.
- Some pages/components are experimental (`check.vue`, `check2.vue`, `NewConcept/*`).

## What I Would Improve Next

- Add unit/integration tests for composables and critical flows
- Improve mobile responsiveness across all pages
- Add CI checks (lint/test/build)
- Add role-based auth guards and stronger error boundaries
