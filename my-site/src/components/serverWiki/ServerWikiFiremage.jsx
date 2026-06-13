import React, { useState } from "react";
import firemageImg from "../../assets/firemage.jpg";

// Stat colors matching SkillsPro config.yml
const INT = { color: "#5555FF" }; // &9 blue      — Intelligence
const VIT = { color: "#AA0000" }; // &4 dark red  — Vitality
const ARC = { color: "#55FFFF" }; // &b aqua      — Arcane
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
            <span className="text-base text-orange-500/70 font-bold select-none">→</span>
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
    <article className="rounded-2xl border border-orange-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-orange-400">{title}</h3>
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
        <div className="mt-5 rounded-xl border border-orange-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-orange-400/80 hover:text-orange-300 transition"
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
                <div className="mt-3 rounded-lg border border-orange-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-orange-200">
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

export default function ServerWikiFiremage({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-orange-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Fire Mage</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-orange-800/80">
              Available from Level 3 · Cost: 200
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Fire Mage is an{" "}
              <span className="text-orange-400 font-semibold">aggressive caster and fire specialist</span>{" "}
              — a class that turns flame from a hazard into a weapon, thrives while burning,
              and overwhelms enemies with cascading fire damage from multiple angles at once.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Fire is your element and your fuel. The passive makes you immune to fire damage
              and heals you while burning. Absorb Energy retaliates against attackers with
              fire. Black Fire amplifies all fire damage dealt to nearby targets. Inferno
              converts the target's existing fire ticks into a burst hit. Meteorite rains
              fireballs down on a location. And Phoenix Essence unleashes a multi-stage
              spectacle — slash, volcano, and lightning — at the cost of your health bar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="INT" style={INT} /> &nbsp;·&nbsp; <S label="VIT" style={VIT} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-orange-400">Health</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={firemageImg}
              alt="Fire Mage"
              className="w-full rounded-2xl border border-orange-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Energy Note ─────────────────────────────────────── */}
      <div className="rounded-3xl border border-orange-900/40 bg-slate-900/60 p-7 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-orange-400">Health as Energy</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-400 max-w-3xl">
          Unlike most classes that use mana, the Fire Mage's abilities cost <span className="text-orange-300 font-semibold">health</span>.
          Every activation draws directly from your health pool. The passive fire immunity and
          heal-while-burning mechanic help offset this cost — staying on fire while in combat
          keeps you topped up between casts. High <S label="VIT" style={VIT} /> not only widens
          your health pool but also expands your energy bar, giving you more room for ability activations.
        </p>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Firemage.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(20 + (VIT × 0.56), 76)",
              note: <><S label="VIT" style={VIT} /> grows your health pool up to 76 health (38 hearts). Since health is also your energy resource, a larger pool means more ability casts before you're in danger.</>,
            },
            {
              label: "Max Energy (Health)",
              formula: "20 + (VIT/20) + (lvl/2)",
              note: <>Unlike most classes, this uses <S label="VIT" style={VIT} /> (not INT) to scale the energy pool. More Vitality means more room to spend health on abilities.</>,
            },
            {
              label: "Energy (Health) Regen",
              formula: "1 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/60)))",
              note: <><S label="ARC" style={ARC} /> accelerates health-energy recovery and reduces most ability cooldowns — a strong supporting stat even though it isn't a primary.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(48, 5 + max(0, lvl-1)·(5/99) + MIT·0.78·((lvl-1)/99)^1.82)",
              note: <><S label="MIT" style={MIT} /> (Might) raises your overall damage ceiling as you level, amplifying every fire hit, burst, and fireball at the top end.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-orange-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          The Fire Mage's toolkit layers fire debuffs — amplify incoming fire damage with Black Fire,
          then cash it in with Inferno or Meteorite. Phoenix Essence is the signature big cooldown.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="Fire doesn't hurt you. It feeds you."
            description="The Fire Mage is permanently immune to fire damage — lava, flames, and fire ticks deal zero damage. On top of that, whenever you receive any healing while on fire, you gain bonus healing on top of the base amount. This creates a powerful feedback loop: stand in fire, stay on fire, and every heal you receive is amplified."
            scalingDesc={
              <>
                <p>Bonus healing per heal event scales with <S label="VIT" style={VIT} /> — higher Vitality amplifies how much extra health you recover each time healing triggers while on fire.</p>
              </>
            }
            scalingFormula={
              <>
                <p>bonus heal per event = <S label="VIT" style={VIT} />/20</p>
              </>
            }
          />

          <AbilityCard
            title="Absorb Energy"
            reqLevel={5}
            flavor="Hit me. I dare you."
            description="A passive counter-attack that triggers when you take damage. When it procs, your next attack against that target will set them on fire for several seconds. The chance scales with both level and Vitality — the tankier you build, the more reliably you retaliate with fire. The fire duration scales with ability level."
            scalingDesc={
              <>
                <p>Proc chance scales with ability level and <S label="VIT" style={VIT} /> — Vitality raises how often incoming hits arm your counter-fire.</p>
                <p>Fire duration on retaliation scales with ability level — higher levels set targets ablaze for longer.</p>
              </>
            }
            scalingFormula={
              <>
                <p>proc chance = lvl + <S label="VIT" style={VIT} />/10 %</p>
                <p>fire duration = lvl×5 seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Black Fire"
            reqLevel={5}
            flavor="Everything near you burns harder."
            description="A passive area-of-effect aura that amplifies fire damage dealt to enemies within 5 blocks of you. Any target inside the radius takes increased fire damage — stacking on top of whatever is already burning them. This synergises directly with Inferno, Absorb Energy, Meteorite, and Phoenix Essence: apply fire, then stand close to multiply the damage."
            scalingDesc={
              <>
                <p>Fire damage amplification scales with ability level and <S label="INT" style={INT} /> — Intelligence determines how much extra fire damage nearby targets receive per tick.</p>
              </>
            }
            scalingFormula={
              <>
                <p>fire damage bonus = lvl + <S label="INT" style={INT} />/20</p>
                <p>radius: fixed 5 blocks</p>
              </>
            }
          />

          <AbilityCard
            title="Inferno"
            reqLevel={1}
            activation="R"
            flavor="Every fire tick they have becomes a hammer."
            description="Right Click to ready your strike, then hit a target with your staff to activate. Immediately deals a burst of damage — the base hit scales with level and Intelligence. But the real punch comes from the bonus: the ability also deals 1 additional damage for every 10 fire ticks the target currently has. The more on fire they already are, the harder Inferno hits. Activating Inferno also increases your own fire ticks, keeping the passive heal loop running."
            scalingDesc={
              <>
                <p>Base burst damage scales with ability level and <S label="INT" style={INT} /> — Intelligence is the primary damage driver.</p>
                <p>Bonus damage scales with the target's current fire ticks — stack Black Fire and Absorb Energy first for maximum payoff.</p>
                <p>AoE range scales with ability level — higher levels hit targets further out from the impact point.</p>
                <p className="text-slate-500 text-sm">Health cost: 6. Cooldown: 6 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>base damage = lvl×2 + <S label="INT" style={INT} />/20</p>
                <p>bonus damage = 1 per 10 fire ticks on target</p>
                <p>range = (lvl×2) − 1 blocks</p>
                <p>cooldown = 6 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Meteorite"
            reqLevel={20}
            activation="LR"
            flavor="The sky is not safe either."
            description="Left Click → Right Click to call down a volley of fireballs at the targeted location. Each fireball lands and detonates, dealing area damage to all enemies within range of the impact point. More ability levels means more fireballs in the volley and a larger blast radius per impact. Intelligence scales the damage per explosion. Arcane reduces the cooldown so you can call strikes more often."
            scalingDesc={
              <>
                <p>Number of fireballs scales with ability level — more levels means a denser, more destructive barrage.</p>
                <p>Explosion damage scales with ability level and <S label="INT" style={INT} /> — Intelligence amplifies each fireball's impact.</p>
                <p>Blast radius per fireball scales with ability level — higher levels catch more enemies in each detonation.</p>
                <p>Explosion yield (crater size) scales with ability level — higher levels create a larger blast area.</p>
                <p className="text-slate-500 text-sm">Health cost: 20. Cooldown: 10 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>fireballs = lvl×2</p>
                <p>damage per fireball = lvl + <S label="INT" style={INT} />/5</p>
                <p>blast radius = lvl×2 blocks</p>
                <p>explosion yield = 0.5 + (lvl/3)</p>
                <p>cooldown = 10 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Phoenix Essence"
            reqLevel={5}
            activation="LLR"
            itemReq="Requires Sword, Axe, or Hoe"
            flavor="You don't cast a spell. You become the phoenix."
            description="Left Click → Left Click → Right Click to unleash a multi-stage ultimate. After activation, a massive flaming ball erupts that blasts enemies backwards and summons a high-speed undead warhorse. The ability then unlocks three escalating sub-abilities based on your level, usable while the effect is active:"
            scalingDesc={
              <>
                <p><span className="text-orange-300 font-semibold">Level 1 — Slash:</span> Left Click to slash forward, dealing damage in a line in front of you. Slash damage is capped by <S label="INT" style={INT} />.</p>
                <p><span className="text-orange-300 font-semibold">Level 2 — Volcano:</span> Summons small eruptions in front of you that launch enemies into the air and set them on fire. Volcano damage is capped by <S label="VIT" style={VIT} />. Each eruption triggers a cooldown before the next can fire.</p>
                <p><span className="text-orange-300 font-semibold">Level 3 — Lightning:</span> Lightning strikes all nearby enemies within the lightning radius automatically.</p>
                <p>All sub-ability cooldowns scale down with <S label="ARC" style={ARC} /> — Arcane makes the entire sequence faster.</p>
                <p className="text-slate-500 text-sm">Health cost: 20. Overall cooldown: 60 × (1.15 − ARC×0.006) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>slash damage = min(<S label="INT" style={INT} /> + 2, 15)</p>
                <p>volcano damage = min(<S label="VIT" style={VIT} /> + 2, 20)</p>
                <p>initial blast damage = 5 + lvl</p>
                <p>slash cooldown = max(1, 4−lvl) × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
                <p>volcano cooldown = max(1, 10−lvl) × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
                <p>overall cooldown = 60 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
                <p>lightning radius = 5 blocks · slash range = 10 · volcano range = 20</p>
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
              stat: <S label="INT" style={INT} />,
              desc: "Intelligence directly raises Black Fire's amplification, Inferno's base damage, Meteorite's explosion damage, and Phoenix Essence's slash cap. It's the primary damage stat — stack it for harder hits across every ability.",
            },
            {
              stat: <S label="VIT" style={VIT} />,
              desc: "Vitality expands your health pool and — uniquely for this class — also scales your energy bar. More VIT means more health for ability casts, faster Absorb Energy procs, and higher Phoenix Essence volcano damage. An unusually high-value stat for a caster.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Arcane reduces the cooldown on every active ability in the kit — Inferno, Meteorite, and especially Phoenix Essence's 60-second global cooldown. A strong third pick for players who want to cycle abilities faster.",
            },
            {
              stat: <S label="MIT" style={MIT} />,
              desc: "Might raises the overall damage cap as you level, increasing the ceiling on every fire hit. Worth considering at higher levels when you're already well-invested in INT and VIT.",
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
