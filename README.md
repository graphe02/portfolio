# Portfolio

Daniel Yi — static portfolio for GitHub Pages (`username.github.io`).

Dark, text-first site. Content lives under `content/`; you rarely need to touch `src/` for day-to-day updates.

---

## How to change things

| Want to… | Edit |
|---|---|
| Add / edit a **project** | [`content/projects.json`](content/projects.json) + optional image in `public/project-thumbnails/` |
| Add / edit a **WIP** item | [`content/wip.json`](content/wip.json) |
| Add a **blog** post | New file in [`content/blog/`](content/blog/) (see below) |
| Change **footer links** | [`content/social.json`](content/social.json) |
| Change **About** copy / photo | [`src/app/page.tsx`](src/app/page.tsx), `public/pfp.jpg` |
| Change **logo** | `public/logo.png` |
| Change **look** (colors, spacing) | [`src/app/globals.css`](src/app/globals.css) |
| Change **nav items** | [`src/components/app-header.tsx`](src/components/app-header.tsx) |

After edits: refresh `npm run dev`, or `npm run build` for production.

### Project entry shape

```json
{
  "id": "unique-id",
  "title": "Title",
  "description": "Short description.",
  "technologies": ["Next.js", "TypeScript"],
  "repoUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "youtubeVideoId": "optional",
  "imageUrl": "/project-thumbnails/my-image.png"
}
```

Put images in `public/project-thumbnails/`. Paths start with `/`.

### WIP entry shape

```json
{
  "id": "unique-id",
  "title": "Title",
  "description": "What it is.",
  "status": "Current status."
}
```

### Blog post

Create `content/blog/my-slug.md`:

```md
---
title: My Post
date: 2026-07-09
summary: One-line preview for the index.
---

Body in markdown.
```

- URL becomes `/blog/my-slug`
- `date` displays as `YYYY-MM-DD` only

---

## File structure

```
portfolio/
├── content/                      ← EDIT HERE (almost everything)
│   ├── blog/                     ← markdown posts
│   │   └── hello.md
│   ├── projects.json             ← Projects page
│   ├── wip.json                  ← WIP page
│   └── social.json               ← footer links
│
├── public/                       ← static assets (served as-is)
│   ├── logo.png
│   ├── pfp.jpg
│   └── project-thumbnails/       ← project images
│
├── src/
│   ├── app/                      ← pages (routes)
│   │   ├── page.tsx              ← About (/)
│   │   ├── projects/page.tsx     ← /projects
│   │   ├── wip/page.tsx          ← /wip
│   │   ├── blog/
│   │   │   ├── page.tsx          ← /blog
│   │   │   └── [slug]/page.tsx  ← /blog/:slug
│   │   ├── layout.tsx
│   │   ├── globals.css           ← site styles
│   │   └── favicon.ico
│   ├── components/
│   │   ├── app-header.tsx        ← top nav
│   │   ├── app-footer.tsx        ← footer (reads social.json)
│   │   └── layout-wrapper.tsx
│   └── lib/
│       ├── data.ts               ← loads projects / wip / social JSON
│       └── blog.ts               ← loads markdown from content/blog
│
├── .github/workflows/deploy.yml  ← GitHub Pages deploy
├── next.config.ts                ← static export config
├── package.json
└── README.md
```

### Routes

| URL | Source |
|---|---|
| `/` | `src/app/page.tsx` |
| `/projects` | `content/projects.json` via `src/app/projects/page.tsx` |
| `/wip` | `content/wip.json` via `src/app/wip/page.tsx` |
| `/blog` | `content/blog/*.md` via `src/app/blog/page.tsx` |
| `/blog/<slug>` | `content/blog/<slug>.md` |

---

## Development

```bash
npm install
npm run dev
```

## Build / deploy

```bash
npm run build   # writes static site to out/
```

Push to `main`. GitHub Actions builds the site and publishes `out/` to Pages
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

**Repo settings:** Settings → Pages → Source → **GitHub Actions**

## License

MIT
