# Quests Wiki — Agent Instructions

This document covers how to create, maintain, and gate quest wiki pages on MatrixSite. It also explains the full quest requirement system: the database schema, backend logic, frontend display, admin editor support, and page list grouping. Read it fully before touching any file.

---

## 1. Project Layout — Quest-Relevant Files

```
my-site/
  server/
    index.js                           ← Backend: quest state lookup + conditionMet logic
    data/
      wiki/
        pages.json                     ← All Legends Wiki pages including quest pages
  src/
    components/
      PageList.jsx                     ← Legends Wiki listing with collapsible category groups
      WikiPage.jsx                     ← Individual page renderer + requirement pill display
      AdminPanel.jsx                   ← Wiki editor — RequirementsEditor supports quest type
  scripts/
    add-quest-pages.mjs                ← Script to regenerate all 22 quest pages in pages.json
```

**Build command:** `npm run build` inside `my-site/`. Expects exit 0, ~62 modules. Run after every change.

---

## 2. Database — BeautyQuests Tables

The BeautyQuests plugin stores quest progress in the same MySQL database as the rest of the site.

### `bq_player_quests`
| Column | Type | Description |
|---|---|---|
| `quester_provider` | VARCHAR | Always `"beautyquests:players"` (matches `BQ_PROVIDER` env var) |
| `quester_identifier` | VARCHAR | Player UUID (from `luckperms_players`) |
| `quest_id` | INT | Numeric quest ID (matches the `questId` in page requirements) |
| `state` | ENUM | `NOT_STARTED`, `IN_REGULAR_STAGE`, `IN_ENDING_STAGES`, `IN_END` |
| `finished` | INT | Count of completions — 0 = never finished, ≥1 = completed at least once |

### `luckperms_players`
| Column | Type | Description |
|---|---|---|
| `uuid` | VARCHAR(36) | Player UUID — primary key |
| `username` | VARCHAR(16) | Player username |

BeautyQuests uses UUID as the identifier. Since the session stores the username, the backend must resolve username → UUID before querying quest state.

### Environment variables
```
LP_PLAYERS_TABLE=luckperms_players   # table for UUID lookup (default)
BQ_QUESTS_TABLE=bq_player_quests     # BeautyQuests progress table (default)
BQ_PROVIDER=beautyquests:players     # provider identifier used in bq_player_quests
```

---

## 3. Backend — `server/index.js`

### UUID lookup — `getPlayerUuid(username)`
Looks up the UUID for a given username from `luckperms_players`. Results are permanently cached in `uuidCache` (a `Map`) for the life of the process.

```js
const uuidCache = new Map();

async function getPlayerUuid(username) {
  const key = username.toLowerCase();
  if (uuidCache.has(key)) return uuidCache.get(key);
  const rows = await db.query(
    `SELECT uuid FROM ${LP_PLAYERS_TABLE} WHERE LOWER(username) = LOWER(?) LIMIT 1`,
    [username]
  );
  const uuid = rows?.[0]?.uuid || null;
  if (uuid) uuidCache.set(key, uuid);
  return uuid;
}
```

### Quest state fetch — `getQuestStates(uuid)`
Returns a map of `{ [questId]: { state, finished } }` for all quests associated with the player.

```js
async function getQuestStates(uuid) {
  if (!uuid) return {};
  const rows = await db.query(
    `SELECT quest_id, state, finished FROM ${BQ_QUESTS_TABLE}
     WHERE quester_provider = ? AND quester_identifier = ?`,
    [BQ_PROVIDER, uuid]
  );
  const result = {};
  for (const row of rows) {
    result[Number(row.quest_id)] = { state: row.state, finished: Number(row.finished) };
  }
  return result;
}
```

### Progress object — `getProgress(username)`
Aggregates all progress sources and returns:
```js
{ flags: {}, items: {}, bosses: new Set(), quests: {} }
```
The `quests` field is populated by `getQuestStates`. When no user is logged in, the empty fallback object is used and all quest-gated pages/sections will appear locked.

### Condition evaluation — `conditionMet(condition, progress)`
This recursive function handles `all`, `any`, `not`, and individual condition types. The quest branch:

```js
if (condition.type === "quest") {
  const questData = progress.quests?.[Number(condition.questId)];
  const status = condition.status || "finished";
  if (status === "finished")     return (questData?.finished || 0) >= 1;
  if (status === "started")      return questData != null && questData.state !== "NOT_STARTED";
  if (status === "in_progress")  return questData != null &&
    ["IN_REGULAR_STAGE", "IN_ENDING_STAGES", "IN_END"].includes(questData.state);
  if (status === "not_started")  return !questData || questData.state === "NOT_STARTED";
  // Exact state string fallback:
  return questData?.state === status;
}
```

