# AGENTS.md — MatrixSite

Guidance for AI coding agents working in this repository.

---

## Architecture Overview

This is a **Minecraft community website** for the Matrix Network server. It has two independent processes:

| Process | Entry | Port | Purpose |
|---------|-------|------|---------|
| React SPA | `my-site/src/main.jsx` | Vite dev (5173) | All UI |
| Express API | `my-site/server/index.js` | 8787 | Auth, wiki CRUD, bingo |

**There is no React Router.** Routing is manual: `App.jsx` maintains a `path` state string, derives a `route` object via `useMemo`, and conditionally renders components. To add a new page you must add a route string to the `useMemo` block AND a render case in the JSX return. See existing `/server-wiki/*` entries as the pattern.

**API calls from the frontend** use `API_BASE` from `src/config.js` — never hardcode ports. In dev, Vite proxies `/api` → `localhost:8787` (see `vite.config.js`). In production, `VITE_API_BASE` env var controls the target.

---

## Build & Dev Commands

All commands run from `my-site/`:

```bash
npm run build       # production build → dist/  (expect exit 0, ~62 modules)
npm run dev         # Vite dev server on :5173
node server/index.js  # Express API on :8787 (run separately)
```

**Environment:** The app loads env from two files with override priority: `../my-site.env` (parent dir) then `my-site/my-site.env`. Copy `.env.example` to set up. Both `vite.config.js` and `server/index.js` have identical dotenv loading logic.

**Always run `npm run build` after any JSX/component change** to confirm no compile errors. The chunk-size warning (>500 kB) is expected and harmless.

---

## Key Conventions

### No file-based routing — manual route table
`App.jsx` is the single routing source of truth. Adding a page requires three edits in that one file: import, route entry in `useMemo`, render case in JSX.

### Dark theme via Tailwind `class` strategy
`darkMode: 'class'` in `tailwind.config.js`. The `dark` class is force-applied to `<html>` on mount in `App.jsx`. Never rely on OS preference — always write dark-first styles.

### Two distinct visual themes in one app
- **Main site pages** (Home, Rules, etc.) use light cards: `bg-white/80 rounded-3xl`
- **Server Wiki pages** (`/server-wiki/*`) use dark cards: `rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur`

Never mix these. The wiki shell background is a fixed texture (`wiki-bg.png`) with a dark overlay defined in `index.css`.

### Fonts
- Headings: `"Cinzel"` (loaded via Google Fonts in `index.html`)
- Body: `"Space Grotesk"` (set as default in `index.css`)

### Stat color spans — two different component signatures
Class wiki pages (`ServerWikiSwordsman.jsx` etc.):
```jsx
const STR = { color: "#55FF55" };
<S label="STR" style={STR} />
```
Stats page (`ServerWikiStats.jsx`) only:
```jsx
<S stat="STR" />            // renders abbreviation in color
<S stat="STR">Strength</S>  // renders custom text in color
```
Do not mix these across files.

### Accordion pattern (two variants)
- **Class pages:** `scalingFormula` prop on `AbilityCard` → amber toggle "Show Formula"
- **Stats page:** `<FormulaAccordion formulas={[{label, formula}]} />` → slate toggle "Show formulas"

Formulas must appear **only** inside accordions, never as plain strings in prose arrays.

---

## Server Wiki — SkillsPro Integration

Source data lives in `my-site/SkillsPro/`:
- `config.yml` — global stat colors, `functional-types` (passive global stat effects), stat max levels
- `Skills/*.yml` — per-class data: `stats:`, `max-health`, `max-energy`, `energy-regen`, `damage-cap`, ability blocks

**`lvl` in ability formulas = ability level (1–3), not player level.** Player level is `%skills_level%`.

When reading class YAML formulas, strip `%skills_stat_X%` wrappers → write just the math (e.g. `VIT/2`).

Class pages live in `src/components/serverWiki/`. The home index is `ServerWikiHome.jsx` — add new class cards to the `skillsEntries` array there.

See `Instructions/SkillsPro-Wiki-Guide.md` for the full class authoring guide, all stat canonical names/colors, and class-specific quirks (Firemage uses VIT for energy, Vampire excludes ARC, Arbalist uses TCH for energy, etc.).

---

## Auth & Session

- Sessions use **httpOnly JWT cookies** (`sid`), verified in `server/index.js` via `readSession()`.
- Auth provider is configurable via env: `AUTH_PROVIDER=authme` (reads from a Minecraft AuthMe MySQL table) or `AUTH_PROVIDER=matrix` (reads from a local `matrix_logins` table).
- Database driver is configurable: `DB_DRIVER=mariadb` (default) or `DB_DRIVER=sqlite`.
- Admin users are set by `ADMIN_USERS` env var (comma-separated usernames, case-insensitive).
- Never expose `JWT_SECRET` or database credentials; use env vars only.

---

## Data Flows

```
Browser → fetch(`${API_BASE}/api/...`, { credentials: "include" })
       → Express /api routes in server/index.js
       → MySQL (AuthMe or matrix_logins) OR SQLite (wiki pages)
```

Wiki pages are stored as JSON at `server/data/wiki/pages.json` (file-backed, not DB). The server caches this file by mtime (`wikiCache`). Bingo game data is in `server/bingo_songs.json` and `server/bingo_columns_config.json`.

Pages whose slug starts with `skills-` are filtered out of the Legends Wiki page list in `App.jsx` — they are reserved for the SkillsPro system.

---

## What Does Not Exist Yet

- **Vergil class page** — YAML exists at `SkillsPro/Skills/Vergil.yml` (stats: INT, DEX; energy: concentration) but no wiki component.
- **Bending section** on `ServerWikiHome.jsx` — placeholder only, no content pages.
- No test suite. Validate all changes with `npm run build`.
