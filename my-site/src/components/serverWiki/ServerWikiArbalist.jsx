import React, { useState } from "react";
import arbalistImg from "../../assets/arbalist.png";

// Stat colors matching SkillsPro config.yml
const DEX = { color: "#FFAA00" }; // &6 gold
const LCK = { color: "#FFFF55" }; // &e yellow
const ARC = { color: "#55FFFF" }; // &b aqua
const TCH = { color: "#00AA00" }; // &2 dark green
const VIT = { color: "#AA0000" }; // &4 dark red
const MIT = { color: "#FF5555" }; // &c red

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
            <span className="text-base text-amber-500/70 font-bold select-none">→</span>
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
    <article className="rounded-2xl border border-amber-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-amber-400">{title}</h3>
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
        <div className="mt-5 rounded-xl border border-amber-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-amber-400/80 hover:text-amber-300 transition"
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
                <div className="mt-3 rounded-lg border border-amber-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-amber-200">
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

export default function ServerWikiArbalist({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-amber-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Arbalist</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-amber-800/80">
              Available from Level 3
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Arbalist is a{" "}
              <span className="text-amber-400 font-semibold">precision ranged combatant</span> — a
              master of the bow and crossbow who wins fights before the enemy ever closes the gap.
              Distance is power: the further your target, the harder your arrows hit.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Chain your shots, call skeleton minions to overwhelm outnumbered foes, and detonate
              enemies with explosive arrows. The Arbalist rewards patience, positioning, and keeping
              targets at arm's length — or further.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="LCK" style={LCK} /> &nbsp;·&nbsp; <S label="DEX" style={DEX} /> &nbsp;·&nbsp; <S label="TCH" style={TCH} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-amber-400">Arrows</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={arbalistImg}
              alt="Arbalist"
              className="w-full rounded-2xl border border-amber-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Passive: Distance Scaling ─────────────────────────── */}
      <div className="rounded-3xl border border-amber-900/40 bg-amber-950/20 p-7 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-amber-400">The Range Advantage</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-300">
          The Arbalist's passive makes distance your greatest weapon. The further your target is when
          your arrow lands, the more damage it deals — closing the gap on an Arbalist is the worst
          thing an opponent can do for their health.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          On top of the range bonus, the passive gives a chance to conjure an arrow cloud that fires
          additional projectiles automatically. This chance scales directly with your skill level —
          the more you invest, the more arrows fly.
        </p>
        <div className="mt-4 rounded-xl border border-amber-900/30 bg-slate-950/50 px-5 py-4 text-base text-slate-400 space-y-1">
          <p>Arrow cloud proc chance caps at 60% — both your level and <S label="LCK" style={LCK} /> push it toward that ceiling. Same for flame arrows: level plus Luck determines how often they ignite.</p>
          <p className="text-sm text-slate-500">Tip: <S label="ARC" style={ARC} /> scales your arrow energy regeneration — higher Arcane keeps your arrow pool topped up for sustained fire.</p>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Arbalist.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(20 + (VIT × 0.34), 54)",
              note: <><S label="VIT" style={VIT} /> scales your health pool up to 54 health (27 hearts).</>,
            },
            {
              label: "Max Arrow Energy",
              formula: "20 + (TCH/20) + (lvl/2)",
              note: <><S label="TCH" style={TCH} /> and level both grow your arrow energy pool. More energy means more active ability uses before running dry.</>,
            },
            {
              label: "Arrow Regen",
              formula: "1 + max(lvl, min(125, ARC × max(1, lvl/70)))",
              note: <><S label="ARC" style={ARC} /> is the engine behind your regeneration — at high levels, Arcane multiplies your level to dramatically speed up recovery.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(50, 5 + max(0, lvl-1)·(5/99) + MIT·0.9·((lvl-1)/99)^1.85)",
              note: <><S label="MIT" style={MIT} /> raises your damage cap ceiling as you level, increasing your raw burst potential.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-amber-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          Active abilities require a bow or crossbow to be held. Arrow energy is consumed on use —
          keep your pool managed or you'll lose access mid-fight.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="You don't just shoot arrows. You let the distance do half the work."
            description="Deal bonus damage based on how far your target is when the arrow lands. On top of that, you have a chance to spawn an arrow cloud that automatically fires extra projectiles — and the further you level, the more often it triggers and the more likely those arrows are lit with flame."
            scalingDesc={
              <>
                <p>Arrow cloud proc chance is capped at 60% — both level and <S label="LCK" style={LCK} /> contribute, so stacking Luck pushes you toward the ceiling faster.</p>
                <p>Flame arrow chance also scales with level and <S label="LCK" style={LCK} />, capped at 100%. High Luck means nearly every cloud arrow is on fire at max level.</p>
                <p>The number of arrows the cloud fires scales with <S label="TCH" style={TCH} /> — more Tech means more projectiles per volley, up to 12.</p>
              </>
            }
            scalingFormula={
              <>
                <p>cloud chance = min(60, lvl + <S label="LCK" style={LCK} />/10) %</p>
                <p>flame chance = min(100, lvl + <S label="LCK" style={LCK} />/5) %</p>
                <p>cloud arrow count = min(12, 6 + floor(<S label="TCH" style={TCH} />/20))</p>
              </>
            }
          />

          <AbilityCard
            title="Fire Crossbow"
            reqLevel={1}
            activation="L"
            flavor="No arrow loaded? Doesn't matter. You punch the air and fire anyway."
            description="Left-click with a bow or crossbow to fire a powerful arrow that costs arrow energy instead of actual arrows. It deals bonus damage, has a range modifier, applies knockback, and has chances to land a critical hit or explode on impact. At higher levels it can shotgun — firing multiple arrows in a spread."
            scalingDesc={
              <>
                <p>Damage scales with your level and <S label="DEX" style={DEX} /> — both stats feed the raw power of each bolt.</p>
                <p>Range (and visual particle trail) scales with level and <S label="ARC" style={ARC} /> — more Arcane pushes the arrow further and faster.</p>
                <p>Knockback scales with level and <S label="DEX" style={DEX} /> — keep targets pinned at range.</p>
                <p>Critical hit chance scales with level and <S label="LCK" style={LCK} /> — more Luck means more crits.</p>
                <p>Explosion chance scales with level and <S label="LCK" style={LCK} /> — at level 2+ there's a meaningful chance the arrow detonates.</p>
                <p>Shotgun fires 3–(1 + lvl×3 + floor(<S label="TCH" style={TCH} />/10)) arrows in a spread. Chance scales with level and <S label="LCK" style={LCK} />. <S label="TCH" style={TCH} /> raises the maximum arrow count of each shotgun burst.</p>
                <p className="text-slate-500 text-sm">Energy cost decreases with <S label="ARC" style={ARC} />. Cooldown: 5 seconds. Requires bow or crossbow.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage = lvl×2 + <S label="DEX" style={DEX} />/10</p>
                <p>range = lvl × max(2, <S label="ARC" style={ARC} />/25)</p>
                <p>knockback = lvl + <S label="DEX" style={DEX} />/20</p>
                <p>crit chance = lvl×30 + <S label="LCK" style={LCK} />/20 %</p>
                <p>explosion chance = max(0, (lvl−1)×25 + <S label="LCK" style={LCK} />/2) %</p>
                <p>fire = lvl×50 ticks</p>
                <p>energy cost = lvl + 5 − <S label="ARC" style={ARC} />/35</p>
                <p>shotgun chance = min(85, (lvl−1)×20 + <S label="LCK" style={LCK} />/5) %</p>
                <p>shotgun arrows: 3 to min(20, 1+(lvl×3)+floor(<S label="TCH" style={TCH} />/10))</p>
              </>
            }
          />

          <AbilityCard
            title="Dual Arrows"
            reqLevel={5}
            flavor="One arrow wasn't enough. Two is just getting started."
            description="Every bow shot has a chance to fire a second arrow automatically. The second arrow deals bonus damage scaled by your Dexterity and level. At level 2 it gains higher velocity, and at level 3 it becomes a flame arrow — setting your target on fire without any extra input."
            scalingDesc={
              <>
                <p>Proc chance scales with level and <S label="LCK" style={LCK} /> — both push the trigger rate, capped at 100%.</p>
                <p>Second arrow bonus damage scales with <S label="DEX" style={DEX} /> and level — both reward investing in Dexterity.</p>
                <p className="text-slate-500 text-sm">Level 2: second arrow flies faster. Level 3: second arrow is a flame arrow.</p>
              </>
            }
            scalingFormula={
              <>
                <p>proc chance = min(90, lvl×25 + <S label="LCK" style={LCK} />/4) %</p>
                <p>bonus damage = (<S label="DEX" style={DEX} />/20) × lvl</p>
                <p>fire = (lvl−1) × 50 ticks (level 3+)</p>
              </>
            }
          />

          <AbilityCard
            title="Execute"
            reqLevel={10}
            flavor="Hit them once, they're warned. Hit them twice, they're finished."
            description="After hitting the same target twice in a row with arrows, you have a chance to trigger a devastating combo finisher. Each level unlocks a new combo effect: fire, then poison, then lightning. The more consecutive shots you land, the higher the chance — but miss once, or switch targets, and your combo resets."
            scalingDesc={
              <>
                <p>Combo trigger chance scales with <S label="LCK" style={LCK} /> and level — both push your odds of landing the finisher.</p>
                <p>Fire duration scales with level — higher levels burn for longer.</p>
                <p className="text-slate-500 text-sm">Level 1: fire. Level 2: adds poison. Level 3: adds lightning strike. Combo resets on miss or target switch.</p>
              </>
            }
            scalingFormula={
              <>
                <p>trigger chance = <S label="LCK" style={LCK} /> + (lvl × 10) %</p>
                <p>fire duration = (lvl − 1) × 50 ticks</p>
              </>
            }
          />

          <AbilityCard
            title="Minions Arrow"
            reqLevel={20}
            activation="RS"
            flavor="You don't need to win alone. You never did."
            description="Right Click → Sneak while holding a bow to summon skeleton archers that fight alongside you for a duration. They come equipped with enchanted bows, speed and strength buffs, and resistance. At level 2 they gain invisibility, and at level 3 they become Pillagers with flame arrows."
            scalingDesc={
              <>
                <p>Minion count scales with level and <S label="TCH" style={TCH} /> — Tech directly adds extra skeletons on top of the level-based count.</p>
                <p>Duration scales with level — higher levels keep your minions fighting for longer.</p>
                <p>Minion bows gain Arrow Damage and Flame enchantments that scale with level. Arrow Damage is randomized — <S label="LCK" style={LCK} /> raises the ceiling of that roll, so higher Luck means your skeletons can hit harder.</p>
                <p className="text-slate-500 text-sm">Level 2: minions gain invisibility and better bows. Level 3: Pillagers with flame arrows instead of skeletons. Requires bow or crossbow. Cooldown reduced by <S label="ARC" style={ARC} />.</p>
              </>
            }
            scalingFormula={
              <>
                <p>minion count = lvl + 1 + floor(<S label="TCH" style={TCH} />/25)</p>
                <p>duration = lvl × 30 seconds</p>
                <p>arrow damage enchant = randInt(lvl, max(lvl, floor(lvl × (1 + <S label="LCK" style={LCK} />×0.14))))</p>
                <p>flame enchant = lvl  |  energy cost = 20</p>
                <p>cooldown = max(1, 20 − <S label="ARC" style={ARC} />/5) seconds</p>
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
              stat: <S label="DEX" style={DEX} />,
              desc: "Core offensive stat. Boosts Fire Crossbow damage, Dual Arrow bonus damage, and Fire Crossbow knockback. Stack this for raw ranged power.",
            },
            {
              stat: <S label="LCK" style={LCK} />,
              desc: "Determines your proc ceiling. Raises Execute trigger chance, Fire Crossbow critical rate, and explosion chance. More Luck means more big moments.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Sustain and range. Boosts arrow energy regen dramatically at high levels, increases Fire Crossbow range, and reduces its energy cost. Strong secondary for aggressive builds.",
            },
            {
              stat: <S label="TCH" style={TCH} />,
              desc: "Scales your maximum arrow energy pool, increases the arrow count of both the passive cloud and Fire Crossbow shotgun bursts, and adds extra minions per summon. A strong all-around secondary that amplifies almost every part of your kit.",
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