**Status values:**
| Value | Meaning |
|---|---|
| `"finished"` | Player has completed the quest at least once (`finished >= 1`) |
| `"started"` | Quest is in any state other than NOT_STARTED |
| `"in_progress"` | Quest is actively in progress (not finished, not unstarted) |
| `"not_started"` | Quest has never been accepted |
| Any other string | Direct match against the `state` enum (e.g. `"IN_REGULAR_STAGE"`) |

---

## 4. Page Schema — `pages.json`

Quest pages live in `my-site/server/data/wiki/pages.json` alongside all other Legends Wiki pages. Each page is an object in the `pages` array.

### Full quest page structure
```json
{
  "slug": "quest-1",
  "title": "Find an Old Friend",
  "summary": "Crowley reaches out again, urging you deeper into the mystery.",
  "icon": "📜",
  "tags": ["main-story", "crowley", "quest"],
  "requires": {
    "type": "quest",
    "questId": 0,
    "questName": "A Mysterious New Friend",
    "status": "finished"
  },
  "bosses": [],
  "items": [],
  "sections": [
    {
      "id": "overview",
      "title": "Overview",
      "requires": null,
      "bossId": "",
      "itemId": "",
      "contentMarkdown": "..."
    }
  ]
}
```

### Key rules
- **`slug`** must match the pattern `quest-{questId}` (e.g. `quest-0`, `quest-1000`).
- **`tags`** must include `"quest"` so `PageList.jsx` groups the page under the Quests category. Add story arc tags for context (e.g. `"main-story"`, `"crowley"`).
- **`requires`** at the page level gates the entire page. If the player hasn't met the requirement, the page appears locked with obfuscated text.
- **`requires` on a section** gates just that section — the page is visible but that section shows as locked.
- **`questName`** inside a requirement is human-readable and used for display (e.g. requirement pill shows "A Mysterious New Friend: Completed"). Never put the quest ID directly in visible content.
- **Page-level `requires: null`** means the page is always visible/accessible.

### Requirement format — single condition
```json
{ "type": "quest", "questId": 0, "questName": "A Mysterious New Friend", "status": "finished" }
```

### Requirement format — compound conditions
```json
{ "all": [
  { "type": "quest", "questId": 12, "questName": "The First Sacred Rite", "status": "finished" },
  { "type": "boss", "id": "stone_warden" }
]}
```

---

## 5. Existing Quest Chain

All 22 current quest pages and their gating:

| Slug | Title | Requires |
|---|---|---|
| `quest-35` | Let's Get Started | none |
| `quest-0` | A Mysterious New Friend | none |
| `quest-1` | Find an Old Friend | quest-0 finished |
| `quest-2` | Explore the Ruins | quest-1 finished |
| `quest-3` | Lost Valley | quest-2 finished |
| `quest-8` | The Lost Valley | quest-2 finished |
| `quest-5` | The Order | none (quest-4 has no wiki page) |
| `quest-12` | The First Sacred Rite | none (quest-11 has no wiki page) |
| `quest-13` | The Second Sacred Rite | quest-12 finished |
| `quest-14` | The Third Sacred Rite | quest-13 finished |
| `quest-15` | The Dark Path | quest-14 finished |
| `quest-17` | Desperation | none (quest-16 has no wiki page) |
| `quest-18` | Moneybaggs | quest-17 finished |
| `quest-19` | Prison Break | none |
| `quest-26` | Darkness in its Prime | none (quest-23 has no wiki page) |
| `quest-27` | New Dawn | quest-26 finished |
| `quest-29` | Brothers? | quest-27 finished |
| `quest-33` | The Sewers | quest-29 finished |
| `quest-34` | Gathering | quest-29 finished |
| `quest-38` | Dream? | none |
| `quest-1000` | Just a Dream | quest-38 finished |
| `quest-1001` | Journey to Servitude | quest-1000 finished |

