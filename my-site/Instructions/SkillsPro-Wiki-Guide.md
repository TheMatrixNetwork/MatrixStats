# SkillsPro Wiki — Agent Instructions

This document tells you everything you need to create, update, and maintain the SkillsPro class and stat wiki pages on the MatrixSite React frontend. Read it fully before touching any file.

---

## 1. Project Layout

```
my-site/
  src/
    App.jsx                          ← Route definitions and render cases
    assets/                          ← Class hero images (swordsman.jpg, mage.jpg, …)
    components/
      serverWiki/
        ServerWikiHome.jsx           ← Wiki landing page with class cards
        ServerWikiStats.jsx          ← Stats reference page (all 10 stats)
        ServerWikiSwordsman.jsx      ← Class page (one per class)
        ServerWikiVampire.jsx
        ServerWikiArbalist.jsx
        ServerWikiEidolon.jsx
        ServerWikiPriest.jsx
        ServerWikiJuggernaut.jsx
        ServerWikiDevourer.jsx
        ServerWikiFiremage.jsx
        ServerWikiMage.jsx
  SkillsPro/
    config.yml                       ← Global stat formulas, colors, functional-types
    Skills/
      Swordsman.yml                  ← Class source data (one per class)
      Vampire.yml
      Arbalist.yml
      Eidolon.yml
      Priest.yml
      Juggernaut.yml
      Devourer.yml
      Firemage.yml
      Mage.yml
      Vergil.yml                     ← Vergil exists in YAML but has NO wiki page yet
```

**Build command:** `npm run build` inside `my-site/`. Expects exit 0 and ~62 modules. Run this after every edit to verify nothing broke.

---

## 2. Source of Truth — Where to Find Everything

### 2a. Class primary stats
Each class YAML has a `stats:` array near the top:
```yaml
# Example: Devourer.yml
stats: [ ARC, DEX ]
```
These are the stats the class primarily invests in and that drive its ability formulas. Use them for the "Primary Stats" pill on the hero card and to populate the `usedBy` arrays on the Stats page.

### 2b. Class scaling formulas
Every class YAML has four top-level keys used for scaling cards on the wiki:
```yaml
max-health:   min(20 + (%skills_stat_vit% / 2), 60) + %elitemobs_health_bonus%
max-energy:   20 + (%skills_stat_int%/20) + (lvl/2)
energy-regen: 1 + (0.05 * max(lvl, min(125,%skills_stat_arc% * max(1,lvl/80))))
damage-cap:   "min(100, 5 + … + (%skills_stat_mit% * 0.9 * …))"
```
Strip the `%skills_stat_X%` placeholder wrapper and write just the math (e.g. `VIT/2`). The damage-cap formula is identical across every class — only the coefficient varies if noted.

### 2c. Ability data
Inside each class YAML under `abilities:`, each ability has its own block. The important fields are:
- `activation.key` — the key combo string (e.g. `LR`, `LLR`, `SL`)
- `activation.energy` — energy cost
- `activation.cooldown` — cooldown expression
- Damage/scaling fields — unique per ability (e.g. `damage: dex/5`, `chance: lvl * 10`)

`lvl` in all ability formulas = **ability level (1–3, not player level)**. Player level is `%skills_level%` or `level` in formulas.

### 2d. Global stat effects
Open `SkillsPro/config.yml` and find the `functional-types:` block (around line 824):
```yaml
functional-types:
  damage: 0
  defense: 'def / 20'
  speed: 0
  critical-damage: 'str / 3'
  critical-chance: 'lck'
```
Anything non-zero here is a **passive global effect** that applies to every player regardless of class. This is your source for `globalEffects` entries on the Stats page.

### 2e. Stat colors
Also in `config.yml`, each stat has a `color` field using Minecraft § codes. The canonical CSS equivalents (used in all wiki files) are:

| Stat | Full Name | CSS Color | Minecraft Code |
|------|-----------|-----------|----------------|
| STR  | Strength  | `#55FF55` | `&a` (green) |
| DEX  | Dexterity | `#FFAA00` | `&6` (gold) |
| ARC  | Arcane    | `#55FFFF` | `&b` (aqua) |
| VIT  | Vitality  | `#AA0000` | `&4` (dark red) |
| INT  | Intelligence | `#5555FF` | `&9` (blue) |
| MIT  | Might     | `#FF5555` | `&c` (red) |
| DEF  | Defense   | `#00AAAA` | `&3` (dark aqua) |
| LCK  | Luck      | `#FFFF55` | `&e` (yellow) |
| TCH  | Tech      | `#00AA00` | `&2` (dark green) |
| REL  | Religion  | `#FFFFFF` | `&f` (white) |

