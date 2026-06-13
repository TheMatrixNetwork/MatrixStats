import React, { useState } from "react";
import devourerImg from "../../assets/devourer.jpg";

// Stat colors matching SkillsPro config.yml
const ARC = { color: "#55FFFF" }; // &b aqua      — Arcane
const DEX = { color: "#FFAA00" }; // &6 gold      — Dexterity
const VIT = { color: "#AA0000" }; // &4 dark red  — Vitality
const INT = { color: "#5555FF" }; // &9 blue      — Intelligence
const MIT = { color: "#FF5555" }; // &c red       — Might

function S({ label, style }) {
  return <span className="font-bold" style={style}>{label}</span>;
}

const KEY_LABELS = {
  L: "Left Click",
  R: "Right Click",
  S: "Sneak",
};

const HOLD_KEYS = new Set(["S"]);

function KeyCombo({ keys }) {
  const parts = keys.split("");
  const hasHold = parts.length > 1 && HOLD_KEYS.has(parts[0]);
  const holdKey = hasHold ? parts[0] : null;
  const pressKeys = hasHold ? parts.slice(1) : parts;

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {holdKey && (
        <>
          <kbd className="rounded-md border border-purple-500/60 bg-purple-950/70 px-2.5 py-1 text-sm font-semibold text-purple-300">
            {KEY_LABELS[holdKey]}
          </kbd>
          <span className="text-base text-slate-400 font-semibold select-none">+</span>
        </>
      )}
      {pressKeys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-base text-green-500/70 font-bold select-none">→</span>
          )}
          <kbd className="rounded-md border border-slate-500/70 bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-200">
            {KEY_LABELS[k] || k}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

