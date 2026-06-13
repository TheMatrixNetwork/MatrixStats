import React, { useState } from "react";

const skillsEntries = [
    {
        slug: "stats",
        title: "Stats Reference",
        summary: "A complete breakdown of every stat — STR, DEX, ARC, VIT, INT, MIT, DEF, LCK, TCH, REL — covering global effects, formulas, and which classes use each stat.",
        accent: "border-slate-600/50 hover:border-slate-400/60",
        label: "text-slate-300",
        pinned: true,
    },
    {
        slug: "prestige",
        title: "Prestige Guide",
        summary: "How prestige works on Matrix: requirements, what resets, what carries over, tier costs, and why prestige is the long-term path to power.",
        accent: "border-amber-900/50 hover:border-amber-700/60",
        label: "text-amber-400",
        pinned: true,
    },
    {
    slug: "swordsman",
    title: "Swordsman",
        summary: "Prime melee duelist focused on sword mastery, reaction windows, and close-range pressure.",
        accent: "border-slate-600/50 hover:border-slate-500/70",
        label: "text-slate-200",
  },
    {
        slug: "vampire",
        title: "Vampire",
        summary: "Secret endgame predator. Blood drains constantly — attack to survive, hunt to dominate. Unlocked at level 666.",
        accent: "border-red-900/50 hover:border-red-700/60",
        label: "text-red-400",
    },
    {
        slug: "arbalist",
        title: "Arbalist",
        summary: "Precision ranged combatant. Deals bonus damage at distance, fires energy arrows on punch, and calls skeleton minion squads.",
        accent: "border-amber-900/50 hover:border-amber-700/60",
        label: "text-amber-400",
    },
    {
        slug: "eidolon",
        title: "Eidolon",
        summary: "Ethereal dualist of light and dark. Shifts between two forms to absorb, release, and unleash imbalance energy against enemies.",
        accent: "border-violet-900/50 hover:border-violet-700/60",
        label: "text-violet-400",
    },
    {
        slug: "priest",
        title: "Priest",
        summary: "Holy support and nature summoner. Walks on water, heals and buffs allies, pacifies mobs, and deploys fox armies and barrier fields.",
        accent: "border-yellow-900/50 hover:border-yellow-700/60",
        label: "text-yellow-400",
    },
    {
        slug: "juggernaut",
        title: "Juggernaut",
        summary: "Armoured tank and crowd controller. Passively blocks hits, shreds enemy armour with axes, reflects damage, and grabs enemies to carry and hurl them.",
        accent: "border-green-900/50 hover:border-green-700/60",
        label: "text-green-400",
    },
    {
        slug: "devourer",
        title: "Devourer",
        summary: "Stealth assassin and soul predator. Corrodes targets from within, blinks through space, strips weapons bare, and consumes souls to fuel its next strike.",
        accent: "border-purple-900/50 hover:border-purple-700/60",
        label: "text-purple-400",
    },
    {
        slug: "firemage",
        title: "Fire Mage",
        summary: "Aggressive fire caster that thrives while burning. Immune to fire damage, amplifies fire dealt to nearby enemies, and unleashes fireballs, volcanoes, and lightning with Phoenix Essence.",
        accent: "border-orange-900/50 hover:border-orange-700/60",
        label: "text-orange-400",
    },
    {
        slug: "mage",
        title: "Mage",
        summary: "Versatile arcane spellcaster with staff mastery. Sustains mana on every hit, counters attackers with Reflect and Explosion Spell, fires Energy Flux bolts, and stops time itself with Chronoprohiberis.",
        accent: "border-sky-900/50 hover:border-sky-700/60",
        label: "text-sky-400",
    },
];

const sortedSkillsEntries = [
    ...skillsEntries.filter((entry) => entry.pinned),
    ...skillsEntries.filter((entry) => !entry.pinned),
];

const pinnedCardClass = "border-2 border-amber-400/70 ring-1 ring-amber-400/20 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]";

function CollapsibleSection({ title, description, accentClass, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 shadow-lg backdrop-blur overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-4 p-7 text-left transition hover:bg-slate-800/40"
            >
                <div>
                    <p className={`text-xs uppercase tracking-[0.35em] font-semibold ${accentClass} mb-1`}>Category</p>
                    <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
                    {description && (
                        <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">{description}</p>
                    )}
                </div>
                <span
                    className={`flex-shrink-0 text-slate-500 text-2xl transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
                >
                    ▶
                </span>
            </button>

            {open && (
                <div className="px-7 pb-7 grid gap-3 sm:grid-cols-2">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function ServerWikiHome({ onNavigate }) {
  return (
      <section className="fade-in space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Matrix Network</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-100">Server Wiki</h1>
              <p className="mt-3 max-w-3xl text-base text-slate-400">
                  Dedicated class and gameplay documentation for Matrix systems. Browse by category below.
        </p>
      </div>

          {/* Skills section */}
          <CollapsibleSection
              title="Skills"
              description="Class pages for the SkillsPro system — abilities, stat scaling formulas, and build notes for every playable class."
              accentClass="text-emerald-400"
              defaultOpen={true}
          >
              {sortedSkillsEntries.map((entry) => (
          <button
            key={entry.slug}
            type="button"
            onClick={() => onNavigate(`/server-wiki/${entry.slug}`)}
                      className={`rounded-2xl border bg-slate-950/50 p-5 text-left transition hover:-translate-y-0.5 hover:bg-slate-800/60 ${entry.pinned ? pinnedCardClass : entry.accent}`}
          >
                      {entry.pinned ? (
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-300">Pinned</p>
                      ) : null}
                      <h3 className={`text-lg font-bold ${entry.label}`}>{entry.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{entry.summary}</p>
          </button>
        ))}
          </CollapsibleSection>

          {/* Bending section */}
          <CollapsibleSection
              title="Bending"
              description="Documentation for the Bending system — elements, techniques, and mechanics."
              accentClass="text-cyan-400"
              defaultOpen={false}
          >
              <div className="sm:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/40 p-6 text-center text-slate-500 text-sm italic">
                  Bending pages coming soon.
              </div>
          </CollapsibleSection>
    </section>
  );
}
