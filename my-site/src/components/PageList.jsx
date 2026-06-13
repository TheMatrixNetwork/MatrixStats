import React, { useState } from "react";

const CATEGORIES = [
  {
    key: "bosses",
    label: "Bosses",
    accentClass: "text-red-400",
    description: "Powerful enemies lurking throughout the world. Defeating them may unlock new knowledge.",
    match: (p) => p.tags?.some((t) => t === "boss" || t === "mobs"),
  },
  {
    key: "items",
    label: "Items",
    accentClass: "text-amber-400",
    description: "Rare relics, drops, and artifacts hidden across the server. Some require great feats to obtain.",
    match: (p) => p.tags?.some((t) => t === "item" || t === "relic"),
  },
  {
    key: "characters",
    label: "Characters",
    accentClass: "text-sky-400",
    description: "Notable figures and NPCs woven into the world's story.",
    match: (p) => p.tags?.some((t) => t === "character" || t === "npc"),
  },
  {
    key: "quests",
    label: "Quests",
    accentClass: "text-violet-400",
    description: "Story missions and adventures. Completing earlier quests may be required to unlock later ones.",
    match: (p) => p.tags?.includes("quest") || p.slug.startsWith("quest-"),
  },
  {
    key: "misc",
    label: "Misc",
    accentClass: "text-slate-400",
    description: "General lore, guides, and other entries that don't fit a specific category.",
    match: () => true,
  },
];

function categorize(pages) {
  const groups = CATEGORIES.map((c) => ({ ...c, pages: [] }));
  for (const page of pages) {
    const group = groups.find((g) => g.match(page));
    group.pages.push(page);
  }
  return groups.filter((g) => g.pages.length > 0);
}

function formatTags(tags) {
  if (!tags?.length) return "";
  return tags.slice(0, 3).join(" ");
}

function isImageIcon(icon) {
  return /^https?:\/\//i.test(icon) || icon.startsWith("/");
}

function buildScramble(seed, length) {
  const pool = "abcdefghijklmnopqrstuvwxyz0123456789~^#@";
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  let output = "";
  for (let i = 0; i < length; i += 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    output += pool[hash % pool.length];
  }
  return output;
}

function obfuscateText(text, seed, fallbackLength = 12) {
  const baseLength = Math.max(text?.length || 0, fallbackLength);
  return buildScramble(seed, Math.min(baseLength, 36));
}

function PageCard({ page, onOpen }) {
  return (
    <button
      key={page.slug}
      type="button"
      onClick={() => onOpen(page.slug)}
      className="glow-ring group flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 shadow-sm">
          {page.locked || !page.icon ? (
            <span className="tatter-icon">?</span>
          ) : isImageIcon(page.icon) ? (
            <img src={page.icon} alt="" className="h-8 w-8 object-contain" />
          ) : (
            <span>{page.icon}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${page.locked ? "tatter-text" : "text-slate-900"}`}>
            {page.locked
              ? obfuscateText(page.title, page.slug, 16)
              : page.title}
          </h3>
          <p className={`mt-2 text-sm ${page.locked ? "tatter-text" : "text-slate-600"}`}>
            {page.locked
              ? obfuscateText(page.summary, `${page.slug}-summary`, 24)
              : page.summary}
          </p>
        </div>
        {page.locked ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Locked
          </span>
        ) : (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Unlocked
          </span>
        )}
      </div>
      <div className={`mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wide ${page.locked ? "tatter-text" : "text-slate-400"}`}>
        {page.locked ? obfuscateText(formatTags(page.tags), `${page.slug}-tags`, 10) : formatTags(page.tags)}
      </div>
    </button>
  );
}

function CollapsibleSection({ label, accentClass, description, count, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/60 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-7 text-left transition hover:bg-slate-800/40"
      >
        <div>
          <p className={`mb-1 text-xs font-semibold uppercase tracking-[0.35em] ${accentClass}`}>
            Category
          </p>
          <h2 className="text-2xl font-bold text-slate-100">{label}</h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
            {description}{" "}
            <span className="text-slate-500">({count})</span>
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-2xl text-slate-500 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="grid gap-4 px-7 pb-7 md:grid-cols-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PageList({ pages, query, onOpen }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = pages.filter((page) => {
    if (!normalizedQuery) return true;
    return (
      page.title.toLowerCase().includes(normalizedQuery)
      || page.summary.toLowerCase().includes(normalizedQuery)
      || page.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });

  if (!filtered.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
        No entries match your search. Try a different keyword.
      </div>
    );
  }

  const groups = categorize(filtered);

  return (
    <div className="space-y-6">
      {groups.map((group, i) => (
        <CollapsibleSection
          key={group.key}
          label={group.label}
          accentClass={group.accentClass}
          description={group.description}
          count={group.pages.length}
          defaultOpen={i === 0}
        >
          {group.pages.map((page) => (
            <PageCard key={page.slug} page={page} onOpen={onOpen} />
          ))}
        </CollapsibleSection>
      ))}
    </div>
  );
}