**Common mistakes to avoid:**
- MIT = **Might** (not Mitigation)
- REL = **Religion** (not Relic)
- TCH = **Tech** (not Touch or Technology)

---

## 3. Important Class-Specific Quirks

These are facts that cannot be found in the YAML files — they were provided directly and must be applied manually:

### Firemage
- Energy type is **health** (the bar is literally their health pool), not mana.
- **VIT drives both max health AND max energy** for Firemage. The `max-energy` formula in Firemage.yml uses `%skills_stat_vit%`, not INT.
- The wiki copy should make clear that investing VIT is doubly important for this class.

### Vampire
- Unlocked at **player level 666** (a secret/endgame class). Cost is 6,666,666.
- Energy type is **blood**. The blood bar depletes over time — you must attack to regenerate it.
- **Vampire does NOT use ARC for energy regen.** Its `energy-regen` formula uses `bloodwell` and `%vampire_temperature%`/`%vampire_radiation%` custom placeholders from a separate plugin. Exclude Vampire from the ARC usedBy list.
- `%vampire_temperature%` affects the blood bar's max energy negatively (more temperature = less max energy).

### Arbalist
- **Max energy uses TCH, not INT.** Formula: `20 + (tch/20) + (lvl/2)`. Arbalist should appear in TCH's usedBy list as the energy driver, not INT's.
- Energy type is **arrows** (the energy bar represents arrow ammo).
- LCK is a primary stat — headshot crits scale with LCK.

### Swordsman
- **Pierce** (the ability) compares **attacker's DEF vs. target's DEF** — not STR vs DEF. The attacker's DEF must exceed the target's DEF for the ability to proc. This is counterintuitive.
- Energy type is **mana**.
- Max energy formula is unique: `15 + (INT/15) + (lvl/4)` — slightly different coefficients from the standard formula.

### Eidolon
- Energy type is **imbalance** (shifts between light and dark states).
- REL and DEF are both primary stats. REL powers most abilities; DEF scales shields and damage caps.

### Juggernaut
- The passive shield proc chance formula is: `max(5, def-15 + ARC/20)` — ARC has a small role even though it is not a listed primary stat.

### Devourer
- ARC and DEX are both primary stats. DEX controls cloak damage, consume damage, and passive proc chance.
- Energy type is **mana**.

### Mage
- Stats are ARC and INT. ARC controls energy regen AND ability range on energy-flux and cooldown on chronoprohiberis.
- Energy type is **mana**.
- STR has a minor secondary role in the Neptune ability (multiply factor), but is not a primary stat.

### ARC (Arcane) — universal note
ARC controls energy regen for **every class**. Because energy is spent on abilities, faster regen = shorter effective cooldowns. **Always describe ARC as providing both "energy regen" AND "cooldown reduction"** for every class in the `usedBy` list on the Stats page.

### DEF (Defense) — global passive
As of the current config, `defense: 'def / 20'` is set in `functional-types`. This means **every player gets passive damage reduction equal to DEF ÷ 20**, regardless of class. This is a global effect and should appear in DEF's `globalEffects` on the Stats page.

---

## 4. Activation Key Combo System

Keys in the YAML `activation.key` string:
- `L` = Left Click
- `R` = Right Click
- `S` = Sneak (hold)

Reading combos:
- `LR` = Left Click then Right Click (within a short combo window)
- `LLR` = Left Click, Left Click, Right Click
- `SL` = Hold Sneak + Left Click
- `LLRR` = Left, Left, Right, Right

In the wiki JSX, these are rendered via the `KeyCombo` component. Keys starting with `S` are treated as a **hold modifier** displayed with a "+" separator before the rest of the sequence. All other keys show a "→" arrow between them.

---

## 5. Creating a New Class Wiki Page

### Step 1 — Read the YAML
Open `SkillsPro/Skills/ClassName.yml`. Collect:
- `stats:` array → primary stats
- `energy:` → energy type label
- `max-level:` → usually 100 (Vampire is 100 too)
- `required-level:` → unlock requirement (Vampire = 666)
- `max-health`, `max-energy`, `energy-regen`, `damage-cap` → scaling card formulas
- Each ability block under `abilities:` → key, energy cost, cooldown, damage/scaling fields

