import React, { useState } from "react";
import eidolonImg from "../../assets/eidolon.png";

// Stat colors matching SkillsPro config.yml
const REL = { color: "#FFFFFF" }; // &f white
const DEF = { color: "#00AAAA" }; // &3 dark aqua
const ARC = { color: "#55FFFF" }; // &b aqua
const INT = { color: "#5555FF" }; // &9 blue
const LCK = { color: "#FFFF55" }; // &e yellow
const VIT = { color: "#AA0000" }; // &4 dark red
const MIT = { color: "#FF5555" }; // &c red

function S({ label, style }) {
  return <span className="font-bold" style={style}>{label}</span>;
}

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
            <span className="text-base text-violet-500/70 font-bold select-none">→</span>
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
    <article className="rounded-2xl border border-violet-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-violet-400">{title}</h3>
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
          </div>
        )}
      </div>

      <p className="mt-4 text-lg italic text-slate-300 leading-relaxed">{flavor}</p>
      <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>

      {scalingDesc && (
        <div className="mt-5 rounded-xl border border-violet-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400/80 hover:text-violet-300 transition"
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
                <div className="mt-3 rounded-lg border border-violet-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-violet-200">
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

export default function ServerWikiEidolon({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-violet-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-violet-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Eidolon</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-violet-800/80">
              Available from Level 3 · Cost: 500
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Eidolon is a{" "}
              <span className="text-violet-400 font-semibold">spectral dualist</span> — a class
              defined by the constant tension between two states of being. Light and dark are not
              just flavour; they change how every ability plays, what it costs, and what it does.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Drain enemies with scaling health-based damage, shield yourself in light, unleash
              stored punishment in dark, conjure a line of arcane fangs, or rip open a blackhole
              that pulls everything nearby to its center. The Eidolon rewards players who track
              their form and plan around it.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="REL" style={REL} /> &nbsp;·&nbsp; <S label="DEF" style={DEF} /> &nbsp;·&nbsp; <S label="LCK" style={LCK} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-violet-400">Imbalance</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={eidolonImg}
              alt="Eidolon"
              className="w-full rounded-2xl border border-violet-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Light & Dark Forms ───────────────────────────────── */}
      <div className="rounded-3xl border border-violet-900/40 bg-violet-950/20 p-7 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-violet-400">Light &amp; Dark Forms</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-300">
          Imbalance is the Eidolon's energy resource — but it works differently from mana or blood.
          Rather than spending it on demand, Imbalance accumulates passively over time and through
          attacking. When it reaches 100, your form flips automatically: light becomes dark, dark
          becomes light.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Every form shift restores a chunk of health — so the cycle of switching is also your
          primary sustain mechanic. Nearly every Eidolon ability has a different effect depending on
          which form you're currently in, so understanding the rhythm of your shifts is as important
          as the abilities themselves.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-900/40 bg-slate-950/50 px-5 py-4">
            <p className="text-base font-bold text-sky-300">Light Form</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400 list-disc list-inside">
              <li>Spirit Fire absorbs incoming damage and stores it</li>
              <li>Spectre gives you a refreshing speed-burst shield</li>
              <li>Ambient light level reduces damage taken (Shape Shifter)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-600/40 bg-slate-950/50 px-5 py-4">
            <p className="text-base font-bold text-slate-300">Dark Form</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400 list-disc list-inside">
              <li>Spirit Fire releases stored damage on your next attack</li>
              <li>Spectre charges your next attack for bonus damage</li>
              <li>Ambient darkness increases damage dealt (Shape Shifter)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-violet-900/30 bg-slate-950/50 px-5 py-3 text-sm text-slate-500">
          <p>Heal on form switch: <S label="REL" style={REL} />/10 + 1. High Religion amplifies how much you recover every time the meter flips.</p>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Eidolon.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(20 + (VIT × 0.36), 56)",
              note: <><S label="VIT" style={VIT} /> grows your health pool up to 56 health (28 hearts).</>,
            },
            {
              label: "Max Imbalance",
              formula: "(50 + INT + LCK) × (1 + prestige/10)",
              note: <><S label="INT" style={INT} /> and <S label="LCK" style={LCK} /> build your pool directly. The effective range is 50 × (1 + prestige/10) up to (50 + INT + LCK) × (1 + prestige/10).</>,
            },
            {
              label: "Imbalance Regen",
              formula: "minRegen = 0.5 × (1 + prestige/10), cap = 25 × (1 + prestige/10), maxRoll = min(cap, max(minRegen, 0.125 × ARC × (1 + LCK/100) × (1 + prestige/10))), regen = minRegen + roll × (maxRoll − minRegen)",
              note: <><S label="LCK" style={LCK} /> widens the random pool and raises the reachable top-end with <S label="ARC" style={ARC} />. At prestige 0, regen is bounded by 0.5 to 25; at prestige 10, it is bounded by 1.0 to 50.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(49, 5 + max(0, lvl-1)·(5/99) + MIT·0.84·((lvl-1)/99)^1.84)",
              note: <><S label="MIT" style={MIT} /> raises your damage ceiling as you level, increasing raw burst potential.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-violet-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          Most Eidolon abilities are passive — they activate automatically based on your current
          form, your actions, or your environment. Only Defile, Fangs, and Blackhole require manual
          activation inputs.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="Two sides of the same spirit. Neither lasts forever."
            description="Imbalance fills automatically over time and through combat. When it reaches 100, your form shifts — light becomes dark, dark becomes light — and you restore a burst of health. This cycle is the heartbeat of the Eidolon: every form-sensitive ability changes behaviour on each flip, and the heal-on-switch is your core sustain."
            scalingDesc={
              <>
                <p>Health restored on form switch scales with <S label="REL" style={REL} /> — investing in Religion makes every shift recover more.</p>
                <p>Imbalance regeneration is random. <S label="LCK" style={LCK} /> increases how wide that regen range can be.</p>
              </>
            }
            scalingFormula={
              <>
                <p>heal on switch = <S label="REL" style={REL} />/10 + 1</p>
              </>
            }
          />

          <AbilityCard
            title="Defile"
            reqLevel={1}
            activation="QL"
            flavor="You don't just hurt them. You make them easier to hurt."
            description="Drop your held item, then land a melee hit to charge and apply Defile to your target. While active, the target takes more damage from all sources and deals less damage back to you — a double-edged curse that swings the fight in your favour for its duration. Costs a small amount of Imbalance to activate."
            scalingDesc={
              <>
                <p>Incoming damage reduction (shield) scales with level and <S label="DEF" style={DEF} /> — more Defense means the debuff protects you more aggressively.</p>
                <p>Damage amplification applied to the target scales with level and <S label="REL" style={REL} />.</p>
                <p>Duration scales with level. Cooldown decreases with <S label="ARC" style={ARC} />.</p>
                <p className="text-slate-500 text-sm">Imbalance cost: 3. Cooldown: max(3, 50 − ARC/4) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>shield (damage reduction on you) = lvl×8 + <S label="DEF" style={DEF} />/8 + 5 %</p>
                <p>damage amp on target = lvl×1.25 + <S label="REL" style={REL} />/10</p>
                <p>duration = lvl×2.5 seconds</p>
                <p>cooldown = max(3, 50 − <S label="ARC" style={ARC} />/4) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Purify"
            reqLevel={3}
            flavor="Your strike doesn't just damage. It judges."
            description="A passive on-attack effect that deals bonus damage proportional to your target's remaining health — the healthier they are, the harder Purify hits. Damage is capped by your defensive investment. Each attack also charges your Imbalance meter with a random amount."
            scalingDesc={
              <>
                <p>Base damage per 7 health your target has scales with level and <S label="REL" style={REL} /> — Religion raises how much you punish healthy targets.</p>
                <p>Maximum damage cap scales with <S label="DEF" style={DEF} /> and <S label="MIT" style={MIT} />.</p>
                <p>Imbalance gained per attack is random. <S label="REL" style={REL} /> sets the baseline and <S label="LCK" style={LCK} /> pushes the top-end roll higher.</p>
                <p className="text-slate-500 text-sm">Imbalance cost per hit: your current level.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage per 7hp = <S label="REL" style={REL} />/20 + lvl</p>
                <p>max damage = (<S label="DEF" style={DEF} /> + <S label="MIT" style={MIT} />) / 4</p>
                <p>imbalance gained = max(<S label="REL" style={REL} />/40, 1.5) + (roll × ((max(<S label="REL" style={REL} />/20, 2.0) + <S label="LCK" style={LCK} />/20) − max(<S label="REL" style={REL} />/40, 1.5)) × (<S label="LCK" style={LCK} />/100))</p>
              </>
            }
          />

          <AbilityCard
            title="Spirit Fire"
            reqLevel={5}
            flavor="In the light, you hold the blow. In the dark, you return it."
            description="A passive dual-state ability that transforms between defence and offence based on your current form. In light form, a percentage of all incoming damage is absorbed and stored rather than taken — you build up a reservoir. When you shift to dark form, that stored energy erupts out of your first attack, divided by a release divisor that shrinks as you invest in level and Religion."
            scalingDesc={
              <>
                <p>Light form absorption percent scales with level and <S label="REL" style={REL} />, capped by a ceiling that grows with <S label="DEF" style={DEF} />. Higher REL pushes the absorption rate; higher DEF raises the cap.</p>
                <p>Total damage that can be absorbed before the reservoir is full scales with level and <S label="DEF" style={DEF} />.</p>
                <p>Dark form release uses a divisor: stored damage is divided by it on release. The divisor shrinks with level and <S label="REL" style={REL} /> — at max investment the divisor floors at 1, releasing the full absorbed amount.</p>
              </>
            }
            scalingFormula={
              <>
                <p>absorb % = min(<S label="REL" style={REL} />/7 + lvl×3, 25 + <S label="DEF" style={DEF} />/3)</p>
                <p>max absorption = lvl×5 + <S label="DEF" style={DEF} />/15</p>
                <p>dark release divisor = max(1, 6 − lvl − <S label="REL" style={REL} />/100)</p>
                <p className="text-slate-500 text-sm">released damage = absorbed / divisor</p>
              </>
            }
          />

          <AbilityCard
            title="Spectre"
            reqLevel={5}
            flavor="Unbroken in the light. Unmatched in the dark."
            description="Another passive that changes entirely with your form. In light form, you carry a shield that — when it breaks from an incoming hit — bursts you with a speed boost and then silently regenerates on a timer. In dark form, the same timer instead charges your attacks: when the cooldown expires, your next strike deals a significant percentage of bonus damage."
            scalingDesc={
              <>
                <p>Speed boost on shield-break scales with <S label="REL" style={REL} /> — more Religion means faster movement when an enemy cracks through your ward.</p>
                <p>Dark form bonus damage scales with level and <S label="DEF" style={DEF} /> — Defense is your offensive stat in this state.</p>
                <p>The charge/refresh cooldown decreases with level and <S label="ARC" style={ARC} /> — Arcane accelerates how often you get shield refreshes and charged attacks.</p>
              </>
            }
            scalingFormula={
              <>
                <p>speed boost = <S label="REL" style={REL} />/30 (for 3 seconds when shield breaks)</p>
                <p>dark charged damage bonus = (<S label="DEF" style={DEF} />/5) + (lvl×3) %</p>
                <p>cooldown = max(2, 45 − (lvl × max(3, <S label="ARC" style={ARC} />/20))) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Shape Shifter"
            reqLevel={10}
            flavor="Darkness sharpens you. Light shields you."
            description="A fully passive ability that ties your power to your physical environment — specifically the light level of the block you're standing on (0 to 15). In dark form, standing in shadow makes your attacks hit harder; the darker the location, the more damage you deal. In light form, ambient brightness reduces the damage you take; the brighter the location, the more protected you are."
            scalingDesc={
              <>
                <p>Both effects scale linearly with the light level of your current block — moving between bright and dark areas actively changes your combat profile.</p>
                <p className="text-slate-500 text-sm">Light level 0 = pitch black, 15 = full daylight or well-lit interior. Caves, interiors, and night all shift your environment in the dark direction.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage / shield scale = light level (0–15) + 2</p>
              </>
            }
          />

          <AbilityCard
            title="Fangs"
            reqLevel={30}
            activation="LLR"
            flavor="An evoker's gift — turned against everything living."
            description="Left Click → Left Click → Right Click to summon evoker fangs. Used normally, they erupt in a straight line ahead of you — a lance of arcane teeth that punish targets in a corridor. Sneak while activating to switch to a radial burst, spawning fangs around you instead to hit surrounding enemies. Damage and fang count scale from Religion, and each cast rolls randomly."
            scalingDesc={
              <>
                <p>Base fang damage scales with <S label="REL" style={REL} />, then gets a random additive bonus.</p>
                <p>Fang count scales with level and <S label="REL" style={REL} />, then gets the same style of random multiplier.</p>
                <p><S label="LCK" style={LCK} /> controls variance: at 0 luck there is no variance, and at max luck the top-end bonus is much larger.</p>
                <p className="text-slate-500 text-sm">Imbalance cost: 5. Cooldown: max(1.5, 5 − ARC/20) seconds. Sneak during activation for radial mode.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage = min(75, (8 + 0.17×<S label="REL" style={REL} />) + (roll × (25 × (<S label="LCK" style={LCK} />/100) × (1 + prestige/10))))</p>
                <p>fang count = (lvl × max(3, <S label="REL" style={REL} />/25)) × random(1, 1 + (0.3 × min(1, <S label="LCK" style={LCK} />/100)))</p>
              </>
            }
          />

          <AbilityCard
            title="Blackhole"
            reqLevel={50}
            activation="LFF"
            flavor="Everything falls in. Nothing comes back the same."
            description="Left-click → switch items twice to tear open a blackhole at your location. It pulls all nearby enemies toward its center continuously, dealing damage every few ticks to anything caught in its gravity well. The closer something gets, the more damage it takes. When the blackhole finally collapses, it detonates in an explosion. Wardens and Allays are immune to the pull."
            scalingDesc={
              <>
                <p>Pull range scales with level and <S label="REL" style={REL} /> — more Religion extends how far the gravity reaches.</p>
                <p>Duration scales with level and <S label="DEF" style={DEF} /> — Defense keeps the blackhole open longer.</p>
                <p>Explosion power on collapse scales with <S label="DEF" style={DEF} />.</p>
                <p>Damage-start distance (how close enemies need to be to take tick damage) scales with <S label="DEF" style={DEF} /> — higher DEF means you can reach and damage targets further from center.</p>
                <p>Pull gravity strength scales with level. Tick damage scales with <S label="REL" style={REL} />.</p>
                <p className="text-slate-500 text-sm">Damage ticks every 10 ticks (0.5s). Imbalance cost: 1. Cooldown: max(5, 22 − ARC/12) seconds. Applies Nausea to targets caught inside.</p>
              </>
            }
            scalingFormula={
              <>
                <p>tick damage = (<S label="REL" style={REL} />/10) × 0.3</p>
                <p>duration = (lvl×4)×10 + <S label="DEF" style={DEF} />/10 ticks</p>
                <p>pull range = 3 + lvl + <S label="REL" style={REL} />/25</p>
                <p>explosion yield = 10 + <S label="DEF" style={DEF} />/60</p>
                <p>gravity = 0.1 × lvl</p>
                <p>damage start distance = 3 + <S label="DEF" style={DEF} />/50</p>
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
              stat: <S label="REL" style={REL} />,
              desc: "The core stat of the Eidolon. Raises form-switch healing, Purify damage, Spirit Fire release multiplier, Spectre speed, Fangs damage and count, and Blackhole tick damage and pull range. Stack this above everything else.",
            },
            {
              stat: <S label="DEF" style={DEF} />,
              desc: "Defense is your staying power and your dark-form damage. Scales Defile's damage reduction, Purify's damage cap, Spirit Fire's absorption ceiling and max reservoir, Spectre's charged attack bonus, Blackhole duration and explosion. A strong co-primary with REL.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Reduces Defile, Spectre, Blackhole, and Fangs cooldowns. ARC is the universal cooldown stat on Eidolon and also contributes to Imbalance regen top-end.",
            },
            {
              stat: <S label="INT" style={INT} />,
              desc: "Primary stat for maximum Imbalance. INT directly increases your pool and scales multiplicatively with prestige.",
            },
            {
              stat: <S label="LCK" style={LCK} />,
              desc: "Adds directly to max Imbalance, widens Imbalance regen variance, and pushes higher top-end Purify and Fangs rolls.",
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
