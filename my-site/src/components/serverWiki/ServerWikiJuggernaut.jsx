import React, { useState } from "react";
import juggernautImg from "../../assets/juggernaut.jpg";

// Stat colors matching SkillsPro config.yml
const STR = { color: "#55FF55" }; // &a green    — Strength
const DEF = { color: "#00AAAA" }; // &3 dark aqua — Defense
const VIT = { color: "#AA0000" }; // &4 dark red  — Vitality
const ARC = { color: "#55FFFF" }; // &b aqua      — Arcane
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
    <article className="rounded-2xl border border-green-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-green-400">{title}</h3>
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
        <div className="mt-5 rounded-xl border border-green-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-green-400/80 hover:text-green-300 transition"
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
                <div className="mt-3 rounded-lg border border-green-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-green-200">
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

export default function ServerWikiJuggernaut({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-green-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-green-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Juggernaut</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-green-800/80">
              Available from Level 3 · Cost: 200
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Juggernaut is a{" "}
              <span className="text-green-400 font-semibold">melee tank and crowd controller</span>{" "}
              — a class built to absorb punishment, wear enemies down, and control close-range
              fights through raw durability rather than burst damage.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Passively block incoming damage, shred armour with every axe swing, build up layers
              of damage resistance, deploy a shield that reflects and knockbacks, and grab enemies
              with your bare hands to carry and hurl them. The Juggernaut doesn't dodge — it
              doesn't need to.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="STR" style={STR} /> &nbsp;·&nbsp; <S label="DEF" style={DEF} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-green-400">Mana</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={juggernautImg}
              alt="Juggernaut"
              className="w-full rounded-2xl border border-green-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Juggernaut.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(10 + (VIT / 2), 60)",
              note: <><S label="VIT" style={VIT} /> grows your health pool from 10 health up to 60 health (30 hearts) before EliteMobs bonus. The Juggernaut's tankiness starts here.</>,
            },
            {
              label: "Max Mana",
              formula: "20 + (INT/20) + (lvl/2)",
              note: <><S label="INT" style={INT} /> and level expand your mana pool. More mana means more Chain Smash and Throw activations before running dry.</>,
            },
            {
              label: "Mana Regen",
              formula: "1 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/80)))",
              note: <><S label="ARC" style={ARC} /> accelerates mana recovery and also reduces the Aegis Protection cooldown — keeping your shield cycling faster.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(36, 3.5 + max(0, lvl-1)·(3.5/99) + MIT·0.18·((lvl-1)/99)^1.65)",
              note: <><S label="MIT" style={MIT} /> (Might) raises your damage ceiling, and Juggernaut uses a deliberately lower cap than other classes to reinforce tank-first gameplay.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-green-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          Most Juggernaut abilities are passive — they trigger automatically through combat
          or are always active. Chain Smash and Throw are the only manual activations.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="They hit you. You barely notice."
            description="The Juggernaut's baseline: a passive damage reduction that activates automatically when struck. Each hit has a chance to proc a shield that reduces that incoming damage. Both the shield strength and the proc chance scale with Defense — meaning the more you invest in DEF, the more reliably and heavily each attack is softened."
            scalingDesc={
              <>
                <p>Shield (damage reduction per proc) scales with <S label="DEF" style={DEF} /> — higher Defense means each block absorbs more.</p>
                <p>Proc chance scales with <S label="DEF" style={DEF} /> and <S label="ARC" style={ARC} /> — both increase how often the passive shield fires, with a minimum floor of 5%.</p>
              </>
            }
            scalingFormula={
              <>
                <p>shield = <S label="DEF" style={DEF} />/10</p>
                <p>proc chance = max(5, min(60, <S label="DEF" style={DEF} />/2 + <S label="ARC" style={ARC} />/20)) %</p>
              </>
            }
          />

          <AbilityCard
            title="Throw"
            reqLevel={1}
            activation="R"
            flavor="You don't fight them. You use them."
            description="Right-click to ready your grip, then hit a target to grab them and hoist them above your head. While carrying, both you and the target cannot attack — but all incoming damage from your captive is reduced. After a few seconds you hurl them in the direction you're looking. When they hit the ground, they take a burst of landing damage. The throw window gives you and your allies time to reposition or line up for follow-up."
            scalingDesc={
              <>
                <p>Landing damage scales with level and <S label="STR" style={STR} /> — Strength determines how hard the impact hits.</p>
                <p>Damage reduction while carrying scales with ability level — higher levels make you much harder to hurt by the target you're holding.</p>
                <p>Carry duration scales with ability level — higher levels give you more time to aim the throw.</p>
                <p className="text-slate-500 text-sm">Mana cost: 10. Cooldown: 15 seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>landing damage = max(0.75, <S label="STR" style={STR} />/45 + lvl×0.9)</p>
                <p>damage reduction while carrying = lvl×10 %</p>
                <p>carry time = lvl×2 seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Heavy Strikes"
            reqLevel={5}
            itemReq="Requires an Axe"
            flavor="Every swing chips something away."
            description="A passive on-attack effect that activates whenever you hit with an axe. Each successful blow deals bonus durability damage to your target's armour — wearing it down faster than normal combat would. Against heavily armoured opponents, this is a long-term attrition tool: the more you swing, the less protection they have."
            scalingDesc={
              <>
                <p>Armour durability damage per hit scales with <S label="STR" style={STR} /> and ability level — more Strength and higher levels strip armour faster.</p>
              </>
            }
            scalingFormula={
              <>
                <p>durability damage = max(1, (<S label="STR" style={STR} />/25) + (lvl/2))</p>
              </>
            }
          />

          <AbilityCard
            title="Stone Skin"
            reqLevel={5}
            flavor="Layer by layer, you become the wall."
            description="A passive multi-level protection suite that stacks new damage immunity as you upgrade it. Level 1 reduces fall damage. Level 2 adds fire and lava damage reduction. Level 3 adds Thorns damage reduction. Each protection scales with your Defense — the higher your DEF, the more each layer reduces. Lower ability levels get 0 reduction on the protections they haven't unlocked yet."
            scalingDesc={
              <>
                <p>Fall reduction (level 1+) scales with <S label="DEF" style={DEF} /> and ability level.</p>
                <p>Fire and lava reduction (level 2+) scales with <S label="DEF" style={DEF} /> and ability level — returns 0 at level 1.</p>
                <p>Thorns reduction (level 3 only) scales with <S label="DEF" style={DEF} /> — returns 0 at levels 1 and 2.</p>
              </>
            }
            scalingFormula={
              <>
                <p>fall reduction = lvl × (<S label="DEF" style={DEF} />/10)</p>
                <p>fire/lava reduction = max(0, lvl × (<S label="DEF" style={DEF} />/30))</p>
                <p>thorns reduction = max(0, lvl−2) × <S label="DEF" style={DEF} />/20</p>
              </>
            }
          />

          <AbilityCard
            title="Aegis Protection"
            reqLevel={10}
            flavor="The shield doesn't just protect. It punishes."
            description="A passive ability that cycles through three escalating effects as you level it. Level 1: a shield periodically refreshes that completely negates the next incoming hit. Level 2: when the shield blocks an attack, it reflects a reduced portion of that blocked hit back at the attacker. Level 3: if your health drops below 5 hearts while the shield is up, it fires a knockback burst at your target. The shield cooldown scales down with Arcane and includes a minimum floor so it cannot become spammable."
            scalingDesc={
              <>
                <p>Cooldown between shield refreshes decreases with ability level and <S label="ARC" style={ARC} /> — Arcane keeps the shield cycling more often.</p>
                <p>Reflect damage (level 2+) scales primarily from blocked incoming damage and reflect percent. This makes it a defensive punish tool, not a damage nuke.</p>
                <p>Knockback velocity on low-health trigger (level 3) scales with <S label="ARC" style={ARC} />. Health threshold for knockback scales with <S label="VIT" style={VIT} />.</p>
              </>
            }
            scalingFormula={
              <>
                <p>shield cooldown = max(8, (lvl×5) − <S label="ARC" style={ARC} />/10) seconds</p>
                <p>reflect % per level = lvl×6 %</p>
                <p>configured reflect bonus scalar = <S label="DEF" style={DEF} />/20 + 0.5</p>
                <p>knockback health threshold = 25 + <S label="VIT" style={VIT} />/5 % of max health</p>
                <p>knockback velocity = 1.5 + <S label="ARC" style={ARC} />/30</p>
              </>
            }
          />

          <AbilityCard
            title="Chain Smash"
            reqLevel={20}
            activation="LR"
            flavor="Everything in range goes up. Then it comes down."
            description="Left Click → Right Click to leap and smash the ground with devastating force. The initial impact launches you and all nearby enemies into the air. When they land, a second shockwave erupts — an explosion that blasts everyone outward. The range of both the initial grab and the final explosion scales with level. Damage on landing scales with Strength."
            scalingDesc={
              <>
                <p>Landing damage scales with <S label="STR" style={STR} /> and ability level — Strength is the primary damage driver.</p>
                <p>Launch radius and explosion radius both scale with ability level — higher levels catch more enemies in both waves.</p>
                <p>Initial upward launch force increases with level (capped). Outward explosion force also increases with level (capped).</p>
                <p className="text-slate-500 text-sm">Mana cost: 17. Cooldown: 15 seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage = max(0.75, (<S label="STR" style={STR} />/35) + (lvl×0.35))</p>
                <p>radius = lvl + 2 blocks</p>
                <p>initial launch = min(2, lvl)</p>
                <p>explosion launch = min(2.5, lvl)</p>
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
              stat: <S label="DEF" style={DEF} />,
              desc: "Defense is the Juggernaut's core stat. It drives the passive shield's strength and proc chance plus every tier of Stone Skin reduction. Stack this first and always.",
            },
            {
              stat: <S label="STR" style={STR} />,
              desc: "Strength raises Chain Smash and Throw damage plus Heavy Strikes armour pressure, but Juggernaut is intentionally tuned for low overall damage output. Treat STR as secondary after survivability.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Arcane reduces the Aegis Protection cooldown so your damage-negating shield comes back faster, boosts mana regen, and raises the passive proc chance alongside DEF. A strong third pick for any build.",
            },
            {
              stat: <S label="VIT" style={VIT} />,
              desc: "Vitality expands your health pool toward the 60-heart cap. More health means more time in the fight — and a higher threshold for Aegis Protection's level 3 knockback trigger.",
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
