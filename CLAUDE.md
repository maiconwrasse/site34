# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static website for **Complexo 34** (posto Ipiranga, restaurante, gás Ultragaz, Murilo Pneus, Lé-Vi) on BR-386 KM 34, Frederico Westphalen/RS. Production host: `https://www.complexo34.com.br`. Plain HTML/CSS/vanilla JS — there is no build step, package manager, linter, or test suite. All content and code comments are in Brazilian Portuguese; keep new text and comments in pt-BR.

To preview locally, serve the repo root over HTTP (pages use root-absolute paths like `/style.css` and `fetch('/posts.json')`, which break under `file://`):

```
python -m http.server 8000
```

## Structure

- `index.html` + `style.css` + `script.js` — the home page. `style.css` and `script.js` are **shared**: every other public page (`/restaurante/`, `/blog/`, blog posts, `/privacidade/`) also loads `/style.css` and `/script.js`, so changes there affect the whole site.
- `restaurante/` — restaurant landing page; loads the shared files plus its own `restaurante.css` / `restaurante.js` (hero slides, gallery carousel + lightbox).
- `blog/` — `blog/index.html` is a shell; each post is `blog/<slug>/index.html` with a `capa.webp` cover. Post pages are copies of a template: the `<!-- ▼▼▼ TROCAR A CADA MATÉRIA ▼▼▼ -->` markers delimit the per-post fields (title, meta, canonical, OG, JSON-LD).
- `assets/{img,logo,video}/` — media. Gallery images come in pairs: `name.webp` (thumb) and `name-full.webp` (lightbox).
- `painel-whatsapp/`, `whatsapp-conectar/` — internal, `noindex` standalone pages with inline CSS/JS (they do **not** use the shared files). `painel-whatsapp` is a password-gated sales/orders dashboard that POSTs to a Supabase Edge Function (`whatsapp-webhook?tarefa=relatorio`); the password lives in Supabase, the page only keeps it in `sessionStorage`. `whatsapp-conectar` runs Meta's WhatsApp Embedded Signup (coexistence) via the Facebook JS SDK, with `?v=` and `?config=` URL overrides.

## Adding a blog post

Blog listings are rendered client-side by `script.js` from `/posts.json` (sorted by `data` desc): the home carousel (`data-limit`, default 6) and the `.js-post-grid` on `/blog/`. Publishing a post means:
1. Create `blog/<slug>/index.html` (copy an existing post, edit the TROCAR blocks) and `blog/<slug>/capa.webp`.
2. Add an entry to `posts.json` (`slug`, `url`, `titulo`, `descricao`, `categoria`, `data` as `YYYY-MM-DD`, `imagem`, `alt`).
3. Add the URL to `sitemap.xml`.

## Maintenance scripts

One-off, idempotent rewrite scripts run from the repo root. They preserve CRLF line endings and write UTF-8 **without BOM** — any automated edit to the HTML should do the same.
- `alinhar_host_www.py` — rewrites `https://complexo34.com.br` → `https://www.complexo34.com.br` in home, restaurante and all blog pages.
- `migrar_assets.psi` (actually a PowerShell script; header calls it `migrar_assets.ps1`) — rewrites bare media filenames to `assets/{img,logo,video}/…`.
- `adiciona_link_restaurante.ps1` — inserts the "Restaurante" nav link into the home navbar and mobile menu.

Note: the blog pages (`blog/index.html` and the posts) have not had these migrations applied — they still use non-www URLs and root paths such as `/logo_complexo_34.svg`, which no longer exist at the root (files are under `assets/logo/`). Same for `/favicon.ico` / `/favicon.png`, which are referenced but not in the repo.

## Conventions

- When editing nav or footer links, update every page: the navbar, the mobile menu (`onclick="closeMenu()"`), and the footer are duplicated in each HTML file.
- Contact links use WhatsApp `https://wa.me/5555996910733?text=…` with URL-encoded pre-filled messages.
- Every public page includes the GA4 tag `G-K6EQVEW7GG` and JSON-LD structured data; keep canonical/OG/JSON-LD URLs on the `www` host.
