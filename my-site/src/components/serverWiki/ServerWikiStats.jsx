import React, { useState } from "react";

// Stat color system (canonical SkillsPro colors)
const STAT_COLORS = {
  STR: "#55FF55",
  DEX: "#FFAA00",
  ARC: "#55FFFF",
  VIT: "#AA0000",
  INT: "#5555FF",
  MIT: "#FF5555",
  DEF: "#00AAAA",
  LCK: "#FFFF55",
  TCH: "#00AA00",
  REL: "#FFFFFF",
};

function S({ stat, children }) {
  return <span style={{ color: STAT_COLORS[stat], fontWeight: 700 }}>{children ?? stat}</span>;
}

function FormulaAccordion({ formulas }) {
  const [open, setOpen] = useState(false);
  if (!formulas || formulas.length === 0) return null;
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
      >
        <span
          className="inline-block text-xs transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▶
        </span>
        {open ? "Hide formulas" : "Show formulas"}
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {formulas.map((f, i) => (
            <div key={i}>
              <p className="text-sm text-slate-500 mb-1">{f.label}</p>
              <code className="block rounded-lg bg-slate-950/50 px-4 py-2 font-mono text-base text-slate-300">
                {f.formula}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClassBadge({ name, color }) {
  return (
    <span
      className="inline-block rounded-full border px-3 py-1 text-sm font-semibold whitespace-nowrap"
      style={{ borderColor: color + "66", color: color }}
    >
      {name}
    </span>
  );
}

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

const STATS = [
  {
    id: "STR",
    name: "Strength",
    max: 100,
    globalEffects: [
      "Increases critical hit damage. Each point of STR adds to your crit damage multiplier.",
    ],
    notes: "Strength is the primary offensive stat for melee fighters. Critical damage scales directly and linearly with STR.",
    formulas: [{ label: "Critical Damage Bonus", formula: "STR / 3" }],
    usedBy: [
      { class: "Swordsman", detail: "Primary stat · melee damage" },
      { class: "Vampire",   detail: "Primary stat · lifesteal & passive damage" },
      { class: "Juggernaut",detail: "Primary stat · cleave, throw & chain smash" },
      { class: "Mage",      detail: "Secondary · Neptune ability scaling" },
    ],
  },
  {
    id: "DEX",
    name: "Dexterity",
    max: 100,
    globalEffects: [
      "No server-wide passive effect configured. DEX is used directly by class abilities.",
    ],
    notes: "Dexterity governs precision and speed. It is the backbone of the Arbalist and Swordsman playstyles.",
    formulas: [],
    usedBy: [
      { class: "Arbalist",  detail: "Primary stat · arrow count, quiver & headshot scaling" },
      { class: "Swordsman", detail: "Primary stat · flurry & parry chance" },
      { class: "Devourer",  detail: "Primary stat · passive proc chance & ability damage" },
    ],
  },
  {
    id: "VIT",
    name: "Vitality",
    max: 100,
    globalEffects: [
      "Directly raises your maximum health. All classes use VIT in their health formula. Health cap varies by class (40-76 health, or 20-38 hearts).",
    ],
    notes: "Vitality is the universal health stat. Every class pools health from VIT. Every 2 health equals 1 heart, so class caps map directly to hearts. Class scaling is tuned so VIT stays valuable deep into progression and approaches each class cap near max VIT. Firemage is unique in that VIT also powers its energy bar.",
    formulas: [
      { label: "Max Health (class-specific)", formula: "min(class_base + VIT×class_scale, class_cap)" },
      { label: "Firemage Max Energy (unique)", formula: "20 + VIT/20 + lvl/2" },
    ],
    usedBy: [
      { class: "Swordsman",  detail: "Max health" },
      { class: "Vampire",    detail: "Max health · lifesteal scaling" },
      { class: "Arbalist",   detail: "Max health" },
      { class: "Eidolon",    detail: "Max health" },
      { class: "Priest",     detail: "Max health" },
      { class: "Juggernaut", detail: "Max health · passive heal on kill" },
      { class: "Devourer",   detail: "Max health" },
      { class: "Firemage",   detail: "Max health & max energy bar" },
      { class: "Mage",       detail: "Max health" },
    ],
  },
  {
    id: "INT",
    name: "Intelligence",
    max: 100,
    globalEffects: [
      "Raises maximum energy (mana/resource bar) for most classes. The exact formula varies slightly per class.",
    ],
    notes: "Intelligence controls energy capacity for the majority of classes. It also feeds ability damage and effects for caster classes.",
    formulas: [
      { label: "Max Energy (most classes)", formula: "20 + INT/20 + lvl/2" },
      { label: "Swordsman Max Energy", formula: "15 + INT/15 + lvl/4" },
    ],
    usedBy: [
      { class: "Swordsman",  detail: "Max energy driver" },
      { class: "Vampire",    detail: "Primary stat · max energy & ability damage" },
      { class: "Eidolon",    detail: "Max energy driver" },
      { class: "Priest",     detail: "Max energy driver · ability damage" },
      { class: "Juggernaut", detail: "Max energy driver" },
      { class: "Devourer",   detail: "Max energy driver" },
      { class: "Mage",       detail: "Primary stat · ability damage & range" },
      { class: "Firemage",   detail: "Primary stat · ability damage" },
    ],
  },
  {
    id: "ARC",
    name: "Arcane",
    max: 100,
    globalEffects: [
      "Governs energy regeneration speed for every class. Higher ARC means your energy bar refills faster, shortening effective cooldowns on active abilities. Coefficient and divisor differ per class.",
    ],
    notes: "Arcane is the universal regen stat. Its coefficient and divisor differ per class, but every class benefits from investing ARC.",
    formulas: [
      { label: "Arbalist Energy Regen", formula: "1 + max(lvl, min(125, ARC × max(1, lvl/70)))" },
      { label: "Firemage Energy Regen", formula: "1 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/60)))" },
      { label: "Mage / Devourer / Juggernaut", formula: "1 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/80)))" },
      { label: "Swordsman Energy Regen", formula: "0.5 + 0.05 × max(lvl, min(125, ARC × max(1, lvl/80)))" },
    ],
    usedBy: [
      { class: "Swordsman",  detail: "Energy regen · cooldown reduction" },
      { class: "Arbalist",   detail: "Energy regen · cooldown reduction (fastest base coefficient)" },
      { class: "Eidolon",    detail: "Energy regen · cooldown reduction" },
      { class: "Priest",     detail: "Energy regen · cooldown reduction" },
      { class: "Juggernaut", detail: "Energy regen · cooldown reduction · passive shield proc support" },
      { class: "Devourer", detail: "Energy regen · cooldown reduction · passive damage/duration and hook range support" },
      { class: "Firemage",   detail: "Energy regen · cooldown reduction (strongest ARC scaling)" },
      { class: "Mage",       detail: "Energy regen · cooldown reduction · ability range" },
    ],
  },
  {
    id: "MIT",
    name: "Might",
    max: 100,
    globalEffects: [
      "Scales your damage cap — the maximum single-hit damage percentage you can deal. At low levels MIT adds very little, but at high levels heavy MIT investment raises your ceiling significantly.",
    ],
    notes: "Might (MIT) is used by every class for damage-cap scaling, but each class has a tuned ceiling and scaling curve. Juggernaut has the lowest cap profile, Priest and Devourer have the highest, Mage sits in the high-cap tier, and Vampire is tuned lower.",
    formulas: [
      { label: "Priest Damage Cap", formula: "min(57.5, 6 + max(0, lvl−1)×(6/99) + MIT×1.05×((lvl−1)/99)^1.9)" },
      { label: "Devourer Damage Cap", formula: "min(56, 6 + max(0, lvl−1)×(6/99) + MIT×1.0×((lvl−1)/99)^1.88)" },
      { label: "Arbalist Damage Cap", formula: "min(50, 5 + max(0, lvl−1)×(5/99) + MIT×0.9×((lvl−1)/99)^1.85)" },
      { label: "Vampire Damage Cap", formula: "min(47.5, 4.8 + max(0, lvl−1)×(4.8/99) + MIT×0.74×((lvl−1)/99)^1.8)" },
      { label: "Eidolon Damage Cap", formula: "min(49, 5 + max(0, lvl−1)×(5/99) + MIT×0.84×((lvl−1)/99)^1.84)" },
      { label: "Firemage Damage Cap", formula: "min(48, 5 + max(0, lvl−1)×(5/99) + MIT×0.78×((lvl−1)/99)^1.82)" },
      { label: "Swordsman Damage Cap", formula: "min(50.5, 5 + max(0, lvl−1)×(5/99) + MIT×0.86×((lvl−1)/99)^1.84)" },
      { label: "Mage Damage Cap", formula: "min(54, 5.5 + max(0, lvl−1)×(5.5/99) + MIT×0.95×((lvl−1)/99)^1.87)" },
      { label: "Juggernaut Damage Cap", formula: "min(36, 3.5 + max(0, lvl−1)×(3.5/99) + MIT×0.18×((lvl−1)/99)^1.65)" },
    ],
    usedBy: [
      { class: "Swordsman",  detail: "Damage cap scaling" },
      { class: "Vampire",    detail: "Damage cap scaling" },
      { class: "Arbalist",   detail: "Damage cap scaling" },
      { class: "Eidolon",    detail: "Damage cap scaling" },
      { class: "Priest",     detail: "Damage cap scaling · ability area & duration" },
      { class: "Juggernaut", detail: "Damage cap scaling" },
      { class: "Devourer",   detail: "Damage cap scaling" },
      { class: "Firemage",   detail: "Damage cap scaling" },
      { class: "Mage",       detail: "Damage cap scaling" },
    ],
  },
  {
    id: "DEF",
    name: "Defense",
    max: 100,
    globalEffects: [
      "Passively reduces incoming damage for every class with diminishing returns — your global defense rating equals min(3.5, sqrt(DEF) / 2.5).",
      "Also used directly by class abilities: the Swordsman's pierce mechanic compares attacker vs. target DEF.",
    ],
    notes: "Defense has both a global passive effect with diminishing returns and class-specific uses. Juggernaut and Eidolon use it as their primary defensive stat.",
    formulas: [{ label: "Defense Rating (passive, all classes)", formula: "min(3.5, sqrt(DEF) / 2.5)" }],
    usedBy: [
      { class: "Swordsman",  detail: "DEF-pierce mechanic" },
      { class: "Eidolon",    detail: "Primary stat · light absorption cap" },
      { class: "Juggernaut", detail: "Primary stat · core defense scaling" },
    ],
  },
  {
    id: "LCK",
    name: "Luck",
    max: 100,
    globalEffects: [
      "Directly sets your critical hit chance as a percentage. At 100 LCK, you have a 100% critical hit chance.",
    ],
    notes: "Luck is one of the only stats with a global passive effect built into the core plugin. Combined with STR's crit damage bonus, high LCK + STR creates a devastating crit-focused build.",
    formulas: [
      { label: "Critical Hit Chance", formula: "LCK %" },
      { label: "Critical Hit Damage Bonus (via STR)", formula: "STR / 3" },
    ],
    usedBy: [
      { class: "Arbalist",  detail: "Primary stat · amplifies headshot crits" },
      { class: "Eidolon", detail: "Primary stat · Imbalance regen variance, Fangs damage roll & Purify roll" },
      { class: "Vampire", detail: "Bleed proc chance & Blood Lust heal-on-hit chance" },
      { class: "Swordsman", detail: "Secondary · crit synergy with Flurry" },
    ],
  },
  {
    id: "TCH",
    name: "Tech",
    max: 100,
    globalEffects: [
      "No server-wide passive effect configured. TCH is used directly by the Arbalist for mechanical/gadget scaling.",
    ],
    notes: "Tech is currently exclusive to the Arbalist. It drives the energy bar capacity and ability potency, reflecting the class's gadget-engineer theme.",
    formulas: [
      { label: "Arbalist Max Energy", formula: "20 + TCH/20 + lvl/2" },
    ],
    usedBy: [
      { class: "Arbalist", detail: "Primary stat · max energy & all ability potency" },
    ],
  },
  {
    id: "REL",
    name: "Religion",
    max: 100,
    globalEffects: [
      "Reduces XP and soul loss on death — higher Religion means you lose less when you die. At 100 Religion, you lose zero XP and zero souls on death.",
    ],
    notes: "Religion is the only stat with a direct quality-of-life effect for all players: death penalty reduction. It also powers the Eidolon's divine abilities and the Priest's holy area control.",
    formulas: [
      { label: "Soul Loss on Death", formula: "max(0, (2 + level/10) × (1 − REL/100))" },
      { label: "XP Loss on Death",   formula: "max(0, (50 + level×15) × (1 − REL/100))" },
    ],
    usedBy: [
      { class: "Eidolon", detail: "Primary stat · powers nearly every ability" },
      { class: "Priest",  detail: "Primary stat · area control & minion scaling" },
    ],
  },
];

export default function ServerWikiStats({ onNavigate }) {
  return (
    <section className="fade-in mx-auto max-w-5xl space-y-10 px-2 py-8 font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          SkillsPro · Server Reference
        </p>
        <h1 className="mt-3 font-['Cinzel',serif] text-4xl font-bold text-slate-100">
          Stats Reference
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Every player accumulates <span className="text-slate-200 font-semibold">Stat Points</span> as they level up.
          Points are spent in <code className="text-slate-300">/skills stats</code> and define your character's strengths.
          Below is a complete breakdown of each stat's global mechanics and which classes draw power from it.
        </p>
        <div className="mt-4 rounded-xl bg-slate-800/50 px-4 py-3 text-base text-slate-400">
          <span className="text-slate-300 font-semibold">Stat Points per level:</span> roughly{" "}
          <code className="text-slate-300">lvl / 2</code> at low levels, with large bonus grants at levels 25, 50, and 75.
          Stats max out at 100 each.
        </div>
      </div>

      {/* Stat entries */}
      {STATS.map((stat) => (
        <div
          key={stat.id}
          className="rounded-3xl border bg-slate-900/60 p-8 shadow-lg backdrop-blur"
          style={{ borderColor: STAT_COLORS[stat.id] + "33" }}
        >
          {/* Stat header */}
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-700/50 pb-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black font-['Cinzel',serif]"
              style={{ background: STAT_COLORS[stat.id] + "22", color: STAT_COLORS[stat.id] }}
            >
              {stat.id}
            </div>
            <div>
              <h2
                className="font-['Cinzel',serif] text-3xl font-bold"
                style={{ color: STAT_COLORS[stat.id] }}
              >
                {stat.name}
              </h2>
              <p className="text-sm text-slate-500">
                Max level: <span className="text-slate-300">{stat.max}</span>
              </p>
            </div>
          </div>

          {/* Global effects */}
          <div className="mt-5">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-3">Global Effect</h3>
            <ul className="space-y-1.5">
              {stat.globalEffects.map((effect, i) => (
                <li key={i} className="text-lg text-slate-300">
                  {effect}
                </li>
              ))}
            </ul>
            <FormulaAccordion formulas={stat.formulas} />
          </div>

          {/* Notes */}
          {stat.notes && (
            <p className="mt-4 text-base text-slate-400 italic">{stat.notes}</p>
          )}

          {/* Used by classes */}
          <div className="mt-6">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-3">Used By</h3>
            {stat.usedBy.length === 0 ? (
              <p className="text-base text-slate-500">No classes currently utilize this stat in their abilities.</p>
            ) : (
              <div className="space-y-2">
                {stat.usedBy.map((entry) => (
                  <div
                    key={entry.class}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/30 bg-slate-800/40 px-4 py-3"
                  >
                    <ClassBadge name={entry.class} color={CLASS_COLORS[entry.class] ?? "#94a3b8"} />
                    <p className="text-base text-slate-400">{entry.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Back link */}
      <div className="flex justify-start">
        <button
          onClick={() => onNavigate("/server-wiki")}
          className="rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-2 text-base text-slate-400 transition hover:text-slate-100 hover:border-slate-500"
        >
          ← Back to Server Wiki
        </button>
      </div>
    </section>
  );
}