**Important:** If a quest's predecessor doesn't have a wiki page (e.g. quest-4 doesn't exist), set `requires: null` on that page — don't make it require a non-existent page.

---

## 6. Script — `scripts/add-quest-pages.mjs`

Use this script to regenerate all quest pages in `pages.json`. It strips all existing quest pages (slugs starting with `quest-`) and writes a fresh set, preserving all non-quest pages.

**Run from the project root:**
```bash
node my-site/scripts/add-quest-pages.mjs
```

On Windows with ESM path quirks use the absolute path:
```powershell
node "C:\Users\lamar\Documents\Minecraft\Matrix\MatrixSite\my-site\scripts\add-quest-pages.mjs"
```

### Script anatomy
```js
// Resolve pages.json (strips leading / on Windows ESM paths)
const pagesPath = new URL('../server/data/wiki/pages.json', import.meta.url)
  .pathname.replace(/^\//, '');

// Helper: build a requirement object with embedded human-readable name
function questReq(questId, status = 'finished') {
  return { type: 'quest', questId, questName: QUEST_TITLES[questId], status };
}

// Helper: build a section object
function section(id, title, md, requires = null) {
  return { id, title, requires, bossId: '', itemId: '', contentMarkdown: md };
}

// Helper: build a page object
function page(slug, title, summary, icon, tags, sections, requires = null) {
  return { slug, title, summary, icon, tags, requires, bosses: [], items: [], sections };
}
```

When editing content, update the script and re-run it. Do **not** hand-edit `pages.json` for quest pages — the script is the canonical source.

### Adding a new quest page
1. Add the quest ID and title to `QUEST_TITLES` in the script.
2. Add a `page(...)` call to the `questPages` array.
3. Wire up `requires` using `questReq(prerequisiteId)` or `null` if none.
4. Re-run the script, then `npm run build`.

---

## 7. Frontend Display — `WikiPage.jsx`

### Requirement pills
The `formatRequirement` function renders a human-readable pill for each requirement. For quest type it uses `questName` (embedded in the requirement object) rather than the raw ID:

```js
if (req.type === "quest") {
  const statusLabel = {
    finished: "Completed",
    started: "Started",
    in_progress: "In Progress",
    not_started: "Not Started",
  }[req.status] || req.status || "Completed";
  const name = req.questName || `Quest ${req.questId}`;
  return `${name}: ${statusLabel}`;
}
```

**Result:** A locked page shows a pill like `"A Mysterious New Friend: Completed"` — no internal IDs visible to the user.

### Locked pages
When a page's `requires` condition is not met, `applyVisibility()` in the backend returns `locked: true` and omits all real content. The frontend renders the title, summary, and tags as obfuscated scramble text, and shows a "Locked" badge. Sections have the same mechanism independently.

---

## 8. Page List Grouping — `PageList.jsx`

The Legends Wiki listing groups pages into collapsible sections. The grouping is determined by tags:

| Category | Condition | Accent Color |
|---|---|---|
| Bosses | tag is `"boss"` or `"mobs"` | `text-red-400` |
| Items | tag is `"item"` or `"relic"` | `text-amber-400` |
| Characters | tag is `"character"` or `"npc"` | `text-sky-400` |
| Quests | tag is `"quest"` OR slug starts with `"quest-"` | `text-violet-400` |
| Misc | everything else | `text-slate-400` |

A page is assigned to the **first matching category** in this order. Quest pages must include `"quest"` in their `tags` array to fall into the Quests group.

The sections use the Server Wiki's dark card style (`bg-slate-900/60`, `border-slate-700/50`, `backdrop-blur`) with:
- A small `"CATEGORY"` label in the accent color
- Bold white title
- Always-visible description (even when collapsed)
- Page count in parentheses
- Rotating `▶` chevron
- First section defaults open, rest start collapsed

---

## 9. Admin Editor — `AdminPanel.jsx`

The `RequirementsEditor` component (used for both page-level and section-level requirements) supports the `"quest"` type.

### Quest fields in the editor
When "Quest" is selected in the type dropdown:
- **Quest ID** — number input; auto-resolves to the quest name shown beside it
- **Quest name preview** — read-only span showing the resolved name from `QUEST_NAMES` map
- **Status** — dropdown: Completed / Started / In Progress / Not Started

The `cleanRequirement` function serializes it:
```js
if (type === "quest") {
  return {
    type: "quest",
    questId: Number(item.questId),
    questName: QUEST_NAMES[questId] || item.questName || `Quest ${questId}`,
    status: item.status || "finished",
  };
}
```

### Keeping `QUEST_NAMES` in sync
`QUEST_NAMES` is defined near the top of `AdminPanel.jsx`. When new quest pages are added, add the new `questId: "Quest Title"` entry there. The same map exists in `add-quest-pages.mjs` as `QUEST_TITLES` — keep both in sync.

---

## 10. Content Writing Guidelines

- **Never expose quest IDs in visible text.** Use the quest's title instead.
- **Write in-world prose.** Sections should read like lore entries or adventure logs, not patch notes.
- **Use dialogue** (blockquote `>`) to bring NPC voice into the content.
- **Requirements should be minimal.** Only gate a page behind a quest if a player who hasn't done that quest would be meaningfully spoiled.
- **Chain correctly.** If you don't have a wiki page for the prerequisite quest, set `requires: null` rather than requiring a non-existent page.
- **Sections** can have their own `requires` field for spoilery content within an otherwise accessible page (e.g. a boss encounter section that requires finishing a prior quest).
