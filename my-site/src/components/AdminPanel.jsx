import React, { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { API_BASE } from "../config.js";

const DEFAULT_CATEGORIES = [
  {
    key: "bosses",
    label: "Bosses",
    accentClass: "text-red-500",
    defaultTags: ["boss"],
    match: (p) => p.tags?.some((t) => t === "boss" || t === "mobs"),
  },
  {
    key: "items",
    label: "Items",
    accentClass: "text-amber-500",
    defaultTags: ["item"],
    match: (p) => p.tags?.some((t) => t === "item" || t === "relic"),
  },
  {
    key: "characters",
    label: "Characters",
    accentClass: "text-sky-500",
    defaultTags: ["character"],
    match: (p) => p.tags?.some((t) => t === "character" || t === "npc"),
  },
  {
    key: "quests",
    label: "Quests",
    accentClass: "text-violet-500",
    defaultTags: ["quest"],
    match: (p) => p.tags?.includes("quest") || p.slug?.startsWith("quest-"),
  },
  {
    key: "misc",
    label: "Misc",
    accentClass: "text-slate-400",
    defaultTags: [],
    match: () => true,
  },
];

function groupPagesByCategory(pages, categories) {
  const groups = categories.map((c) => ({ ...c, entries: [] }));
  pages.forEach((page, idx) => {
    const group = groups.find((g) => g.match(page));
    group.entries.push({ page, idx });
  });
  return groups;
}

function loadCustomCategories() {
  try {
    const raw = localStorage.getItem("wiki-admin-custom-categories");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCategories(cats) {
  try {
    localStorage.setItem("wiki-admin-custom-categories", JSON.stringify(cats));
  } catch { }
}

const requirementTypes = [
  { value: "boss", label: "Boss" },
  { value: "item", label: "Item" },
  { value: "flag", label: "Flag" },
  { value: "quest", label: "Quest" },
];

const QUEST_NAMES = {
  0: "A Mysterious New Friend",
  1: "Find an Old Friend",
  2: "Explore the Ruins",
  3: "Lost Valley",
  5: "The Order",
  8: "The Lost Valley",
  12: "The First Sacred Rite",
  13: "The Second Sacred Rite",
  14: "The Third Sacred Rite",
  15: "The Dark Path",
  17: "Desperation",
  18: "Moneybaggs",
  19: "Prison Break",
  26: "Darkness in its Prime",
  27: "New Dawn",
  29: "Brothers?",
  33: "The Sewers",
  34: "Gathering",
  35: "Let's Get Started",
  38: "Dream?",
  1000: "Just a Dream",
  1001: "Journey to Servitude",
};

const questStatusOptions = [
  { value: "finished", label: "Completed" },
  { value: "started", label: "Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "not_started", label: "Not Started" },
];

function buildSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/_+/g, "_")
    .replace(/^-|-$/g, "");
}

function normalizeMarkdown(section) {
  if (section.contentMarkdown || section.content_markdown) {
    return section.contentMarkdown || section.content_markdown;
  }
  const paragraphs = Array.isArray(section.content) ? section.content : [];
  const listItems = Array.isArray(section.list) ? section.list : [];
  const body = paragraphs.join("\n\n");
  const list = listItems.length ? `\n\n${listItems.map((item) => `- ${item}`).join("\n")}` : "";
  return `${body}${list}`.trim();
}

function normalizePage(page) {
  return {
    slug: page.slug || "",
    title: page.title || "",
    summary: page.summary || "",
    icon: page.icon || "",
    tags: Array.isArray(page.tags) ? page.tags : [],
    tagsText: Array.isArray(page.tags) ? page.tags.join(", ") : "",
    requires: page.requires || null,
    bosses: Array.isArray(page.bosses)
      ? page.bosses.map((boss) => ({
          id: boss.id || "",
          name: boss.name || "",
          description: boss.description || "",
          icon: boss.icon || "",
          stats: Array.isArray(boss.stats)
            ? boss.stats.map((stat) => ({ key: stat.key || "", value: stat.value || "" }))
            : [],
        }))
      : [],
    items: Array.isArray(page.items)
      ? page.items.map((item) => ({
          id: item.id || "",
          name: item.name || "",
          description: item.description || "",
          icon: item.icon || "",
          stats: Array.isArray(item.stats)
            ? item.stats.map((stat) => ({ key: stat.key || "", value: stat.value || "" }))
            : [],
        }))
      : [],
    sections: Array.isArray(page.sections)
      ? page.sections.map((section) => ({
          id: section.id || "",
          title: section.title || "",
          requires: section.requires || null,
          bossId: section.bossId || "",
          itemId: section.itemId || "",
          contentMarkdown: normalizeMarkdown(section),
        }))
      : [],
  };
}

function parseTags(text) {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function cleanStats(stats) {
  return stats
    .map((stat) => ({ key: String(stat.key || "").trim(), value: String(stat.value || "").trim() }))
    .filter((stat) => stat.key && stat.value);
}

function renderMarkdown(markdownText) {
  if (!markdownText) return { __html: "" };
  const html = marked.parse(markdownText, { breaks: true });
  return { __html: DOMPurify.sanitize(html) };
}

function parseRequirements(value) {
  if (!value) return { mode: "none", items: [] };
  if (value.all) return { mode: "all", items: value.all };
  if (value.any) return { mode: "any", items: value.any };
  if (value.type) return { mode: "all", items: [value] };
  return { mode: "none", items: [] };
}

function cleanRequirement(item) {
  const type = item.type || "boss";
  if (type === "quest") {
    const questId = Number(item.questId);
    if (!Number.isFinite(questId)) return null;
    return {
      type: "quest",
      questId,
      questName: QUEST_NAMES[questId] || item.questName || `Quest ${questId}`,
      status: item.status || "finished",
    };
  }
  const id = String(item.id || "").trim();
  if (!id) return null;
  const next = { type, id };
  if (type === "item") {
    const quantity = Number(item.quantity || 1);
    next.quantity = Number.isFinite(quantity) ? quantity : 1;
  }
  if (type === "flag" && item.value) {
    next.value = String(item.value);
  }
  return next;
}

function RequirementsEditor({ label, value, onChange }) {
  const parsed = useMemo(() => parseRequirements(value), [value]);
  const [mode, setMode] = useState(parsed.mode);
  const [items, setItems] = useState(parsed.items);
  const isSyncingRef = React.useRef(false);

  useEffect(() => {
    if (isSyncingRef.current) {
      isSyncingRef.current = false;
      return;
    }
    setMode(parsed.mode);
    setItems(parsed.items);
  }, [parsed.mode, parsed.items]);

  const commit = (nextMode, nextItems) => {
    isSyncingRef.current = true;
    const cleaned = nextItems.map(cleanRequirement).filter(Boolean);
    if (nextMode === "none" || cleaned.length === 0) {
      onChange(null);
      return;
    }
    onChange({ [nextMode]: cleaned });
  };

  const updateItem = (index, update) => {
    const next = items.map((item, idx) => (idx === index ? { ...item, ...update } : item));
    setItems(next);
    commit(mode, next);
  };

  const addItem = () => {
    const next = [...items, { type: "boss", id: "", quantity: 1, value: "" }];
    setItems(next);
    commit(mode, next);
  };

  const removeItem = (index) => {
    const next = items.filter((_, idx) => idx !== index);
    setItems(next);
    commit(mode, next);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    commit(nextMode, items);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <select
          value={mode}
          onChange={(event) => handleModeChange(event.target.value)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
        >
          <option value="none">No requirement</option>
          <option value="all">All of these</option>
          <option value="any">Any of these</option>
        </select>
        {mode !== "none" ? (
          <button
            type="button"
            onClick={addItem}
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
          >
            Add rule
          </button>
        ) : null}
      </div>

      {mode !== "none" ? (
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-xs text-slate-400">No rules yet.</p>
          ) : null}
          {items.map((item, index) => (
            <div key={`${item.type}-${index}`} className="flex flex-wrap items-center gap-3">
              <select
                value={item.type || "boss"}
                onChange={(event) => updateItem(index, { type: event.target.value })}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {requirementTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {item.type === "quest" ? (
                <>
                  <input
                    type="number"
                    min="0"
                    value={item.questId ?? ""}
                    onChange={(event) => updateItem(index, { questId: event.target.value === "" ? "" : Number(event.target.value) })}
                    placeholder="Quest ID"
                    className="w-28 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600"
                  />
                  <span className="text-xs text-slate-400">
                    {QUEST_NAMES[item.questId] || (item.questId !== "" && item.questId !== undefined ? `Quest ${item.questId}` : "Unknown quest")}
                  </span>
                  <select
                    value={item.status || "finished"}
                    onChange={(event) => updateItem(index, { status: event.target.value })}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {questStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : (
                  <input
                    value={item.id || ""}
                    onChange={(event) => updateItem(index, { id: event.target.value })}
                    placeholder="Id (stone_warden, ancient_shard)"
                    className="min-w-[220px] flex-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600"
                  />
              )}
              {item.type === "item" ? (
                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                  className="w-20 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600"
                />
              ) : null}
              {item.type === "flag" ? (
                <input
                  value={item.value || ""}
                  onChange={(event) => updateItem(index, { value: event.target.value })}
                  placeholder="Optional value"
                  className="min-w-[160px] rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600"
                />
              ) : null}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPanel() {
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [dragSectionIndex, setDragSectionIndex] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [saveNotice, setSaveNotice] = useState("");
  const saveNoticeTimerRef = useRef(null);

  // Sidebar category state
  const [customCategories, setCustomCategories] = useState(() => loadCustomCategories());
  const [openCategories, setOpenCategories] = useState({ bosses: true, quests: true, misc: true });
  const [newCatForm, setNewCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatTag, setNewCatTag] = useState("");

  // Right-click context menu
  const [contextMenu, setContextMenu] = useState(null); // { x, y, targetIdx }
  const contextMenuRef = useRef(null);

  const allCategories = useMemo(() => {
    const custom = customCategories.map((c) => ({
      key: `custom-${c.tag}`,
      label: c.label,
      accentClass: "text-emerald-500",
      defaultTags: [c.tag],
      match: (p) => p.tags?.includes(c.tag),
    }));
    // Insert custom categories before Misc
    const base = [...DEFAULT_CATEGORIES];
    base.splice(base.length - 1, 0, ...custom);
    return base;
  }, [customCategories]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setStatus("loading");
      try {
        const res = await fetch(`${API_BASE}/api/admin/wiki/pages`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setError(data?.message || "Unable to load admin data.");
          setStatus("error");
          return;
        }
        const normalized = (data.pages || []).map(normalizePage);
        setPages(normalized);
        setPageIndex(0);
        setSectionIndex(0);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setError("Unable to load admin data.");
        setStatus("error");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => () => {
    if (saveNoticeTimerRef.current) {
      window.clearTimeout(saveNoticeTimerRef.current);
    }
  }, []);

  const activePage = pages[pageIndex] || null;
  const activeSection = activePage?.sections?.[sectionIndex] || null;

  useEffect(() => {
    if (!activePage) return;
    if (sectionIndex >= activePage.sections.length) {
      setSectionIndex(Math.max(activePage.sections.length - 1, 0));
    }
  }, [activePage, sectionIndex]);

  const updatePage = (updates) => {
    setPages((prev) => prev.map((page, idx) => (idx === pageIndex ? { ...page, ...updates } : page)));
  };

  const updateSection = (updates) => {
    setPages((prev) => prev.map((page, idx) => {
      if (idx !== pageIndex) return page;
      const sections = page.sections.map((section, sIdx) => (
        sIdx === sectionIndex ? { ...section, ...updates } : section
      ));
      return { ...page, sections };
    }));
  };

  const reorderSections = (fromIndex, toIndex) => {
    if (!activePage) return;
    if (fromIndex === toIndex) return;
    const sections = [...activePage.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    updatePage({ sections });
    setSectionIndex(toIndex);
  };

  const handleSectionDragStart = (index) => (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    setDragSectionIndex(index);
  };

  const handleSectionDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (index) => (event) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(fromIndex)) {
      reorderSections(fromIndex, index);
    }
    setDragSectionIndex(null);
  };

  const handleSectionDragEnd = () => {
    setDragSectionIndex(null);
  };

  const updateBoss = (index, updates) => {
    setPages((prev) => prev.map((page, idx) => {
      if (idx !== pageIndex) return page;
      const bosses = page.bosses.map((boss, bIdx) => (
        bIdx === index ? { ...boss, ...updates } : boss
      ));
      return { ...page, bosses };
    }));
  };

  const updateItem = (index, updates) => {
    setPages((prev) => prev.map((page, idx) => {
      if (idx !== pageIndex) return page;
      const items = page.items.map((item, iIdx) => (
        iIdx === index ? { ...item, ...updates } : item
      ));
      return { ...page, items };
    }));
  };

  const addBoss = () => {
    if (!activePage) return;
    updatePage({
      bosses: [
        ...activePage.bosses,
        {
          id: "",
          name: "",
          description: "",
          icon: "",
          stats: [],
        },
      ],
    });
  };

  const addItem = () => {
    if (!activePage) return;
    updatePage({
      items: [
        ...activePage.items,
        {
          id: "",
          name: "",
          description: "",
          icon: "",
          stats: [],
        },
      ],
    });
  };

  const removeBoss = (index) => {
    if (!activePage) return;
    updatePage({ bosses: activePage.bosses.filter((_, bIdx) => bIdx !== index) });
  };

  const removeItem = (index) => {
    if (!activePage) return;
    updatePage({ items: activePage.items.filter((_, iIdx) => iIdx !== index) });
  };

  const handleAddPage = () => {
    handleAddPageForCategory([]);
  };

  const handleAddPageForCategory = (defaultTags = []) => {
    const title = "New Entry";
    const slugBase = buildSlug(title) || "new-entry";
    const existing = new Set(pages.map((page) => page.slug));
    let slug = slugBase;
    let count = 1;
    while (existing.has(slug)) {
      slug = `${slugBase}-${count}`;
      count += 1;
    }
    const tags = defaultTags.length ? defaultTags : ["new"];
    const nextPage = {
      slug,
      title,
      summary: "Short summary.",
      icon: "",
      tags,
      tagsText: tags.join(", "),
      requires: null,
      bosses: [],
      items: [],
      sections: [
        {
          id: "overview",
          title: "Overview",
          requires: null,
          bossId: "",
          itemId: "",
          contentMarkdown: "Write the details here.",
        },
      ],
    };
    setPages((prev) => [...prev, nextPage]);
    setPageIndex(pages.length);
    setSectionIndex(0);
  };

  const handleDeletePage = () => {
    if (!activePage) return;
    const confirmDelete = window.confirm(`Delete page "${activePage.title}"?`);
    if (!confirmDelete) return;
    setPages((prev) => prev.filter((_, idx) => idx !== pageIndex));
    setPageIndex(0);
    setSectionIndex(0);
  };

  const handleDuplicatePage = (sourceIdx) => {
    const source = pages[sourceIdx];
    if (!source) return;
    const existing = new Set(pages.map((p) => p.slug));
    let slug = `${source.slug}-copy`;
    let count = 2;
    while (existing.has(slug)) {
      slug = `${source.slug}-copy-${count}`;
      count += 1;
    }
    const dupe = {
      ...JSON.parse(JSON.stringify(source)),
      slug,
      title: `${source.title} (Copy)`,
      tagsText: (source.tagsText ?? source.tags.join(", ")),
    };
    const insertAt = sourceIdx + 1;
    setPages((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, dupe);
      return next;
    });
    setPageIndex(insertAt);
    setSectionIndex(0);
    setContextMenu(null);
  };

  // Close context menu on outside click or scroll
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [contextMenu]);

  const handleAddCustomCategory = () => {
    const name = newCatName.trim();
    const tag = newCatTag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name || !tag) return;
    const next = [...customCategories, { label: name, tag }];
    setCustomCategories(next);
    saveCustomCategories(next);
    setOpenCategories((prev) => ({ ...prev, [`custom-${tag}`]: true }));
    setNewCatName("");
    setNewCatTag("");
    setNewCatForm(false);
  };

  const handleAddSection = () => {
    if (!activePage) return;
    const title = "New Section";
    const baseId = buildSlug(title) || "section";
    const existing = new Set(activePage.sections.map((section) => section.id));
    let id = baseId;
    let count = 1;
    while (existing.has(id)) {
      id = `${baseId}-${count}`;
      count += 1;
    }
    const nextSection = {
      id,
      title,
      requires: null,
      bossId: "",
      itemId: "",
      contentMarkdown: "Section details go here.",
    };
    const sections = [...activePage.sections, nextSection];
    updatePage({ sections });
    setSectionIndex(sections.length - 1);
  };

  const handleDeleteSection = () => {
    if (!activePage || !activeSection) return;
    const confirmDelete = window.confirm(`Delete section "${activeSection.title}"?`);
    if (!confirmDelete) return;
    const sections = activePage.sections.filter((_, idx) => idx !== sectionIndex);
    updatePage({ sections });
    setSectionIndex(0);
  };

  const handleSave = async () => {
    setError("");
    setSaveNotice("");
    setStatus("saving");
    const fallbackPageIndex = pageIndex;
    const fallbackSectionIndex = sectionIndex;
    const activePageSlug = activePage?.slug || "";
    const activeSectionId = activeSection?.id || "";
    const payload = {
      pages: pages.map((page) => ({
        slug: page.slug,
        title: page.title,
        summary: page.summary,
        icon: page.icon || "",
        tags: parseTags(page.tagsText ?? page.tags.join(", ")),
        requires: page.requires || null,
        bosses: page.bosses.map((boss) => ({
          id: boss.id,
          name: boss.name,
          description: boss.description,
          icon: boss.icon,
          stats: cleanStats(boss.stats || []),
        })),
        items: page.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon,
          stats: cleanStats(item.stats || []),
        })),
        sections: page.sections.map((section) => ({
          id: section.id,
          title: section.title,
          requires: section.requires || null,
          bossId: section.bossId || "",
          itemId: section.itemId || "",
          contentMarkdown: section.contentMarkdown || "",
        })),
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/api/admin/wiki/pages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Save failed.");
        setStatus("error");
        return;
      }
      const normalized = (data.pages || []).map(normalizePage);
      setPages(normalized);
      const resolvedPageIndex = normalized.findIndex((page) => page.slug === activePageSlug);
      const nextPageIndex = resolvedPageIndex >= 0
        ? resolvedPageIndex
        : Math.min(fallbackPageIndex, Math.max(normalized.length - 1, 0));
      const nextPage = normalized[nextPageIndex] || null;
      const resolvedSectionIndex = nextPage?.sections?.findIndex(
        (section) => section.id === activeSectionId
      );
      const nextSectionIndex = resolvedSectionIndex >= 0
        ? resolvedSectionIndex
        : Math.min(fallbackSectionIndex, Math.max((nextPage?.sections?.length || 1) - 1, 0));
      setPageIndex(nextPageIndex);
      setSectionIndex(nextSectionIndex);
      setStatus("ready");
      setSaveNotice("Saved successfully.");
      if (saveNoticeTimerRef.current) {
        window.clearTimeout(saveNoticeTimerRef.current);
      }
      saveNoticeTimerRef.current = window.setTimeout(() => {
        setSaveNotice("");
      }, 2500);
    } catch (err) {
      setError("Save failed.");
      setStatus("error");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Legends Wiki editor</h2>
        <p className="mt-2 text-sm text-slate-600">
          Select a page to edit, then update sections (supports markdown). You can add dynamic requirements to hide certain
          sections behind certain events in-game.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {saveNotice ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveNotice}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl bg-white/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pages</h3>
          </div>

          {pages.length === 0 ? (
            <p className="text-xs text-slate-400">No pages yet. Add one below.</p>
          ) : null}

          <div className="space-y-3">
            {groupPagesByCategory(pages, allCategories).map((group) => {
              const isOpen = openCategories[group.key] !== false;
              const hasPages = group.entries.length > 0;
              return (
                <div key={group.key} className="overflow-hidden rounded-2xl border border-slate-200">
                  {/* Group header */}
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setOpenCategories((prev) => ({ ...prev, [group.key]: !isOpen }))}
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${group.accentClass}`}>
                        {group.label}
                      </span>
                      {hasPages ? (
                        <span className="text-[10px] text-slate-400">({group.entries.length})</span>
                      ) : null}
                      <span className={`ml-auto text-xs text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}>
                        ▶
                      </span>
                    </button>
                    <button
                      type="button"
                      title={`Add ${group.label} page`}
                      onClick={() => {
                        handleAddPageForCategory(group.defaultTags);
                        setOpenCategories((prev) => ({ ...prev, [group.key]: true }));
                      }}
                      className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Page list */}
                  {isOpen && (
                    <div className="space-y-0.5 p-1.5">
                      {group.entries.length === 0 ? (
                        <p className="px-2 py-1.5 text-xs text-slate-400 italic">No pages yet.</p>
                      ) : null}
                      {group.entries.map(({ page, idx }) => (
                        <button
                          key={`${page.slug}-${idx}`}
                          type="button"
                          onClick={() => { setPageIndex(idx); setSectionIndex(0); }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, targetIdx: idx });
                          }}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${idx === pageIndex
                              ? "border-slate-300 bg-white text-slate-900"
                              : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                            }`}
                        >
                          {page.title || "Untitled"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add category */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            {newCatForm ? (
              <div className="space-y-2">
                <input
                  autoFocus
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name (e.g. Events)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
                />
                <input
                  value={newCatTag}
                  onChange={(e) => setNewCatTag(e.target.value)}
                  placeholder="Tag (e.g. event)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="flex-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNewCatForm(false); setNewCatName(""); setNewCatTag(""); }}
                    className="flex-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Pages tagged with this tag will appear in this group. Add the same tag to PageList.jsx CATEGORIES to show the group on the public wiki too.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setNewCatForm(true)}
                className="w-full rounded-full border border-dashed border-slate-300 py-1.5 text-xs font-semibold text-slate-400 hover:border-slate-400 hover:text-slate-600"
              >
                + New category
              </button>
            )}
          </div>
        </aside>

        {/* Right-click context menu */}
        {contextMenu ? (
          <div
            ref={contextMenuRef}
            style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleDuplicatePage(contextMenu.targetIdx)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span>⧉</span> Duplicate page
            </button>
          </div>
        ) : null}

        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Page details</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={status === "saving"}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60"
                >
                  {status === "saving" ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={handleDeletePage}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-600"
                >
                  Delete page
                </button>
              </div>
            </div>

            {activePage ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                  <input
                    value={activePage.title}
                    onChange={(event) => updatePage({ title: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Slug
                  <input
                    value={activePage.slug}
                    onChange={(event) => updatePage({ slug: buildSlug(event.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </label>
                <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Summary
                  <textarea
                    value={activePage.summary}
                    onChange={(event) => updatePage({ summary: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                    rows={2}
                  />
                </label>
                <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Icon (emoji or image URL)
                  <input
                    value={activePage.icon}
                    onChange={(event) => updatePage({ icon: event.target.value })}
                    placeholder="🗡️ or https://.../icon.png"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </label>
                <label className="md:col-span-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tags (comma separated)
                  <input
                    value={activePage.tagsText}
                    onChange={(event) => updatePage({ tagsText: event.target.value })}
                    onBlur={(event) => updatePage({ tags: parseTags(event.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                  />
                </label>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Select a page to edit.</p>
            )}

            {activePage ? (
              <div className="mt-6">
                <RequirementsEditor
                  label="Page requirements"
                  value={activePage.requires}
                  onChange={(next) => updatePage({ requires: next })}
                />
              </div>
            ) : null}
          </div>

          {activePage ? (
            <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">Bosses & Items</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addBoss}
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    Add boss
                  </button>
                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Add item
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bosses</p>
                  {activePage.bosses.length === 0 ? (
                    <p className="text-sm text-slate-400">No bosses yet.</p>
                  ) : null}
                  {activePage.bosses.map((boss, idx) => (
                    <div key={`boss-${idx}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Boss {idx + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeBoss(idx)}
                          className="text-xs font-semibold text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 grid gap-3">
                        <input
                          value={boss.id}
                          onChange={(event) => updateBoss(idx, { id: event.target.value })}
                          placeholder="Id (iron_fist)"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <input
                          value={boss.name}
                          onChange={(event) => updateBoss(idx, { name: event.target.value })}
                          placeholder="Name"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <textarea
                          value={boss.description}
                          onChange={(event) => updateBoss(idx, { description: event.target.value })}
                          placeholder="Description"
                          rows={2}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <input
                          value={boss.icon}
                          onChange={(event) => updateBoss(idx, { icon: event.target.value })}
                          placeholder="Icon (emoji or URL)"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stats</p>
                          {(boss.stats || []).map((stat, sIdx) => (
                            <div key={`boss-${idx}-stat-${sIdx}`} className="flex flex-wrap gap-2">
                              <input
                                value={stat.key}
                                onChange={(event) => {
                                  const stats = boss.stats.map((entry, i) =>
                                    i === sIdx ? { ...entry, key: event.target.value } : entry
                                  );
                                  updateBoss(idx, { stats });
                                }}
                                placeholder="Key"
                                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                              />
                              <input
                                value={stat.value}
                                onChange={(event) => {
                                  const stats = boss.stats.map((entry, i) =>
                                    i === sIdx ? { ...entry, value: event.target.value } : entry
                                  );
                                  updateBoss(idx, { stats });
                                }}
                                placeholder="Value"
                                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const stats = boss.stats.filter((_, i) => i !== sIdx);
                                  updateBoss(idx, { stats });
                                }}
                                className="shrink-0 rounded-2xl border border-slate-200 bg-white px-2 text-xs text-slate-500"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateBoss(idx, { stats: [...(boss.stats || []), { key: "", value: "" }] })}
                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                          >
                            Add stat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items</p>
                  {activePage.items.length === 0 ? (
                    <p className="text-sm text-slate-400">No items yet.</p>
                  ) : null}
                  {activePage.items.map((item, idx) => (
                    <div key={`item-${idx}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">Item {idx + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-xs font-semibold text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 grid gap-3">
                        <input
                          value={item.id}
                          onChange={(event) => updateItem(idx, { id: event.target.value })}
                          placeholder="Id (ancient_shard)"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <input
                          value={item.name}
                          onChange={(event) => updateItem(idx, { name: event.target.value })}
                          placeholder="Name"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <textarea
                          value={item.description}
                          onChange={(event) => updateItem(idx, { description: event.target.value })}
                          placeholder="Description"
                          rows={2}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <input
                          value={item.icon}
                          onChange={(event) => updateItem(idx, { icon: event.target.value })}
                          placeholder="Icon (emoji or URL)"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stats</p>
                          {(item.stats || []).map((stat, sIdx) => (
                            <div key={`item-${idx}-stat-${sIdx}`} className="flex flex-wrap gap-2">
                              <input
                                value={stat.key}
                                onChange={(event) => {
                                  const stats = item.stats.map((entry, i) =>
                                    i === sIdx ? { ...entry, key: event.target.value } : entry
                                  );
                                  updateItem(idx, { stats });
                                }}
                                placeholder="Key"
                                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                              />
                              <input
                                value={stat.value}
                                onChange={(event) => {
                                  const stats = item.stats.map((entry, i) =>
                                    i === sIdx ? { ...entry, value: event.target.value } : entry
                                  );
                                  updateItem(idx, { stats });
                                }}
                                placeholder="Value"
                                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const stats = item.stats.filter((_, i) => i !== sIdx);
                                  updateItem(idx, { stats });
                                }}
                                className="shrink-0 rounded-2xl border border-slate-200 bg-white px-2 text-xs text-slate-500"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateItem(idx, { stats: [...(item.stats || []), { key: "", value: "" }] })}
                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                          >
                            Add stat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Sections</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                >
                  Add section
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSection}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-600"
                >
                  Delete section
                </button>
              </div>
            </div>

            {activePage ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
                <div className="space-y-2">
                  {activePage.sections.map((section, idx) => (
                    <button
                      key={`${section.id}-${idx}`}
                      type="button"
                      draggable
                      onDragStart={handleSectionDragStart(idx)}
                      onDragOver={handleSectionDragOver}
                      onDrop={handleSectionDrop(idx)}
                      onDragEnd={handleSectionDragEnd}
                      onClick={() => setSectionIndex(idx)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
                        idx === sectionIndex
                          ? "border-slate-300 bg-white/70 text-slate-900"
                          : "border-transparent bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-white/70 hover:text-slate-900"
                      } ${idx === dragSectionIndex ? "opacity-70" : ""}`}
                    >
                      {section.title || "Untitled"}
                    </button>
                  ))}
                </div>

                {activeSection ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Section title
                        <input
                          value={activeSection.title}
                          onChange={(event) => updateSection({ title: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Section id
                        <input
                          value={activeSection.id}
                          onChange={(event) => updateSection({ id: buildSlug(event.target.value) })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                        />
                      </label>
                    </div>

                    <RequirementsEditor
                      label="Section requirements"
                      value={activeSection.requires}
                      onChange={(next) => updateSection({ requires: next })}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Linked boss
                        <select
                          value={activeSection.bossId}
                          onChange={(event) => updateSection({ bossId: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                        >
                          <option value="">None</option>
                          {activePage.bosses.map((boss) => (
                            <option key={boss.id} value={boss.id}>{boss.name || boss.id}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Linked item
                        <select
                          value={activeSection.itemId}
                          onChange={(event) => updateSection({ itemId: event.target.value })}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                        >
                          <option value="">None</option>
                          {activePage.items.map((item) => (
                            <option key={item.id} value={item.id}>{item.name || item.id}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Section content (Markdown)
                      <textarea
                        value={activeSection.contentMarkdown}
                        onChange={(event) => updateSection({ contentMarkdown: event.target.value })}
                        className="mt-2 h-48 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs text-slate-700"
                      />
                    </label>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
                      <div
                        className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700"
                        dangerouslySetInnerHTML={renderMarkdown(activeSection.contentMarkdown)}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Select a section to edit.</p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Select a page to manage sections.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
