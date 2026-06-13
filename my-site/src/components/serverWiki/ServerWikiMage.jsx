import React, { useState } from "react";
import mageImg from "../../assets/mage.jpg";

// Stat colors matching SkillsPro config.yml
const INT = { color: "#5555FF" }; // &9 blue      — Intelligence
const ARC = { color: "#55FFFF" }; // &b aqua      — Arcane
const VIT = { color: "#AA0000" }; // &4 dark red  — Vitality
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
            <span className="text-base text-sky-500/70 font-bold select-none">→</span>
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
    <article className="rounded-2xl border border-sky-900/30 bg-slate-900/70 p-7 shadow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold text-sky-400">{title}</h3>
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
        <div className="mt-5 rounded-xl border border-sky-900/30 bg-slate-950/60 px-5 py-4 space-y-2">
          <div className="text-base text-slate-300 space-y-1.5 leading-relaxed">
            {scalingDesc}
          </div>

          {scalingFormula && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-sky-400/80 hover:text-sky-300 transition"
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
                <div className="mt-3 rounded-lg border border-sky-900/30 bg-slate-900/80 px-4 py-3 space-y-1.5 font-mono text-sm text-sky-200">
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

export default function ServerWikiMage({ onNavigate }) {
  return (
    <section className="fade-in space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-sky-900/40 bg-slate-900/70 p-8 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate("/server-wiki")}
          className="text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-200 transition"
        >
          ← Server Wiki
        </button>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-500/80">Class Codex</p>
            <h1 className="mt-2 text-5xl font-bold text-slate-100 lg:text-7xl">Mage</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-sky-800/80">
              Available from Level 3 · Cost: 200
            </p>

            <p className="mt-6 text-xl leading-relaxed text-slate-300 max-w-2xl">
              The Mage is a{" "}
              <span className="text-sky-400 font-semibold">versatile arcane spellcaster</span>{" "}
              — a staff-wielding class that sustains itself through mana-on-hit, punishes attackers
              with reflect, shreds groups with energy bolts, and ends fights by freezing time itself.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400 max-w-2xl">
              The Mage rewards patient positioning and combo timing. Reflect and Explosion Spell
              make your staff dangerous to attack into. Energy Flux fires rapid bolts down a line
              for sustained poke. Heal Spell keeps you alive when your health drops low. Neptune
              turns tridents into a tool for lightning strikes and projectile storms. And
              Chronoprohiberis — the Mage's signature ultimate — stops time for all nearby
              enemies, letting you act freely while they stand frozen.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Primary Stats</p>
                <p className="mt-1 text-lg font-semibold">
                  <S label="ARC" style={ARC} /> &nbsp;·&nbsp; <S label="INT" style={INT} />
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Energy Type</p>
                <p className="mt-1 text-lg font-semibold text-sky-400">Mana</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3">
                <p className="text-sm uppercase tracking-widest text-slate-500">Required Level</p>
                <p className="mt-1 text-lg font-semibold text-slate-200">3</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 lg:w-80 xl:w-96">
            <img
              src={mageImg}
              alt="Mage"
              className="w-full rounded-2xl border border-sky-900/50 shadow-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Class Scaling ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Class Scaling</h2>
        <p className="mt-2 text-base text-slate-400">Core stat formulas pulled directly from Mage.yml.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Max Health",
              formula: "min(16 + (VIT × 0.28), 44)",
              note: <><S label="VIT" style={VIT} /> grows your health pool up to 44 health (22 hearts). The Mage has a smaller health cap than tankier classes — positioning and Heal Spell matter.</>,
            },
            {
              label: "Max Mana",
              formula: "20 + (INT/20) + (lvl/2)",
              note: <><S label="INT" style={INT} /> expands your mana pool. More max mana means a larger buffer before Chronoprohiberis drains it entirely.</>,
            },
            {
              label: "Mana Regen",
              formula: "0.9 + (0.04 × max(lvl, min(125, ARC × max(1, lvl/60))))",
              note: <><S label="ARC" style={ARC} /> is the primary mana regen driver and also reduces cooldowns across the kit. It's a high-value stat for sustain.</>,
            },
            {
              label: "Damage Cap",
              formula: "min(54, 5.5 + max(0, lvl-1)·(5.5/99) + MIT·0.95·((lvl-1)/99)^1.87)",
              note: <><S label="MIT" style={MIT} /> (Might) raises your overall damage ceiling as you level, amplifying every spell hit at the top end.</>,
            },
          ].map(({ label, formula, note }) => (
            <div key={label} className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-widest text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-sky-300 break-all">{formula}</p>
              <p className="mt-2 text-base text-slate-400">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Abilities ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <h2 className="text-3xl font-bold text-slate-100">Abilities</h2>
        <p className="mt-2 text-base text-slate-400">
          Seven abilities covering passive sustain, reactive defense, ranged poke, self-healing,
          trident mastery, and the time-stopping Chronoprohiberis ultimate.
        </p>

        <div className="mt-6 space-y-4">

          <AbilityCard
            title="Passive"
            reqLevel={0}
            flavor="Your staff feeds your mind with every swing."
            description="The Mage's passive makes staff combat self-sustaining. Every hit you land with a hoe (staff) restores a portion of your mana — Intelligence scales how much you recover per strike. Your hoe attacks also deal bonus physical damage that scales with the material of the hoe, ranging from 2 extra damage for a wooden hoe up to 7 for a netherite hoe."
            scalingDesc={
              <>
                <p>Mana restored per hit scales with <S label="INT" style={INT} /> — the more Intelligence you have, the more each staff strike tops up your mana pool.</p>
                <p>Bonus staff damage is fixed by hoe material — Netherite (7) &gt; Diamond (6) &gt; Golden (5) &gt; Iron (4) &gt; Stone (3) &gt; Wooden (2).</p>
              </>
            }
            scalingFormula={
              <>
                <p>mana per hit = <S label="INT" style={INT} />/10</p>
                <p>bonus damage by material: Netherite 7, Diamond 6, Golden 5, Iron 4, Stone 3, Wooden 2</p>
              </>
            }
          />

          <AbilityCard
            title="Reflect"
            reqLevel={5}
            flavor="Attack a Mage, receive it back."
            description="A passive counter-effect that activates whenever you are attacked while holding a staff. It has a percentage chance — scaling with ability level — to reflect damage back at the attacker. The reflected damage amount also scales with ability level. Higher-quality staves improve the proc chance. This ability is entirely passive — just equip your staff and it works automatically."
            scalingDesc={
              <>
                <p>Proc chance scales with ability level — more levels means reflect fires more often.</p>
                <p>Reflected damage scales with ability level — higher levels return more damage to attackers.</p>
              </>
            }
            scalingFormula={
              <>
                <p>reflect chance = lvl×10 %</p>
                <p>reflected damage = lvl</p>
              </>
            }
          />

          <AbilityCard
            title="Explosion Spell"
            reqLevel={10}
            flavor="Sometimes a hit just detonates."
            description="A passive proc that triggers when you attack while holding a staff. On activation it deals a percentage bonus to your damage — turning a normal staff hit into a much larger burst. The chance to proc scales with the material of your hoe, and the bonus damage itself scales with both Arcane and Intelligence. Like Reflect, this is entirely passive."
            scalingDesc={
              <>
                <p>Proc chance scales with hoe material — Netherite (60%) &gt; Diamond (50%) &gt; Golden (40%) &gt; Iron (30%) &gt; Stone (20%) &gt; Wooden (10%).</p>
                <p>Bonus damage scales with both <S label="ARC" style={ARC} /> and <S label="INT" style={INT} /> — both primary stats contribute.</p>
              </>
            }
            scalingFormula={
              <>
                <p>bonus damage = max(10, <S label="ARC" style={ARC} />/10 + <S label="INT" style={INT} />/10) %</p>
                <p>proc chance by material: Netherite 60%, Diamond 50%, Golden 40%, Iron 30%, Stone 20%, Wooden 10%</p>
              </>
            }
          />

          <AbilityCard
            title="Heal Spell"
            reqLevel={20}
            flavor="Mana flows inward when you need it most."
            description="A passive healing effect that triggers automatically when your health falls below a threshold. Once it procs, it grants bonus health regeneration on top of your normal natural regen or satiation heal. The health threshold scales with ability level — higher levels trigger healing at a higher percentage of your max health. The bonus healing scales with your current mana — the fuller your mana bar, the more health you recover."
            scalingDesc={
              <>
                <p>Healing threshold scales with ability level — higher levels activate Heal Spell at a higher percentage of your max health.</p>
                <p>Bonus health recovery per event scales with your current mana — keeping your mana pool topped up makes each proc heal more.</p>
              </>
            }
            scalingFormula={
              <>
                <p>health threshold = lvl×10 % of max health</p>
                <p>bonus heal = (current mana / 10) × lvl</p>
              </>
            }
          />

          <AbilityCard
            title="Energy Flux"
            reqLevel={1}
            activation="R"
            itemReq="Requires any Hoe"
            flavor="Pull the trigger and hold the line."
            description="Right Click while holding a hoe to activate. The Mage rapidly fires a stream of energy bolts in a straight line ahead of them, each bolt dealing damage to the first target it hits. More levels increase the range of the beam — at level 3, bolts can even pass through blocks. This is the Mage's primary sustained damage tool: a reliable, low-cost poke ability that rewards holding a good angle on the target."
            scalingDesc={
              <>
                <p>Bolt damage scales with ability level and <S label="INT" style={INT} /> — Intelligence is the main damage driver.</p>
                <p>Beam range scales with ability level and <S label="ARC" style={ARC} /> — Arcane extends how far your bolts travel.</p>
                <p>Level 3 unlocks pass-through-blocks, letting bolts travel through terrain.</p>
                <p className="text-slate-500 text-sm">Mana cost: 3. Cooldown: 6 seconds.</p>
              </>
            }
            scalingFormula={
              <>
                <p>damage per bolt = 1 + lvl + <S label="INT" style={INT} />/30</p>
                <p>beam range = lvl × <S label="ARC" style={ARC} />/10 + 4 blocks</p>
              </>
            }
          />

          <AbilityCard
            title="Neptune"
            reqLevel={20}
            flavor="Water and sky answer the trident's call."
            description="A trident-empowerment ability that unlocks three tiers of trident synergy as it levels up. Each level adds a new effect on top of the previous ones — Neptune is a passive upgrade to trident combat that scales significantly with both Intelligence and Arcane."
            scalingDesc={
              <>
                <p><span className="text-sky-300 font-semibold">Level 1:</span> Trident attacks deal bonus damage per hit. Each successful trident strike also has a percentage chance to call a lightning bolt down on the target. Damage bonus and lightning chance both scale with <S label="INT" style={INT} />.</p>
                <p><span className="text-sky-300 font-semibold">Level 2:</span> Trident hits gain a chance to spawn multiple duplicate tridents that home in on the target simultaneously. The multiply count and proc chance both scale with <S label="ARC" style={ARC} />.</p>
                <p><span className="text-sky-300 font-semibold">Level 3:</span> While holding your trident in your offhand and sneaking, you can launch yourself through the air with Right Click. Release sneak after releasing right-click to sustain flight. This is the Mage's mobility tool — effectively a trident-powered glide.</p>
              </>
            }
            scalingFormula={
              <>
                <p>bonus trident damage = lvl + <S label="INT" style={INT} />/35</p>
                <p>lightning chance = lvl × (<S label="INT" style={INT} />/2 + 5) %</p>
                <p>multiply trident count = min(5, (STR + 6) / 4)</p>
                <p>multiply chance = lvl × (<S label="ARC" style={ARC} />/2 + 5) %</p>
              </>
            }
          />

          <AbilityCard
            title="Chronoprohiberis"
            reqLevel={12}
            activation="LR"
            itemReq="Requires Clock in hand"
            flavor="Time stops. Only you keep moving."
            description="Left Click → Right Click while holding a clock to activate. Drains your entire mana bar instantly and stops time for all nearby enemies — applying Slowness, Nausea, and Blindness to every target in range. While enemies are frozen, you can reposition, land free hits, or set up another ability with no risk of retaliation. The duration and detection range of the time stop both scale with Arcane and Intelligence. Enemies take a small amount of damage on activation. A high cooldown ability that rewards planning — use it to open a fight or to escape a dangerous situation."
            scalingDesc={
              <>
                <p>Time stop duration scales with <S label="ARC" style={ARC} /> and ability level — Arcane is the primary driver for how long enemies stay frozen.</p>
                <p>Detection range scales with <S label="INT" style={INT} /> and ability level — Intelligence determines how large an area is affected.</p>
                <p>Mana cost: entire mana bar. Cooldown scales down with <S label="ARC" style={ARC} /> — higher Arcane reduces the wait between casts.</p>
              </>
            }
            scalingFormula={
              <>
                <p>freeze duration = <S label="ARC" style={ARC} />/30 + lvl seconds</p>
                <p>detection range = 5 + <S label="INT" style={INT} />/20 blocks</p>
                <p>activation damage = 3</p>
                <p>mana cost = full mana bar</p>
                <p>cooldown = 60 − <S label="ARC" style={ARC} />/10 seconds</p>
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
              desc: "Arcane is the single most impactful stat for the Mage. It drives mana regen, reduces the Chronoprohiberis cooldown, extends Energy Flux range, scales the time stop duration, boosts Explosion Spell damage, and raises Neptune multiply chance. Max this first.",
            },
            {
              stat: <S label="INT" style={INT} />,
              desc: "Intelligence expands your max mana pool, fuels the passive mana-on-hit, scales Energy Flux bolt damage, Heal Spell recovery, Neptune damage and lightning chance, Explosion Spell bonus, and extends the Chronoprohiberis range. A close second to Arcane.",
            },
            {
              stat: <S label="VIT" style={VIT} />,
              desc: "Vitality grows your health pool. The Mage has a lower health cap than most classes — a moderate VIT investment buys survivability that lets you position safely for Energy Flux and Chronoprohiberis setups.",
            },
            {
              stat: <S label="MIT" style={MIT} />,
              desc: "Might raises the overall damage cap as you level. Worth considering once your ARC and INT are well-invested — it amplifies the ceiling on Explosion Spell procs and Energy Flux bolt damage.",
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
