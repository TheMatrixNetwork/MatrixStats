import React from "react";
import logo from "../assets/Logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Server Wiki", path: "/server-wiki" },
  { label: "Legends", path: "/legends-wiki" },
  { label: "Store", path: "/store" },
  { label: "Apps", path: "/applications" },
  { label: "Rules", path: "/rules" },
];

export default function SiteNav({ currentPath, onNavigate, session, onLogout }) {
  return (
    <header className="w-full border-b border-slate-800/60 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="flex items-center gap-3 text-left"
        >
          <img
            src={logo}
            alt="Matrix Network"
            className="h-auto w-[200px]"
          />
        </button>

        <nav className="flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`transition ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {session.user ? (
            <>
              {session.isAdmin ? (
                <button
                  type="button"
                  onClick={() => onNavigate("/admin")}
                  className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-amber-800"
                >
                  Admin
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onNavigate("/account")}
                className="rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-200"
              >
                {session.user}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-200"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("/login")}
                className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-200"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
