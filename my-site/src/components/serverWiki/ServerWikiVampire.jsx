import React, { useState } from "react";
import vampireImg from "../../assets/vampire.png";
import altarImg from "../../assets/altar.png";

// Minecraft §color → CSS. Matches SkillsPro config.yml stat colors.
const STR = { color: "#55FF55" };   // &a green
const LCK = { color: "#FFFF55" };   // &e yellow
const INT = { color: "#5555FF" };   // &9 blue
const VIT = { color: "#AA0000" };   // &4 dark red
const ARC = { color: "#55FFFF" };   // &b aqua
const MIT = { color: "#FF5555" };   // &c red

function S({ label, style }) {
  return <span className="font-bold" style={style}>{label}</span>;
}

// Key label display names
const KEY_LABELS = {
  L: "Left Click",
  R: "Right Click",
  S: "Sneak",
  Q: "Drop Item",
  F: "Switch Item",
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
            <span className="text-base text-red-500/70 font-bold select-none">→</span>
          )}
          <kbd className="rounded-md border border-slate-500/70 bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-200">
            {KEY_LABELS[k] || k}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

function AbilityCard({ title, reqLevel, activation, flavor, description, scalingDesc, scalingFormula }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-red-900/30 bg-slate-900/70 p-7 shadow">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-red-400">{title}</h3>
          {reqLevel && (
            <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-0.5 text-xs uppercase tracking-wider text-slate-400">
              Req. Lvl {reqLevel}
            </span>
          )}
        </div>
        {activation && (
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs uppercase tracking-widest text-slate-500">Activation Sequence</span>
            <KeyCombo keys={activation} />
          </div>
        )}
      </div>

      {/* Flavor */}
      <p className="mt-4 text-lg italic text-slate-300 leading-relaxed">{flavor}</p>

      {/* Plain description */}
      <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>

      {/* Scaling section */}
      {scalingDesc && (
        <div className="mt-5 rounded-xl border border-red-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-red-400/80 hover:text-red-300 transition"
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
                <div className="mt-3 rounded-lg border border-red-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-red-200">
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

export default function ServerWikiVampire({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-red-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* left text */}
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-red-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Vampire</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-red-800/80">
              Unlocked at Level 666
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Vampire is a{" "}
                          <span className="text-red-400 font-semibold">cursed predator class</span> — a dark
                          existence that feeds on the suffering of others. Blood is everything: it fuels your
              power, drains constantly in daylight, and must be replenished through combat. The more you
              hunt, the more dangerous you become.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
                          The Vampire demands constant aggression — your blood depletes over time, and only
                          attacking keeps you strong. Stand still and you weaken. Hunt and you are unstoppable.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="STR" style={STR} /> &nbsp;·&nbsp; <S label="INT" style={INT} /> &nbsp;·&nbsp; <S label="VIT" style={VIT} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-red-400">Blood</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-red-500">666</p>
              </div>
            </div>
          </div>

          {/* right image */}
                  <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={vampireImg}
              alt="Vampire"
              className="w-full rounded-2xl border border-red-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

          {/* ── How to Become a Vampire ───────────────────────────── */}
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">How to Become a Vampire</h2>
              <p className="mt-2 text-base text-slate-400">
                  You cannot simply choose the Vampire class — you must be <span className="font-semibold text-red-400">turned</span>. There are two paths into the curse, and only one way out.
              </p>

              <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
                  <div className="flex-1 space-y-5">
                      <div className="rounded-2xl border border-red-900/40 bg-slate-950/50 p-5">
                          <p className="text-lg font-bold text-red-400">Turned by Another Vampire</p>
                          <p className="mt-2 text-base leading-relaxed text-slate-400">
                              Any Vampire player with <span className="font-semibold text-slate-200">/v intent</span> enabled can infect a human. If a Vampire chooses to pass on the curse, their victim begins the transformation. This is the social path into the class.
                          </p>
                      </div>

                      <div className="rounded-2xl border border-red-900/40 bg-slate-950/50 p-5">
                          <p className="text-lg font-bold text-red-400">Dark Altar</p>
                          <p className="mt-2 text-base leading-relaxed text-slate-400">
                              Magical altars can be constructed using simple Minecraft materials to transform a Human into a Vampire. All required blocks must be placed close to the central Altar block — decorative extras are allowed.
                          </p>
                          <p className="mt-3 text-base text-slate-400">
                              <span className="font-semibold text-amber-300">Right-click a Gold Block</span> to learn how to build a <span className="font-semibold text-red-400">Darkness Altar</span>.
                          </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-900/40 bg-slate-950/50 p-5">
                          <p className="text-lg font-bold text-emerald-400">Light Altar — Cure</p>
                          <p className="mt-2 text-base leading-relaxed text-slate-400">
                              The Light Altar is the only known cure for the vampiric curse. If you want to return to humanity, this is your path.
                          </p>
                          <p className="mt-3 text-base text-slate-400">
                              <span className="font-semibold text-emerald-300">Right-click a Lapis Block</span> to learn how to build a <span className="font-semibold text-emerald-400">Light Altar</span>.
                          </p>
                      </div>
                  </div>

                  <div className="flex-shrink-0 lg:w-96 xl:w-[28rem]">
                      <img
                          src={altarImg}
                          alt="Vampire altars"
                          className="w-full rounded-2xl border border-slate-700/50 shadow-xl object-cover"
                      />
                      <p className="mt-2 text-center text-xs text-slate-500">Dark Altar (left) and Light Altar (right)</p>
                  </div>
              </div>
          </div>

          {/* ── Strengths & Weaknesses ───────────────────────────── */}
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">Strengths &amp; Weaknesses</h2>
              <p className="mt-2 text-base text-slate-400">The curse cuts both ways. Know what you gain — and what you surrender.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6">
                      <h3 className="text-xl font-bold text-emerald-400">Strengths</h3>
                      <ul className="mt-4 space-y-2.5">
                          {[
                              "Fill hunger by attacking living entities — food does nothing",
                              "Other Vampires or humans can donate blood directly to you",
                              "Much larger hunger bar than the default 20",
                              "No suffocation damage or fall damage",
                              "Mobs won't target you unless you attack first",
                              "Speed, Jump Boost, and Strength that scale with Bloodlust",
                              "Permanent Night Vision",
                          ].map((s, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-base text-slate-300">
                                  <span className="mt-0.5 flex-shrink-0 text-emerald-400 font-bold">+</span>
                                  <span>{s}</span>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
                      <h3 className="text-xl font-bold text-red-400">Weaknesses</h3>
                      <ul className="mt-4 space-y-2.5">
                          {[
                              ["Extremely weak to wooden weapons and tools", true],
                              ["Sunlight burns and weakens you — avoid daylight", false],
                              ["Extremely vulnerable to Holy Water", false],
                              ["Bloodlust consumes hunger much faster than normal", false],
                              ["Food does not restore hunger — only blood from living creatures does", true],
                          ].map(([s, highlight], i) => (
                              <li key={i} className="flex items-start gap-2.5 text-base">
                                  <span className="mt-0.5 flex-shrink-0 text-red-500 font-bold">−</span>
                                  <span className={highlight ? "text-red-300 font-semibold" : "text-slate-400"}>{s}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>

          {/* ── Commands ─────────────────────────────────────────── */}
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <h2 className="text-3xl font-bold text-slate-100">Commands</h2>
              <p className="mt-2 text-base text-slate-400">
                  Vampire has its own command suite under <code className="rounded bg-slate-800 px-2 py-0.5 text-sm text-red-300 font-mono">/v</code>. Use <code className="rounded bg-slate-800 px-2 py-0.5 text-sm text-red-300 font-mono">/v help</code> in-game to see the full list.
              </p>

              <div className="mt-5 space-y-3">
                  {[
                      { cmd: "/v bloodlust", desc: "Toggle your Bloodlust. Increases combat power, Speed, Strength, and Jump Boost — but burns through hunger much faster." },
                      { cmd: "/v nightvision", desc: "Toggle your innate Night Vision. See clearly in total darkness without any cost." },
                      { cmd: "/v intent", desc: "Toggle infection intent. With intent enabled, you can turn human players into Vampires." },
                  ].map(({ cmd, desc }) => (
                      <div key={cmd} className="flex flex-col gap-1.5 rounded-xl border border-slate-700/50 bg-slate-950/50 px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
                          <code className="flex-shrink-0 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1.5 text-base font-mono font-bold text-red-300">{cmd}</code>
                          <p className="text-base text-slate-400 leading-relaxed">{desc}</p>
                      </div>
                  ))}
              </div>

              {/* Nosferatu */}
              <div className="mt-6 rounded-2xl border border-amber-700/40 bg-amber-950/20 p-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-xl font-bold text-amber-400">Nosferatu</h3>
                      <span className="rounded-full border border-amber-700/50 bg-amber-950/50 px-3 py-0.5 text-xs uppercase tracking-wider text-amber-500">Store Upgrade</span>
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-slate-400">
                      Purchased from the server store. Nosferatu is a premium upgrade to the Vampire experience that unlocks exclusive perks:
                  </p>
                  <ul className="mt-4 space-y-2">
                      <li className="flex items-start gap-2.5 text-base text-slate-300">
                          <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">+</span>
                          <span><code className="rounded bg-slate-800 px-2 py-0.5 text-sm text-amber-300 font-mono">/v batusi</code> — Transform into a bat cloud and gain full flight.</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-base text-slate-300">
                          <span className="mt-0.5 flex-shrink-0 text-amber-400 font-bold">+</span>
                          <span>Slower sun overheating rate, reduced burn damage, and reduced daylight debuffs.</span>
                      </li>
                  </ul>
              </div>
          </div>

      {/* ── Blood Mechanic Callout ────────────────────────────── */}
      <div className="rounded-3xl border border-red-900/50 bg-red-950/30 p-7 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-red-400">The Blood Mechanic</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-300">
          Unlike every other class, Vampire uses <span className="font-bold text-red-400">Blood</span> as
          its energy — and Blood drains constantly over time. Your blood level directly affects how much
          bonus melee damage you deal, so letting it drop hurts you twice: less damage, and fewer resources for abilities.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Blood is restored by attacking enemies. High <S label="INT" style={INT} /> slows the rate of blood loss.
          The <span className="font-semibold text-slate-200">Blood Well</span> ability passively extends your
          maximum blood capacity and gives a chance to stop blood loss outright.
        </p>
        <div className="mt-4 rounded-xl border border-red-900/40 bg-slate-950/50 px-5 py-4 text-base text-slate-400 space-y-1">
          <p>Blood drains faster when your personal temperature is high. Sunlight and fire damage both raise that temperature, while night cools you back down. As your temperature rises, your maximum health and blood pool both shrink; when it falls again, your health can surge back up.</p>
                  <p className="text-sm text-slate-500">Tip: Wearing most helmets will shield you from the sun — protection from solar exposure can be the difference between life and ash.</p>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Vampire.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "20 + (VIT × 2 × max(0, 1 - temperature))",
              note: <><S label="VIT" style={VIT} /> gives exactly +1 heart per point when temperature is 0. Sunlight and fire push temperature up, cutting that scaling down, while nighttime cooling lets your health climb back up fast. At temperature 1, max health returns to 20.</>,
            },
            {
              label: "Max Blood",
              formula: "15 + (INT/20) + (lvl/15) − temperature",
                note: <><S label="INT" style={INT} /> and level grow your blood capacity. Your personal temperature reduces it.</>,
            },
            {
              label: "Blood Drain",
              formula: "(max_blood / (20 + bloodwell)) + (radiation + temperature × 3)",
                note: <>Blood drains passively each second. Higher personal temperature and nearby radiation accelerate it. More <S label="INT" style={INT} /> and a higher Blood Well level slow the drain.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(47.5, 4.8 + max(0, lvl-1)·(4.8/99) + MIT·0.74·((lvl-1)/99)^1.8)",
              note: <><S label="MIT" style={MIT} /> raises your damage cap ceiling as you level.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-red-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          Active abilities use activation key sequences pressed within a short combo window.
          Blood costs are paid from your current blood pool, not restored on use.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            flavor="You are always hungry. The blood in your veins is never enough — and that hunger is what makes you deadly."
            description="Your melee damage scales with the blood you're currently carrying. The more blood you have, the harder each strike lands. Conversely, letting your blood drop will directly cost you offensive power. Blood drains over time — attacking enemies is how you refill it."
            scalingDesc={
              <>
                <p>Melee damage bonus scales with both <S label="STR" style={STR} /> and <S label="INT" style={INT} /> — both stats feed your raw combat power.</p>
                <p>Blood drain rate is reduced by <S label="INT" style={INT} /> — smarter vampires lose blood more slowly.</p>
                <p className="text-slate-500 text-sm">Helmet restriction: iron, gold, diamond, and carved pumpkin helmets are blocked.</p>
              </>
            }
            scalingFormula={
              <>
                <p>bonus damage = <S label="STR" style={STR} />/50 + <S label="INT" style={INT} />/30 (per blood)</p>
                <p>blood drain = (15 − <S label="INT" style={INT} />/35) + (temperature × 16) per second</p>
              </>
            }
          />

          <AbilityCard
            title="Blood Lust"
            reqLevel={5}
            flavor="Something inside you snaps. You stop fighting to survive and start fighting because you love it."
            description="When your blood well is above 70%, you can enter a frenzy that supercharges your melee damage. At higher ability levels, your natural health regeneration also increases during the frenzy, and your attacks have a chance to heal you directly based on your current blood level."
            scalingDesc={
              <>
                <p>Frenzy damage bonus scales with your <S label="STR" style={STR} /> and level combined — both matter.</p>
                <p>Health regeneration during frenzy scales with <S label="VIT" style={VIT} /> — more Vitality, more sustained healing.</p>
                <p>Heal-on-hit chance at level 3 scales with your current blood — the fuller your well, the more often you heal.</p>
                <p>Blood cost decreases as your level grows — higher levels make this much cheaper to activate.</p>
                <p className="text-slate-500 text-sm">Requires 70%+ blood to activate. Level 2 adds regen. Level 3 adds heal-on-hit.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage bonus = (<S label="STR" style={STR} /> + lvl) / 20</p>
                <p>health regen = 0.5 + <S label="VIT" style={VIT} />/75</p>
                <p>heal-on-hit amount = 1 + <S label="ARC" style={ARC} />/30 (chance: <S label="ARC" style={ARC} />/20 + lvl×2 %)</p>
                <p>blood cost = <S label="VIT" style={VIT} />/2 + 60 − (lvl × 10)</p>
              </>
            }
          />

          <AbilityCard
            title="Blood Well"
            reqLevel={5}
            flavor="You've learned to hold more. The curse runs deeper now — and with it, so does your power."
            description="Each upgrade significantly increases your maximum blood capacity, letting you store more and go longer between attacks. It also gives a passive chance every 4 seconds to completely stop your blood drain, buying you time without needing to hunt."
            scalingDesc={
              <>
                <p>Chance to halt blood drain scales with <S label="INT" style={INT} /> and level — smarter and more experienced vampires resist the drain more reliably.</p>
                <p className="text-slate-500 text-sm">Passive. No activation required. Drain-stop chance procs every 4 seconds.</p>
              </>
            }
            scalingFormula={
              <p>stop-drain chance = (<S label="INT" style={INT} />/2 + (lvl × 5)) / 5 (%)</p>
            }
          />

          <AbilityCard
            title="Bleed"
            reqLevel={10}
            flavor="You don't just hurt them. You open them up, and drink what spills out."
            description="Your attacks have a chance to inflict a 5-second bleed on your target. Every time they take damage while bleeding, you heal for the same amount. The higher your Vitality and Strength, the more each bleed tick heals you."
            scalingDesc={
              <>
                <p>Heal-per-tick scales with both <S label="VIT" style={VIT} /> and <S label="STR" style={STR} /> — both stats feed your lifesteal.</p>
                <p>Bleed duration scales with <S label="ARC" style={ARC} /> — more Arcane keeps the bleed active longer.</p>
                <p>Proc chance scales with level and <S label="LCK" style={LCK} /> — at 100 Luck the bleed proc reaches 80%.</p>
                <p className="text-slate-500 text-sm">Passive proc on hit. Bleed lasts 5 seconds base; ARC extends it.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage/heal per tick = max(4, 0.5 + (<S label="VIT" style={VIT} />/50 + <S label="STR" style={STR} />/50))</p>
                <p>duration = 2.5 + <S label="ARC" style={ARC} />/10 seconds</p>
                <p>proc chance = min(80, lvl×2 + (<S label="LCK" style={LCK} />/100) × (80 − lvl×2)) %</p>
              </>
            }
          />

          <AbilityCard
            title="Eternal Darkness"
            reqLevel={25}
            activation="R"
            flavor="You become untouchable. Not invincible by armor — invincible by will. And they can't even see clearly enough to run."
            description="Right-click and hit a target to trigger invincibility. For the ability's duration, no damage can touch you, and every enemy you strike is blinded for 1 second — stacking disorient as you press your offense. Blood cost decreases as your Intelligence grows."
            scalingDesc={
              <>
                <p>Duration scales with your level and <S label="ARC" style={ARC} /> — higher Arcane extends how long you stay invincible.</p>
                <p>Blood cost decreases with <S label="INT" style={INT} /> — smarter vampires tap into the dark more efficiently.</p>
                <p>Cooldown decreases with <S label="ARC" style={ARC} /> — more Arcane means this comes back faster.</p>
                <p className="text-slate-500 text-sm">Must hit a target to activate. Right-click alone does nothing.</p>
              </>
            }
            scalingFormula={
              <>
                <p>duration = 1 + lvl + <S label="ARC" style={ARC} />/25 seconds</p>
                <p>blood cost = 20 − <S label="INT" style={INT} />/18</p>
                <p>cooldown = 60 − <S label="ARC" style={ARC} />/5 seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Blood Circuit"
            reqLevel={35}
            activation="LFF"
            flavor="A tether of crimson light binds you to your prey. Every pulse of the circuit is another reminder: they cannot escape what you've built."
            description="Left-click → switch items twice to summon an Ender Crystal that forms a blood circuit between you and your target. Every interval, the crystal fires, dealing damage. At level 2 you heal for the same amount it deals. At level 3 it spawns Vex minions every time it fires. The crystal shuts off if your target moves too far from it."
            scalingDesc={
              <>
                <p>Circuit damage scales with your level and <S label="INT" style={INT} /> — higher Intelligence means each pulse hits harder.</p>
                <p>Duration scales with your level and <S label="ARC" style={ARC} /> — Arcane keeps the circuit active longer.</p>
                <p>Cooldown decreases with <S label="ARC" style={ARC} /> — more Arcane means more uptime on this long-cooldown ability.</p>
                <p className="text-slate-500 text-sm">
                  Level 2: heals you equal to damage dealt. Level 3: spawns Vex on each pulse.
                  Crystal deactivates if target is more than 10 blocks from the crystal.
                </p>
              </>
            }
            scalingFormula={
              <>
                <p>pulse damage = max(4, lvl + <S label="INT" style={INT} />/25)</p>
                <p>duration = 5 + lvl × <S label="ARC" style={ARC} />/28 seconds</p>
                <p>blood cost = 25</p>
                <p>cooldown = 160 − <S label="ARC" style={ARC} />/5 seconds</p>
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
              stat: <S label="STR" style={STR} />,
              desc: "Raw melee power. Contributes to your passive blood-scaling damage bonus, Blood Lust frenzy damage, and Bleed healing. Every hit benefits from higher STR.",
            },
            {
              stat: <S label="INT" style={INT} />,
              desc: "Blood economy. Slows your passive blood drain, reduces the cost of Eternal Darkness, boosts Blood Circuit pulse damage, and increases max blood pool. Core for sustainability.",
            },
            {
              stat: <S label="VIT" style={VIT} />,
              desc: "Health and frenzy strength. Grows your health pool and increases Blood Lust's health regen and Bleed's heal-per-tick. Also partially factors into Blood Lust's blood cost.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Uptime and control. Reduces cooldowns on Eternal Darkness and Blood Circuit, extends Blood Circuit duration and Bleed duration, and improves Blood Lust's heal-on-hit. Strong secondary for all builds.",
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
