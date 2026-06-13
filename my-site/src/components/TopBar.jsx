import React from "react";

export default function TopBar({
  query,
  setQuery,
  session,
  onNavigate,
  onLogout,
  wikiView,
  onToggleWikiView,
}) {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="group flex items-center gap-3 text-left"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <span className="text-xl">M</span>
          </span>
          <span>
            <span className="block text-xs uppercase tracking-[0.3em] text-slate-400">Matrix Network</span>
            <span className="block text-2xl font-semibold text-slate-900">Legends Wiki</span>
          </span>
        </button>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full max-w-md">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mobs, items, landmarks"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-xs text-slate-400">/search</span>
          </div>

          {session.isAdmin ? (
            <button
              type="button"
              onClick={onToggleWikiView}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm"
            >
              {wikiView === "all" ? "View: All" : "View: Self"}
            </button>
          ) : null}

          {session.user ? (
            <div className="flex items-center gap-2">
              {session.isAdmin ? (
                <button
                  type="button"
                  onClick={() => onNavigate("/admin")}
                  className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm"
                >
                  Admin
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onNavigate("/account")}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                {session.user}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