### Step 2 — Check assets/
Look in `my-site/src/assets/` for an image named after the class (e.g. `firemage.jpg`, `mage.jpg`). If it doesn't exist, the hero image section must be omitted or a placeholder used.

### Step 3 — Create the component file
Create `my-site/src/components/serverWiki/ServerWikiClassName.jsx`.

**Component template structure:**
```jsx
import React, { useState } from "react";
import classImg from "../../assets/classname.jpg"; // if image exists

// Stat color constants (only import the ones the class uses)
const STR = { color: "#55FF55" };
const DEX = { color: "#FFAA00" };
// … add others as needed

function S({ label, style }) {
  return <span className="font-bold" style={style}>{label}</span>;
}

const KEY_LABELS = { L: "Left Click", R: "Right Click", S: "Sneak" };
const HOLD_KEYS = new Set(["S"]);

function KeyCombo({ keys }) { /* … copy from any existing class page */ }

function AbilityCard({ title, activation, flavor, description, scalingDesc, scalingFormula }) {
  const [open, setOpen] = useState(false);
  /* … copy from any existing class page */
}

export default function ServerWikiClassName({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* Hero */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <button onClick={() => onNavigate("/server-wiki")} …>← Server Wiki</button>
        {/* class name, description pills (Primary Stats, Energy Type, Max Level) */}
        {/* hero image on the right */}
      </div>

      {/* Class Scaling */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        {/* grid of 4 formula cards: Max Health, Max Energy, Energy Regen, Damage Cap */}
      </div>

      {/* Abilities */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        {/* one <AbilityCard> per ability */}
      </div>

    </section>
  );
}
```

**Accent color per class:**
- Swordsman: amber (`text-amber-300`, `border-amber-500/60`)
- Vampire: red (`text-red-400`)
- Arbalist: amber
- Eidolon: violet (`text-violet-400`)
- Priest: yellow (`text-yellow-400`)
- Juggernaut: green (`text-green-400`)
- Devourer: purple (`text-purple-400`)
- Firemage: orange (`text-orange-400`)
- Mage: sky blue (`text-sky-400`)

### Step 4 — Wire up App.jsx
Add three things:

1. **Import** at the top:
```jsx
import ServerWikiClassName from "./components/serverWiki/ServerWikiClassName.jsx";
```

2. **Route** in the `useMemo` block:
```jsx
if (path === "/server-wiki/classname") return { view: "serverWikiClassName" };
```

3. **Render case** in the JSX return:
```jsx
{route.view === "serverWikiClassName" && <ServerWikiClassName onNavigate={navigate} />}
```

### Step 5 — Add card to ServerWikiHome.jsx
Add an entry to the `skillsEntries` array:
```js
{
  slug: "classname",          // matches the URL path segment
  title: "Class Display Name",
  summary: "One sentence description shown on the card.",
  accent: "border-purple-900/50 hover:border-purple-700/60",  // use class color
  label: "text-purple-400",
},
```
The card automatically navigates to `/server-wiki/classname` when clicked.

### Step 6 — Build
```
cd my-site
npm run build
```
Expect exit 0.

---

## 6. Updating the Stats Page (ServerWikiStats.jsx)

### Data structure
Each stat in the `STATS` array has:
```js
{
  id: "STR",               // stat abbreviation
  name: "Strength",        // full name
  max: 100,                // max level (LCK is 200)
  globalEffects: [         // prose strings — NO formula text here
    "Increases critical hit damage.",
  ],
  notes: "…",              // one-paragraph editorial note
  formulas: [              // feeds the accordion — formulas go HERE only
    { label: "Critical Damage Bonus", formula: "STR / 3" },
  ],
  usedBy: [                // short phrases — keep these brief
    { class: "Swordsman", detail: "Primary stat · melee damage" },
  ],
}
```

**Critical rule:** Formulas must appear **only** inside the `formulas` array (shown in the accordion dropdown). Never put formula strings like `"Formula: X = Y"` inside `globalEffects` — those render as visible plain text outside the dropdown and create clutter.

### `usedBy` source
Cross-reference every class YAML:
- `stats:` array → primary stat uses
- `max-energy:` formula → which stat drives energy capacity (note: Arbalist = TCH, Firemage = VIT)
- `energy-regen:` formula → almost always ARC (except Vampire)
- `damage-cap:` formula → always MIT (universal)
- `max-health:` formula → always VIT (universal)
- Ability formulas inside `abilities:` → any stat variable used there

### ARC usedBy rule
**Every class (except Vampire) should say "Energy regen · cooldown reduction"** in their ARC `usedBy` detail. Vampire is excluded entirely because its regen does not use ARC.

