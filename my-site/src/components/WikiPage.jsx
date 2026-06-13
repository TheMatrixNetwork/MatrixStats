import React, { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { API_BASE } from "../config.js";

function humanize(id) {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatRequirement(req) {
  if (!req) return "";
  if (req.all) {
    return `All of: ${req.all.map(formatRequirement).join(", ")}`;
  }
  if (req.any) {
    return `Any of: ${req.any.map(formatRequirement).join(" or ")}`;
  }
  if (req.not) {
    return `Not: ${formatRequirement(req.not)}`;
  }

  if (req.type === "quest") {
    const statusLabel = {
      finished: "Completed",
      started: "Started",
      in_progress: "In Progress",
      not_started: "Not Started",
    }[req.status] || req.status || "Completed";
    const name = req.questName || `Quest ${req.questId}`;
    return `${name}: ${statusLabel}`;
  }

  const typeLabel = req.type ? humanize(req.type) : "Requirement";
  const idLabel = req.id ? humanize(req.id) : "";
  const quantity = req.quantity ? ` x${req.quantity}` : "";
  return `${typeLabel}: ${idLabel}${quantity}`.trim();
}

function RequirementPill({ requirement }) {
  const text = formatRequirement(requirement);
  if (!text) return null;
  return (
    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
      {text}
    </span>
  );
}

function renderMarkdown(markdownText) {
  if (!markdownText) return { __html: "" };
  const html = marked.parse(markdownText, { breaks: true });
  return { __html: DOMPurify.sanitize(html) };
}

function isImageIcon(icon) {
  return /^https?:\/\//i.test(icon) || icon.startsWith("/");
}

function sectionAnchor(section) {
  return `section-${section.id}`;
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

export default function WikiPage({ slug, onBack, wikiView, isAdmin }) {
  const [state, setState] = useState({ status: "loading" });
  const [bossIndex, setBossIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setState({ status: "loading" });
      try {
        const viewParam = isAdmin && wikiView === "all" ? "?view=all" : "";
        const res = await fetch(`${API_BASE}/api/wiki/page/${slug}${viewParam}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setState({ status: "error", message: data?.message || "Not found" });
          return;
        }
        setState({ status: "ready", data });
      } catch (err) {
        if (!active) return;
        setState({ status: "error", message: "Unable to load this page." });
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const content = useMemo(() => {
    if (state.status !== "ready") return null;
    return state.data;
  }, [state]);

  useEffect(() => {
    setBossIndex(0);
    setItemIndex(0);
  }, [content?.slug]);

  if (state.status === "loading") {
    return (
      <div className="rounded-3xl bg-white/80 p-10 text-center text-sm text-slate-500">
        Loading entry...
      </div>
    );
  }

  if (state.status === "error") {
    if (state.message === "Login required.") {
      return (
        <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network Wiki</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">You must be logged in to view this page</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            The Legends wiki is restricted to logged-in players.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700">
        {state.message}
      </div>
    );
  }

  const bosses = content.bosses || [];
  const items = content.items || [];
  const sections = content.sections || [];
  const bossLinks = sections.reduce((acc, section) => {
    if (section.bossId) {
      acc[section.bossId] = acc[section.bossId] || [];
      acc[section.bossId].push(section);
    }
    return acc;
  }, {});
  const itemLinks = sections.reduce((acc, section) => {
    if (section.itemId) {
      acc[section.itemId] = acc[section.itemId] || [];
      acc[section.itemId].push(section);
    }
    return acc;
  }, {});

  const activeBoss = bosses[bossIndex] || null;
  const activeItem = items[itemIndex] || null;
  const hasBosses = bosses.length > 0;
  const hasItems = items.length > 0;
  const bossById = bosses.reduce((acc, boss) => {
    acc[boss.id] = boss;
    return acc;
  }, {});
  const itemById = items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const panelCard = (entry, type, index, onPrev, onNext, links) => {
    if (!entry) return null;
    const linkedSections = links?.[entry.id] || [];
    return (
      <div className="space-y-4 rounded-3xl bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{type}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600"
            >
              ◀
            </button>
            <span className="text-xs text-slate-400">
              {index + 1}/{type === "Boss" ? bosses.length : items.length}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600"
            >
              ▶
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-700">
            {entry.icon ? (
              isImageIcon(entry.icon)
                ? <img src={entry.icon} alt="" className="h-8 w-8 object-contain" />
                : <span>{entry.icon}</span>
            ) : (
              <span className="tatter-icon">?</span>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{entry.name || entry.id}</p>
            <p className="text-xs text-slate-500">{entry.id}</p>
          </div>
        </div>
        {entry.description ? (
          <p className="text-sm text-slate-600">{entry.description}</p>
        ) : null}
        {(entry.stats || []).length ? (
          <div className="space-y-2">
            {entry.stats.map((stat) => (
              <div key={`${entry.id}-${stat.key}`} className="flex items-center justify-between text-xs text-slate-500">
                <span className="uppercase tracking-wide">{stat.key}</span>
                <span className="font-semibold text-slate-700">{stat.value}</span>
              </div>
            ))}
          </div>
        ) : null}
        {linkedSections.length ? (
          <div className="space-y-1 text-xs text-slate-400">
            <p className="uppercase tracking-wide">Linked sections</p>
            {linkedSections.map((section) => (
              <p key={`${entry.id}-${section.id}`}>{section.title}</p>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <article className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold uppercase tracking-wide text-slate-500"
      >
        Back to index
      </button>

      <div className="rounded-3xl bg-white/80 shadow-sm">
        <div className="px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px_360px] lg:items-start">
            <div className="lg:max-w-[1580px]">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
                {content.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{content.title}</h1>
              <p className="mt-3 text-xl text-slate-600">{content.summary}</p>
              {sections.length ? (
                <div className="mt-6 inline-block w-fit rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.3em] text-slate-400">
                    <span className="contents-icon" aria-hidden="true" />
                    Contents
                  </p>
                  <ol className="mt-3 space-y-2 text-base text-slate-600">
                    {sections.map((section, index) => (
                      <li key={section.id} className="flex items-center gap-2">
                        <span className="contents-number">{index + 1}.</span>
                        {section.locked ? (
                          <span className="text-slate-400">HIDDEN</span>
                        ) : (
                          <a
                            href={`#${sectionAnchor(section)}`}
                            className="transition hover:text-slate-900"
                          >
                            {section.title}
                          </a>
                        )}
                        {section.locked ? (
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Locked
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              {content.locked ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <p className="font-semibold">This entry is locked.</p>
                  <p className="mt-2">Defeat or collect the requirements below to reveal the page.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <RequirementPill requirement={content.requires} />
                  </div>
                </div>
              ) : null}
            </div>

            {!content.locked && hasBosses ? (
              <aside className="lg:col-start-2">
                {panelCard(
                  activeBoss,
                  "Boss",
                  bossIndex,
                  () => setBossIndex((prev) => (bosses.length ? (prev - 1 + bosses.length) % bosses.length : 0)),
                  () => setBossIndex((prev) => (bosses.length ? (prev + 1) % bosses.length : 0)),
                  bossLinks
                )}
              </aside>
            ) : null}
            {!content.locked && hasItems ? (
              <aside className="lg:col-start-3">
                {panelCard(
                  activeItem,
                  "Item",
                  itemIndex,
                  () => setItemIndex((prev) => (items.length ? (prev - 1 + items.length) % items.length : 0)),
                  () => setItemIndex((prev) => (items.length ? (prev + 1) % items.length : 0)),
                  itemLinks
                )}
              </aside>
            ) : null}
          </div>
        </div>

          {!content.locked && (
            <div>
              {content.sections?.map((section, index) => (
                <section
                  key={section.id}
                  id={sectionAnchor(section)}
                  className="px-6 py-8"
                >
                  {index !== 0 ? <div className="section-divider" /> : null}
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-slate-900">
                      {section.locked ? "HIDDEN" : section.title}
                    </h2>
                    {section.locked ? (
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        Locked
                      </span>
                    ) : null}
                  </div>

                  {!section.locked && (section.bossId || section.itemId) ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
                      {section.bossId ? (
                        <span className="rounded-full border border-slate-300 px-3 py-1">
                          Boss: {(bossById[section.bossId]?.name || section.bossId)}
                        </span>
                      ) : null}
                      {section.itemId ? (
                        <span className="rounded-full border border-slate-300 px-3 py-1">
                          Item: {(itemById[section.itemId]?.name || section.itemId)}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {section.locked ? (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="font-semibold">Fragments of a sealed page:</p>
                      <div className="tatter-text tatter-block mt-3 space-y-3">
                        <p>{buildScramble(`${section.id}-a`, 140)}</p>
                        <p>{buildScramble(`${section.id}-b`, 160)}</p>
                        <p>{buildScramble(`${section.id}-c`, 120)}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <RequirementPill requirement={section.requires} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4 text-lg leading-relaxed text-slate-700">
                      {section.contentMarkdown || section.content_markdown ? (
                        <div
                          className="space-y-3"
                          dangerouslySetInnerHTML={renderMarkdown(
                            section.contentMarkdown || section.content_markdown
                          )}
                        />
                      ) : (
                        <>
                          {section.content?.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                          {section.list?.length ? (
                            <ul className="list-disc space-y-2 pl-6">
                              {section.list.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
      </div>
    </article>
  );
}