function AbilityCard({ title, reqLevel, activation, itemReq, flavor, description, scalingDesc, scalingFormula }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-purple-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-purple-400">{title}</h3>
          {reqLevel != null && (
            <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-0.5 text-xs uppercase tracking-wider text-slate-400">
              Req. Lvl {reqLevel}
            </span>
          )}
        </div>
        {activation && (
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs uppercase tracking-widest text-slate-500">Activation Sequence</span>
            <KeyCombo keys={activation} />
            {itemReq && (
              <span className="text-xs text-slate-500 italic">{itemReq}</span>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-lg italic text-slate-300 leading-relaxed">{flavor}</p>
      <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>

      {scalingDesc && (
        <div className="mt-5 rounded-xl border border-purple-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-purple-400/80 hover:text-purple-300 transition"
              >
                <span
                  className="inline-block transition-transform duration-200"
                  style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                  ▶
                </span>
                {open ? "Hide Formula" : "Show Formula"}
              </button>

              {open && (
                <div className="mt-3 rounded-lg border border-purple-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-purple-200">
                  {scalingFormula}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function ServerWikiDevourer({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-purple-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-purple-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Devourer</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-purple-800/80">
              Available from Level 3 · Cost: 1,000
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Devourer is a{" "}
              <span className="text-purple-400 font-semibold">stealth assassin and soul predator</span>{" "}
              — a class that hunts through invisibility, corrodes enemies from within, blinks
              through space, and strips souls to deny healing and empower itself.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Every hit applies a wither-like corrosion that bleeds the target over time. Cloak
              fades you from sight and pacifies mobs. Blink teleports you erratically around a
              target. Disarm rips the weapon from their hands. Locate reveals nearby enemies
              through walls. And Consume has a chance to outright steal souls — or deal burst
              damage if there are none to take. The Devourer doesn't fight fair.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="ARC" style={ARC} /> &nbsp;·&nbsp; <S label="DEX" style={DEX} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-purple-400">Mana</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={devourerImg}
              alt="Devourer"
              className="w-full rounded-2xl border border-purple-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Devourer.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(20 + (VIT × 0.38), 58)",
              note: <><S label="VIT" style={VIT} /> grows your health pool up to 58 health (29 hearts). The Devourer is not inherently tanky — staying alive relies on playing unseen.</>,
            },
            {
              label: "Max Mana",
              formula: "20 + (INT/20) + (lvl/2)",
              note: <><S label="INT" style={INT} /> and level expand your mana pool, giving you more Blink, Disarm, and Locate activations before running dry.</>,
            },
            {
              label: "Mana Regen",
              formula: "10 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/80)))",
              note: <><S label="ARC" style={ARC} /> is the Devourer's engine — it fuels mana recovery, reduces ability cooldowns, extends Cloak duration, and boosts passive corrosion damage.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(56, 6 + max(0, lvl-1)·(6/99) + MIT·1.0·((lvl-1)/99)^1.88)",
              note: <><S label="MIT" style={MIT} /> (Might) raises your overall damage ceiling as you level, amplifying every burst and corrosion tick at the top end.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-purple-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          The Devourer's passive corrodes every target it touches. Active abilities are activated
          through quick-click sequences — invest in <S label="ARC" style={ARC} /> to cut their cooldowns.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="They don't bleed. They corrode."
            description="Every attack the Devourer lands has a chance to inflict a wither-like corrosion on the target. Once applied, the corrosion drains the target's health repeatedly over its duration — unlike poison, wither damage works on undead and spiders too. The proc chance, the damage per tick, and how long the effect lasts all scale with your stats."
            scalingDesc={
              <>
                <p>Tick damage scales with <S label="ARC" style={ARC} /> — Arcane is the primary driver of how much each corrosion pulse hurts.</p>
                <p>Proc chance scales with <S label="DEX" style={DEX} /> — Dexterity increases how often each hit applies the effect.</p>
                <p>Duration scales with <S label="ARC" style={ARC} /> — higher Arcane keeps targets corroding longer after each hit.</p>
                <p>Amplifier scales with stat breakpoints — maxing <S label="DEX" style={DEX} /> upgrades corrosion strength, and maxing both <S label="DEX" style={DEX} /> + <S label="ARC" style={ARC} /> upgrades it again.</p>
              </>
            }
            scalingFormula={
              <>
                <p>tick damage = max(1, (<S label="ARC" style={ARC} /> × 2.5) / 10.25)</p>
                <p>proc chance = (30 + <S label="DEX" style={DEX} />/4) + 30 %</p>
                <p>duration = 5 + (30 + <S label="ARC" style={ARC} />/2) seconds</p>
                <p>amplifier = 1 + floor(<S label="DEX" style={DEX} />/100) + floor((<S label="DEX" style={DEX} /> + <S label="ARC" style={ARC} />)/200)</p>
              </>
            }
          />

          <AbilityCard
            title="Gliders"
            reqLevel={4}
            flavor="Gravity is optional."
            description="A passive movement upgrade that improves with each level. Level 1 grants a sprint speed boost. Level 2 eliminates fall damage. Level 3 unlocks a double jump. The speed boost scales with Arcane — higher ARC means faster sprints. All three levels stack as you upgrade."
            scalingDesc={
              <>
                <p>Sprint speed duration scales with <S label="ARC" style={ARC} /> while sprint speed tier scales with <S label="DEX" style={DEX} />.</p>
                <p>Double jump (level 3) height scales with <S label="DEX" style={DEX} /> and ability level, with an upper cap to prevent over-mobility.</p>
              </>
            }
            scalingFormula={
              <>
                <p>speed duration = <S label="ARC" style={ARC} /> + 20 ticks</p>
                <p>speed tier = min(5, lvl + floor(<S label="DEX" style={DEX} />/35))</p>
                <p>double jump height = min(1.8, 1 + <S label="DEX" style={DEX} />/125 + lvl×0.1)</p>
              </>
            }
          />

          <AbilityCard
            title="Cloak"
            reqLevel={5}
            flavor="You were never there."
            description="A permanent passive invisibility that activates automatically. When you attack, invisibility drops for 30 seconds before re-applying. Level 2 extends the effect: mobs become neutral to you passively — attacking one disables neutrality for 30 seconds, but most mobs ignore you otherwise. Level 3 adds a bonus: the very first attack you land while cloaked deals extra damage before you become visible."
            scalingDesc={
              <>
                <p>First-strike bonus damage (level 3) scales with <S label="DEX" style={DEX} /> — Dexterity amplifies the opening strike reward.</p>
                <p>Invisibility cooldown (time before re-applying after attack) scales with ability level and <S label="ARC" style={ARC} /> — higher ARC shortens the wait.</p>
                <p>Neutrality cooldown (time before mobs are pacified again after attacking) scales with ability level and <S label="ARC" style={ARC} />.</p>
              </>
            }
            scalingFormula={
              <>
                <p>first-strike bonus damage = <S label="DEX" style={DEX} />/5</p>
                <p>invisibility cooldown = 100 − (lvl × max(1, <S label="ARC" style={ARC} />/4)) seconds</p>
                <p>neutrality cooldown = 140 − (lvl × max(1, <S label="ARC" style={ARC} />/3)) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Locate"
            reqLevel={10}
            activation="RS"
            itemReq="Requires a Compass"
            flavor="You always know where they are."
            description="Right Click → Sneak while holding a Compass to ping nearby players within range. Any players detected are revealed — useful for hunting targets through walls or dense terrain before you commit to an attack. Range scales with ability level. Cooldown scales down with Arcane."
            scalingDesc={
              <>
                <p>Detection range scales with ability level — each level adds 10 blocks of coverage.</p>
                <p>Cooldown decreases with ability level and <S label="ARC" style={ARC} /> — higher Arcane means faster reuse.</p>
                <p className="text-slate-500 text-sm">Mana cost: lvl×2. Cooldown: max(1, lvl×4) × (1.15 − ARC×0.006) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>range = 10 × lvl blocks</p>
                <p>cooldown = max(1, lvl×4) × (1.15 − <S label="ARC" style={ARC} />×0.006) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Blink"
            reqLevel={10}
            activation="RLL"
            flavor="You're everywhere. Then you're nowhere."
            description="Right Click → Left Click → Left Click to activate a rapid teleportation aura around your target. For the next several hits, you blink to a random position near the target with each attack — making you extremely difficult to track, retaliate against, or hit. The number of blink teleports scales with both ability level and Dexterity. Cooldown scales down with Arcane."
            scalingDesc={
              <>
                <p>Number of blink teleports scales with ability level and <S label="DEX" style={DEX} /> — Dexterity adds extra blinks on top of base level scaling.</p>
                <p>Cooldown decreases with ability level and <S label="ARC" style={ARC} /> — Arcane lets you reactivate Blink more often.</p>
                <p className="text-slate-500 text-sm">Mana cost: lvl×2. Cooldown: max(1, lvl×4) × (1.15 − ARC×0.006) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>blink teleports = min(14, lvl×3 + floor(<S label="DEX" style={DEX} />/20))</p>
                <p>cooldown = max(1, lvl×4) × (1.15 − <S label="ARC" style={ARC} />×0.006) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Disarm"
            reqLevel={10}
            activation="LLR"
            flavor="Fight me without your weapon."
            description="Left Click → Left Click → Right Click to strip the weapon from your target's hands. Level 1 moves their weapon to an open inventory slot (if one exists). Level 2 swaps their weapon with another item from their inventory — actively replacing it. Level 3 also changes which hotbar slot they're using, compounding the disorientation. Cooldown scales down with Arcane."
            scalingDesc={
              <>
                <p>No direct stat formula on disarm effect — the level determines which of three tiers applies.</p>
                <p>Cooldown decreases with ability level and <S label="ARC" style={ARC} /> — Arcane reduces the wait between uses.</p>
                <p className="text-slate-500 text-sm">Mana cost: lvl×2. Cooldown: max(1, lvl×4) × (1.15 − ARC×0.006) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>cooldown = max(1, lvl×4) × (1.15 − <S label="ARC" style={ARC} />×0.006) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Consume"
            reqLevel={20}
            flavor="Their strength becomes yours."
            description="A passive on-attack effect with a chance to fire on each hit. When it procs, it steals souls from the target — siphoning them away and denying them whatever soul-based benefits those souls provide. If the target has no souls to steal, Consume deals burst damage instead as a fallback. Both the soul steal amount and the fallback damage scale with your stats."
            scalingDesc={
              <>
                <p>Proc chance scales with ability level — higher levels make Consume fire more reliably.</p>
                <p>Souls stolen per proc scales with <S label="ARC" style={ARC} /> and ability level — Arcane is the primary driver of how many souls are taken.</p>
                <p>Fallback damage (when target has no souls) scales with ability level and <S label="DEX" style={DEX} /> with stronger coefficients for better late-game relevance.</p>
              </>
            }
            scalingFormula={
              <>
                <p>proc chance = lvl×5 %</p>
                <p>souls stolen = (<S label="ARC" style={ARC} />/3) + lvl</p>
                <p>fallback damage = max((lvl×6) + 12, (<S label="DEX" style={DEX} />×0.55) + (lvl×4))</p>
              </>
            }
          />

          <AbilityCard
            title="Hook"
            reqLevel={20}
            activation="RFF"
            flavor="Distance is not safety."
            description="Right Click → Switch Item (F) → Switch Item (F) to fire a spectral grappling hook. Can be used offensively to close distance on a fleeing target or defensively to escape a bad position. Hook range scales with Arcane, starting short and becoming long-range at high ARC. Level 2 removes all fall damage taken when landing from a hook. Cooldown scales down with Arcane."
            scalingDesc={
              <>
                <p>Hook range scales with <S label="ARC" style={ARC} /> from 25 blocks up to 75 blocks.</p>
                <p>Cooldown decreases with <S label="ARC" style={ARC} /> — Arcane lets you fire the hook more often.</p>
                <p className="text-slate-500 text-sm">Mana cost: 15. Cooldown: max(2, 10 × (1.15 − ARC×0.0095)) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>range = min(75, 25 + <S label="ARC" style={ARC} />/2) blocks</p>
                <p>cooldown = max(2, 10 × (1.15 − <S label="ARC" style={ARC} />×0.0095)) seconds</p>
              </>
            }
          />

        </div>
      </div>

      {/* ── Build Notes ──────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Build Notes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Arcane is the Devourer's most important stat by far. It drives mana regen, reduces every ability cooldown, boosts passive corrosion damage and duration, extends Cloak re-application, and amplifies Consume's soul steal. Stack this first.",
            },
            {
              stat: <S label="DEX" style={DEX} />,
              desc: "Dexterity raises the passive corrosion proc chance, increases Cloak's first-strike bonus damage, strengthens Consume's fallback burst, boosts Blink hit-chain count, and improves Gliders speed tier and jump height. A major offensive-mobility stat.",
            },
            {
              stat: <S label="VIT" style={VIT} />,
              desc: "Vitality expands the health pool toward the 58-health (29-heart) cap. The Devourer doesn't naturally sustain — more health buys time to vanish and reset when pressure gets too high.",
            },
            {
              stat: <S label="INT" style={INT} />,
              desc: "Intelligence grows the mana pool, allowing more activations of Blink, Disarm, Locate, and Hook before needing to wait for mana regen. A situational third pick for ability-heavy playstyles.",
            },
          ].map(({ stat, desc }, i) => (
            <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-xl font-bold">{stat}</p>
              <p className="mt-2 text-base text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
