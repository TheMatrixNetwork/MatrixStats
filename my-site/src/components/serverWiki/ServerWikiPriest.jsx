import React, { useState } from "react";
import priestImg from "../../assets/priest.png";

// Stat colors matching SkillsPro config.yml
const REL = { color: "#FFFFFF" }; // &f white   — Religion
const MIT = { color: "#FF5555" }; // &c red     — Might
const INT = { color: "#5555FF" }; // &9 blue    — Intelligence
const VIT = { color: "#AA0000" }; // &4 dark red — Vitality
const ARC = { color: "#55FFFF" }; // &b aqua    — Arcane

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
            <span className="text-base text-yellow-500/70 font-bold select-none">→</span>
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
    <article className="rounded-2xl border border-yellow-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-yellow-400">{title}</h3>
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
        <div className="mt-5 rounded-xl border border-yellow-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-yellow-400/80 hover:text-yellow-300 transition"
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
                <div className="mt-3 rounded-lg border border-yellow-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-yellow-200">
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

export default function ServerWikiPriest({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-yellow-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-yellow-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Priest</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-yellow-800/80">
              Available from Level 3 · Cost: 200
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Priest is the server's{" "}
              <span className="text-yellow-400 font-semibold">dedicated support and healer</span> —
              a class built around sustaining teammates, buffing allies, and controlling space
              with holy and natural power.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Walk on water, resist fire, pacify hostile mobs, and shield your party from harm.
              In combat, the Priest buffs teammates with resistances and regeneration, summons fox
              and bee armies, and deploys a barrier that walls enemies into a zone of pain. A
              natural leader — and a nightmare to fight against in enclosed spaces.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="REL" style={REL} /> &nbsp;·&nbsp; <S label="MIT" style={MIT} /> &nbsp;·&nbsp; <S label="INT" style={INT} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-yellow-400">Mana</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={priestImg}
              alt="Priest"
              className="w-full rounded-2xl border border-yellow-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Holy Grace ───────────────────────────────────────── */}
      <div className="rounded-3xl border border-yellow-900/40 bg-yellow-950/10 p-7 shadow-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-yellow-400">Holy Grace</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-300">
          The Priest carries passive blessings that set them apart from every other class the
          moment they log in. They walk on water — literally — and their body automatically
          rejects lava damage, making traversal and survival fundamentally different from other
          classes.
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          These aren't upgrades you unlock. They're always on, from level 3 forward.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-yellow-900/40 bg-slate-950/50 px-5 py-4">
            <p className="text-base font-bold text-yellow-300">Blessings</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400 list-disc list-inside">
              <li>Walk on water — no swimming required</li>
              <li>Body passively rejects lava damage</li>
              <li>Passive mob pacification at higher levels (Purification)</li>
              <li>Emergency invincibility when near death (Seal of Life)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-900/40 bg-slate-950/50 px-5 py-4">
            <p className="text-base font-bold text-red-400">Dimensional Weakness</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400 list-disc list-inside">
              <li>In the Nether: inflicted with Confusion periodically</li>
              <li>In the End: inflicted with Blindness periodically</li>
              <li>Both effects diminish as your level rises — but never fully vanish at low levels</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-yellow-900/30 bg-slate-950/50 px-5 py-3 text-sm text-slate-500">
          <p>Debuff duration in hostile dimensions: max(100 − level, 0) seconds per tick at a 300-second interval. Reach level 100 and the debuff disappears entirely.</p>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Priest.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(10 + (VIT × 0.3), 40)",
              note: <><S label="VIT" style={VIT} /> grows your health pool from 10 health up to 40 health (20 hearts).</>,
            },
            {
              label: "Max Mana",
              formula: "20 + (INT/20) + (lvl/2)",
              note: <><S label="INT" style={INT} /> and level both increase your mana pool — more mana means more heals and summons before running dry.</>,
            },
            {
              label: "Mana Regen",
              formula: "1 + 0.04 × max(lvl, min(125, ARC × max(1, lvl/74)))",
              note: <><S label="ARC" style={ARC} /> scales your regeneration rate and also reduces cooldowns on most abilities. Essential for sustained healing output.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(57.5, 6 + max(0, lvl-1)·(6/99) + MIT·1.05·((lvl-1)/99)^1.9)",
              note: <><S label="MIT" style={MIT} /> raises your damage ceiling as you level. The Priest deals through minions and area control, but MIT makes their direct hits land harder when needed.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-yellow-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          The Priest blends passive blessings, targeted heals, mob pacification, summons, and
          area-denial. Several abilities require a hoe as the active item — keep one in your
          hotbar.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="The blessing carries you over water and away from flame."
            description="Always-on holy grace: the Priest walks across water as if it were solid ground and their body passively rejects lava. No activation, no cooldown — it simply is. In exchange, the Nether and the End resist the Priest's presence: periodically inflicting Confusion (Nether) or Blindness (End) while you remain there. This debuff weakens as your level rises."
            scalingDesc={
              <>
                <p>Dimensional debuff duration shrinks as your level grows — at level 100 it reaches 0 and the penalty disappears entirely.</p>
              </>
            }
            scalingFormula={
              <>
                <p>debuff duration = max(100 − level, 0) seconds (every 300s)</p>
              </>
            }
          />

          <AbilityCard
            title="Kindling of Life"
            reqLevel={1}
            activation="R"
            flavor="A spark of warmth, pressed into another's hands."
            description="Right-click to release a healing pulse outward, restoring health to nearby teammates. Sneak while right-clicking to turn the heal inward and restore your own health instead. Scales cleanly with level and Vitality — the more you invest in survivability, the stronger each heal becomes. Low cooldown makes this your primary healing tool in sustained fights."
            scalingDesc={
              <>
                <p>Heal amount scales with level and <S label="VIT" style={VIT} /> — Vitality directly improves the healing you deliver to yourself and allies.</p>
                <p className="text-slate-500 text-sm">Mana cost: 10. Cooldown: 5 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>heal = (lvl + <S label="VIT" style={VIT} />/10) × 2</p>
                <p>cooldown = 5 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Mind Possession"
            reqLevel={5}
            flavor="They stop. They blink. They forget what they were doing."
            description="A passive on-attack effect. Each hit you land has a percentage chance to paralyze the target with Slowness and Blindness — locking them in place and cutting their vision. The chance and the duration of the paralysis both grow with level, making high-level Priests progressively more disorienting to fight in melee."
            scalingDesc={
              <>
                <p>Paralysis chance scales with ability level — at level 3 (max) you have a 30% chance to trigger on each hit. Each level adds another 10%.</p>
              </>
            }
            scalingFormula={
              <>
                <p>chance = ability lvl × 10 % (max 30% at level 3)</p>
              </>
            }
          />

          <AbilityCard
            title="Seal of Life"
            reqLevel={5}
            flavor="When the end seems near — it isn't."
            description="A passive survival trigger. When your health drops to a critical threshold, the Seal activates automatically: you become invincible for a short window, gaining Regeneration and Speed to escape, reposition, or keep fighting. The invincibility period is a lifeline, not a permanent state — use it to buy space. The Seal recharges over time, with Arcane reducing how long you wait between uses."
            scalingDesc={
              <>
                <p>Regeneration duration scales with level. Speed duration scales with level.</p>
                <p>Recharge interval decreases with level and <S label="ARC" style={ARC} /> — investing in Arcane lets the Seal come back faster.</p>
                <p className="text-slate-500 text-sm">Triggers at 10 health (5 hearts). Applies Regen and Speed on activation.</p>
              </>
            }
            scalingFormula={
              <>
                <p>regen duration = 5 × lvl seconds</p>
                <p>speed duration = 10 × lvl seconds</p>
                <p>recharge = max(1, 60 × (10 − lvl)) × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Purification"
            reqLevel={5}
            flavor="Holy ground. They know to stay away."
            description="A passive multi-level blessing that progressively pacifies hostile mobs around you. At level 1, Guardians, Spiders, and Slimes stop targeting you naturally. At level 2, Elder Guardians, Endermen, and Phantoms are added to the list. If you attack pacified mobs, they will still retaliate. Level 3 adds a bonus: crops around you grow faster."
            scalingDesc={
              <>
                <p>At level 3, crop growth radius scales with <S label="REL" style={REL} /> and <S label="MIT" style={MIT} /> — higher values widen the accelerated area.</p>
              </>
            }
            scalingFormula={
              <>
                <p>crop radius = min(5 + <S label="REL" style={REL} />/4, 15 + <S label="MIT" style={MIT} />/10) blocks</p>
              </>
            }
          />

          <AbilityCard
            title="Asclepius"
            reqLevel={20}
            activation="LR"
            itemReq="Requires a Hoe"
            flavor="A healer's gift before the storm."
            description="Left Click → Right Click while holding a hoe to radiate a pulse of restorative energy. All party members and faction allies within range receive a stack of Night Vision, Damage Resistance, Regeneration, and Absorption — four overlapping buffs that make your team dramatically harder to kill. Range and heal power scale with level. Cooldown decreases with Arcane."
            scalingDesc={
              <>
                <p>Heal amount applied scales with level — higher levels recover more health as the pulse lands.</p>
                <p>Range scales with level, making it easier to cover spread-out teammates at higher levels.</p>
                <p>Effect durations also scale with level — the higher you are, the longer Night Vision, Resistance, Regen, and Absorption last.</p>
                <p className="text-slate-500 text-sm">Only affects party members or faction allies. Mana cost: 20. Cooldown: 30 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>range = (lvl × 2) + 4 blocks</p>
                <p>heal = lvl × 5</p>
                <p>Night Vision, Resistance, Absorption = lvl × 30 seconds</p>
                <p>Regeneration = lvl × 20 seconds</p>
                <p>cooldown = 30 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Nature's Call"
            reqLevel={20}
            activation="LSR"
            itemReq="Requires a Hoe"
            flavor="They answer. They always answer."
            description="Left Click → Sneak → Right Click while holding a hoe to summon a pack of foxes that fight alongside you. The number of foxes grows with your level and Religion — more Religion means a larger pack. Each fox carries Speed and Strength buffs for the duration of their service. They stay in the fight for a time that scales with your level before dispersing."
            scalingDesc={
              <>
                <p>Fox count scales with level and <S label="REL" style={REL} /> — Religion is the primary driver of your pack size.</p>
                <p>Duration scales with level — higher-level Priests keep their foxes in the fight longer.</p>
                <p className="text-slate-500 text-sm">Each fox has fixed 20 damage. Foxes receive Speed and Strength. Mana cost: 20. Cooldown: 20 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>fox count = lvl + 1 + <S label="REL" style={REL} />/20</p>
                <p>duration = lvl × 30 seconds</p>
                <p>cooldown = 20 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Barrier"
            reqLevel={20}
            activation="LSS"
            itemReq="Requires a Golden Hoe"
            flavor="Nothing enters. Nothing leaves unharmed."
            description="Left Click → Sneak → Sneak while holding a golden hoe to deploy a holy barrier sphere around you. Enemies that try to enter or remain inside are knocked back, poisoned, and weakened — their damage is reduced and they take continuous hits. Allies inside the barrier gain Speed and Strength, turning the enclosed area into a fortress. Especially devastating in tight corridors or chokepoints where enemies can't escape the constant knockback loop."
            scalingDesc={
              <>
                <p>Radius scales with level — higher levels create a wider barrier that covers more space.</p>
                <p>Damage dealt to enemies inside scales with level and <S label="MIT" style={MIT} /> — Might directly increases how hard the barrier punishes intruders.</p>
                <p>Knockback force scales with level — enemies are pushed back harder at higher levels.</p>
                <p>Duration scales with level. Cooldown decreases with <S label="ARC" style={ARC} />.</p>
                <p className="text-slate-500 text-sm">Enemy debuffs: Poison + Weakness (30s). Ally buffs: Speed + Strength (30s). Mana cost: 20. Cooldown: 40 − ARC/5 seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>radius = 3 + lvl blocks</p>
                <p>damage per tick = (<S label="MIT" style={MIT} />/2) × lvl</p>
                <p>knockback = lvl × 2</p>
                <p>duration = lvl × 30 seconds</p>
                <p>cooldown = 40 − <S label="ARC" style={ARC} />/5 seconds</p>
              </>
            }
          />

          <AbilityCard
            title="Nature's Force"
            reqLevel={45}
            activation="LLR"
            flavor="From the hive. For as long as you need."
            description="Left Click → Left Click → Right Click to plant a beehive that continuously spawns bees to fight for you. Bees emerge at a rate that decreases as your level rises — at low levels there are pauses between spawns, at high levels they stream out nearly continuously. Each bee carries damage that scales with level and Intelligence. The swarm lasts for a duration scaling with level and Might. If someone destroys the beehive, the spawning stops."
            scalingDesc={
              <>
                <p>Bee damage scales with level and <S label="INT" style={INT} /> — Intelligence raises how hard each bee hits.</p>
                <p>Spawn interval decreases with level and <S label="ARC" style={ARC} /> — higher Arcane means more bees per minute.</p>
                <p>Duration scales with level and <S label="MIT" style={MIT} /> — Might keeps the hive active longer.</p>
                <p className="text-slate-500 text-sm">Mana cost: 1. Cooldown: 17 × (1.15 − ARC/250) seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>bee damage = (lvl × 2) + <S label="INT" style={INT} />/20</p>
                <p>spawn interval = max(1, 10 − (lvl × 2)) × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
                <p>duration = (lvl × 6) + <S label="MIT" style={MIT} />/10 seconds</p>
                <p>cooldown = 17 × (1.15 − <S label="ARC" style={ARC} />/250) seconds</p>
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
              desc: "Religion scales Kindling of Life's heal (via Vitality synergy), the Purification crop radius, and Nature's Call fox count. Invest here to maximise your pack size and healing output.",
            },
            {
              stat: <S label="ARC" style={ARC} />,
              desc: "Arcane reduces the cooldown on nearly every Priest ability — Kindling, Asclepius, Nature's Call, Barrier, and Nature's Force all shorten with ARC. High Arcane also increases mana regen. Critical for a Priest who wants to cast frequently.",
            },
            {
              stat: <S label="MIT" style={MIT} />,
              desc: "Might raises barrier tick damage, extends Nature's Force duration, and pushes your overall damage cap. A Priest who wants to deal damage through the Barrier and bee swarm should prioritise this alongside REL.",
            },
            {
              stat: <S label="INT" style={INT} />,
              desc: "Intelligence grows your mana pool and increases bee damage from Nature's Force. Secondary to REL and ARC, but valuable if you want sustained high-level casting without running dry.",
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
