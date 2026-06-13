import React, { useEffect, useState } from "react";
import { API_BASE } from "../config.js";

function renderList(title, items) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">Nothing yet.</p>
      )}
    </div>
  );
}

export default function AccountPanel({ username }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/player/progress`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setError(data?.message || "Unable to load progress.");
          return;
        }
        setProgress(data);
      } catch (err) {
        if (!active) return;
        setError("Unable to load progress.");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {username}</h2>
        <p className="mt-2 text-sm text-slate-600">
          This panel shows what the wiki thinks you have unlocked.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {progress ? (
        <div className="grid gap-4 md:grid-cols-3">
          {renderList("Bosses", progress.bosses)}
          {renderList("Items", progress.items)}
          {renderList("Flags", progress.flags)}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500">
          Loading your progress...
        </div>
      )}
    </div>
  );
}