### DEF global effect
DEF has a global passive: `def / 20` (set in `config.yml` functional-types). All classes passively benefit from this formula. It should appear in `globalEffects` and in the `formulas` accordion.

### `ClassBadge` colors
The `CLASS_COLORS` map inside ServerWikiStats.jsx uses Tailwind color hex values (not the stat colors):
```js
const CLASS_COLORS = {
  Swordsman: "#ef4444",
  Vampire:   "#dc2626",
  Arbalist:  "#f59e0b",
  Eidolon:   "#8b5cf6",
  Priest:    "#facc15",
  Juggernaut:"#22c55e",
  Devourer:  "#a855f7",
  Firemage:  "#fb923c",
  Mage:      "#38bdf8",
};
```

---

## 7. Design System Reference

### Dark theme tokens
- Page background: `bg-slate-950`
- Section card: `rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur`
- Ability card: `rounded-2xl border border-slate-700/60 bg-slate-900/70 p-7 shadow`
- Inner formula block: `rounded-xl border border-slate-700/50 bg-slate-950/60 px-5 py-4`
- Inline code / formula: `font-mono text-amber-300` or `text-slate-300`

### Typography
- Page headings: `text-5xl lg:text-7xl font-bold text-slate-100` (Cinzel font)
- Section headings: `text-3xl font-bold text-slate-100`
- Ability title: `text-2xl font-bold text-[accentColor]`
- Body prose: `text-base leading-relaxed text-slate-400`
- Flavor text: `text-lg italic text-slate-300`
- Stat pills label: `text-sm uppercase tracking-widest text-slate-500`

### Stat color spans — class page pattern
```jsx
// Define at file top
const STR = { color: "#55FF55" };

// Usage in JSX
<S label="STR" style={STR} />
```

### Stat color spans — Stats page pattern
The Stats page uses a different `S` component signature:
```jsx
// ServerWikiStats.jsx only
<S stat="STR" />         // renders "STR" in its color
<S stat="STR">Strength</S>  // renders "Strength" in STR's color
```

### Accordion pattern (class pages)
The `AbilityCard` `scalingFormula` prop triggers a "Show Formula" / "Hide Formula" toggle in amber. The toggle state is local `useState` inside `AbilityCard`.

### Accordion pattern (Stats page)
`FormulaAccordion` component accepts `formulas: [{ label, formula }]`. Shows "Show formulas" / "Hide formulas" in slate. Formulas render as `<code>` blocks.

### `CollapsibleSection` (ServerWikiHome.jsx)
Used to wrap the "SkillsPro Classes" and "Bending" sections on the home page. Props: `title`, `description`, `accentClass`, `children`, `defaultOpen`.

---

## 8. Checklist for Adding a New Class

- [ ] Read `SkillsPro/Skills/ClassName.yml` for all source data
- [ ] Check `SkillsPro/config.yml` functional-types for any global stat effects
- [ ] Verify hero image exists in `src/assets/`
- [ ] Apply class-specific quirks from Section 3 above
- [ ] Create `ServerWikiClassName.jsx` following the template in Section 5
- [ ] Add import to `App.jsx`
- [ ] Add route to `App.jsx` `useMemo` block
- [ ] Add render case to `App.jsx` JSX return
- [ ] Add card entry to `ServerWikiHome.jsx` `skillsEntries` array
- [ ] Update `ServerWikiStats.jsx` `usedBy` arrays to include the new class under each stat it uses
- [ ] Run `npm run build` → expect exit 0

---

## 9. Checklist for Updating a Stat

- [ ] Check `SkillsPro/config.yml` functional-types to see if the stat gained a global effect
- [ ] Check every class YAML for new uses of that stat variable in ability formulas
- [ ] Update `globalEffects` (prose only — no formulas)
- [ ] Update `formulas` array (accordion)
- [ ] Update `usedBy` for every class affected
- [ ] Do NOT put formula strings in `globalEffects`
- [ ] Run `npm run build` → expect exit 0

---

## 10. Currently Missing / Incomplete

- **Vergil** — a class YAML exists (`SkillsPro/Skills/Vergil.yml`) but there is no wiki page for it. Stats are `INT` and `DEX`. Energy type is **concentration** (a custom bossbar). Max level is 100. Required level is 0. This class was not completed as of the last session.
- No classes are on the Bending section of `ServerWikiHome.jsx` yet — that section exists as a placeholder.
