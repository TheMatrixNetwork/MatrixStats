import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { API_BASE } from "./config.js";
import SiteNav from "./components/SiteNav.jsx";
import PageList from "./components/PageList.jsx";
import WikiPage from "./components/WikiPage.jsx";
import LoginCard from "./components/LoginCard.jsx";
import AccountPanel from "./components/AccountPanel.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ServerWikiHome from "./components/serverWiki/ServerWikiHome.jsx";
import ServerWikiSwordsman from "./components/serverWiki/ServerWikiSwordsman.jsx";
import ServerWikiVampire from "./components/serverWiki/ServerWikiVampire.jsx";
import ServerWikiArbalist from "./components/serverWiki/ServerWikiArbalist.jsx";
import ServerWikiEidolon from "./components/serverWiki/ServerWikiEidolon.jsx";
import ServerWikiPriest from "./components/serverWiki/ServerWikiPriest.jsx";
import ServerWikiJuggernaut from "./components/serverWiki/ServerWikiJuggernaut.jsx";
import ServerWikiDevourer from "./components/serverWiki/ServerWikiDevourer.jsx";
import ServerWikiFiremage from "./components/serverWiki/ServerWikiFiremage.jsx";
import ServerWikiMage from "./components/serverWiki/ServerWikiMage.jsx";
import ServerWikiStats from "./components/serverWiki/ServerWikiStats.jsx";
import ServerWikiPrestige from "./components/serverWiki/ServerWikiPrestige.jsx";

export default function App() {
  const [path, setPath] = useState(window.location.pathname || "/");
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [session, setSession] = useState({ status: "loading", user: null, isAdmin: false });
  const [loginError, setLoginError] = useState("");
  const [wikiView, setWikiView] = useState("self");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("wikiView");
    if (stored === "all" || stored === "self") {
      setWikiView(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("wikiView", wikiView);
  }, [wikiView]);

  const navigate = (nextPath) => {
    if (nextPath === path) return;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const route = useMemo(() => {
    if (path === "/login") return { view: "login" };
    if (path === "/account") return { view: "account" };
    if (path === "/admin") return { view: "admin" };
    if (path === "/rules") return { view: "rules" };
    if (path === "/store") return { view: "store" };
    if (path === "/applications") return { view: "applications" };
    if (path === "/server-wiki") return { view: "serverWiki" };
    if (path === "/server-wiki/swordsman") return { view: "serverWikiSwordsman" };
    if (path === "/server-wiki/vampire") return { view: "serverWikiVampire" };
    if (path === "/server-wiki/arbalist") return { view: "serverWikiArbalist" };
    if (path === "/server-wiki/eidolon") return { view: "serverWikiEidolon" };
    if (path === "/server-wiki/priest") return { view: "serverWikiPriest" };
    if (path === "/server-wiki/juggernaut") return { view: "serverWikiJuggernaut" };
    if (path === "/server-wiki/devourer") return { view: "serverWikiDevourer" };
    if (path === "/server-wiki/firemage") return { view: "serverWikiFiremage" };
    if (path === "/server-wiki/mage") return { view: "serverWikiMage" };
    if (path === "/server-wiki/stats") return { view: "serverWikiStats" };
    if (path === "/server-wiki/prestige") return { view: "serverWikiPrestige" };
    if (path === "/legends-wiki" || path === "/wiki") return { view: "legendsWiki" };
    if (path.startsWith("/legends-wiki/")) {
      const slug = path.replace("/legends-wiki/", "");
      return { view: "legendsPage", slug };
    }
    if (path.startsWith("/wiki/")) {
      const slug = path.replace("/wiki/", "");
      return { view: "legendsPage", slug };
    }
    return { view: "home" };
  }, [path]);

  const isLegendsRoute = route.view === "legendsWiki" || route.view === "legendsPage";
  const legendsLoading = isLegendsRoute && session.status === "loading";
  const legendsLocked = isLegendsRoute && session.status === "ready" && !session.user;

  const loadSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/session`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setSession({ status: "ready", user: data.user, isAdmin: Boolean(data.isAdmin) });
      } else {
        setSession({ status: "ready", user: null, isAdmin: false });
      }
    } catch (err) {
      setSession({ status: "ready", user: null, isAdmin: false });
    }
  };

  const loadPages = async () => {
    try {
      const viewParam = session.isAdmin && wikiView === "all" ? "?view=all" : "";
      const res = await fetch(`${API_BASE}/api/wiki/pages${viewParam}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const allPages = data.pages || [];
        setPages(allPages.filter((page) => !String(page.slug || "").startsWith("skills-")));
      }
    } catch (err) {
      setPages([]);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    loadPages();
  }, [session.user, session.isAdmin, wikiView]);

  const handleLogin = async ({ username, password, remember }) => {
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.message || "Login failed.");
        return;
      }
      setSession({ status: "ready", user: data.user, isAdmin: Boolean(data.isAdmin) });
      navigate("/");
    } catch (err) {
      setLoginError("Login failed.");
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setSession({ status: "ready", user: null, isAdmin: false });
    navigate("/");
  };

  return (
    <div className="wiki-shell min-h-screen">
      <div className="wiki-overlay" aria-hidden="true" />
      <div className="wiki-content">
        <SiteNav
          currentPath={path}
          onNavigate={navigate}
          session={session}
          onLogout={handleLogout}
        />

        <main className="w-full px-4 pb-16 pt-6">
          <div className="mx-auto grid w-full max-w-none gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block" />
            <div>
              {route.view === "home" && (
                <section className="fade-in space-y-10">
                  <div className="rounded-[32px] bg-white/80 p-10 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Matrix Network</p>
                    <h1 className="mt-4 text-5xl font-semibold text-slate-900 sm:text-6xl">
                      Matrix Network
                    </h1>
                    <p className="mt-4 max-w-3xl text-xl text-slate-600">
                      A lore-driven Minecraft network built for competitive raids, cinematic boss fights,
                      and community events. Join seasonal campaigns, unlock relics, and climb the leaderboards.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      <span className="rounded-full bg-slate-100 px-4 py-2">IP: matrixnetwork.org</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2">1.21.11</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2">Kingdoms</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2">Quests</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2">Custom Classes</span>
                      <span className="rounded-full bg-slate-100 px-4 py-2">Combat Evolved</span>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <a
                        href="https://discord.gg/BqFqApXuuY"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-[linear-gradient(135deg,#5865F2,#7C8CFF)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M20.3 4.4A19.6 19.6 0 0 0 15.7 3l-.2.4c1.7.4 2.5 1 3.5 1.8A17 17 0 0 0 5 5.3c1-.8 1.8-1.4 3.5-1.8L8.3 3a19.6 19.6 0 0 0-4.6 1.4C1.8 8 1.3 11.4 1.5 14.8c1.5 1.1 3 1.8 4.5 2.2.4-.6.8-1.3 1.1-2-1.1-.4-2.1-1-3-1.7l.7-.5c2.7 1.3 5.4 2 8.2 2s5.5-.7 8.2-2l.7.5c-.9.7-1.9 1.3-3 1.7.3.7.7 1.4 1.1 2 1.5-.4 3-1.1 4.5-2.2.2-3.4-.3-6.8-1.6-10.4Zm-12 8.2c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm7.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
                          </svg>
                        </span>
                        Join Discord
                      </a>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
                      <h2 className="text-2xl font-semibold text-slate-900">Latest Announcements</h2>
                      <div className="mt-5 space-y-4 text-sm text-slate-600">
                        <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Season 44</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">1 Week Open Beta June 5th</h3>
                          <p className="mt-2">
                            The Server's Open beta has begun! Join to help us iron out the remaining kinks for the real deal next friday!
                          </p>
                        </article>
                        <article className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Update</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">Skills Overhaul</h3>
                          <p className="mt-2">
                            Check out the Server Wiki for deets on the changes to Skills this season!
                          </p>
                        </article>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
                      <h2 className="text-2xl font-semibold text-slate-900">Quick Info</h2>
                      <ul className="mt-5 space-y-3 text-sm text-slate-600">
                        <li>Regular events incoming!</li>
                        <li>Join the Discord for the latest announcements.</li>
                        <li>Applications will open soon!</li>
                        <li>More site features to come, stay tuned folks</li>
                      </ul>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => navigate("/applications")}
                          className="rounded-full bg-sky-300 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-sky-200"
                        >
                          Apply Now
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/rules")}
                          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300"
                        >
                          View Rules
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {route.view === "serverWiki" && (
                <ServerWikiHome onNavigate={navigate} />
              )}

              {route.view === "serverWikiSwordsman" && (
                <ServerWikiSwordsman onNavigate={navigate} />
              )}

              {route.view === "serverWikiVampire" && (
                <ServerWikiVampire onNavigate={navigate} />
              )}

              {route.view === "serverWikiArbalist" && (
                <ServerWikiArbalist onNavigate={navigate} />
              )}

              {route.view === "serverWikiEidolon" && (
                <ServerWikiEidolon onNavigate={navigate} />
              )}

              {route.view === "serverWikiPriest" && (
                <ServerWikiPriest onNavigate={navigate} />
              )}

              {route.view === "serverWikiJuggernaut" && (
                <ServerWikiJuggernaut onNavigate={navigate} />
              )}

              {route.view === "serverWikiDevourer" && (
                <ServerWikiDevourer onNavigate={navigate} />
              )}

              {route.view === "serverWikiFiremage" && (
                <ServerWikiFiremage onNavigate={navigate} />
              )}

              {route.view === "serverWikiMage" && (
                <ServerWikiMage onNavigate={navigate} />
              )}

              {route.view === "serverWikiStats" && (
                <ServerWikiStats onNavigate={navigate} />
              )}

              {route.view === "serverWikiPrestige" && (
                <ServerWikiPrestige onNavigate={navigate} />
              )}

              {legendsLoading && (
                <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">
                  <p className="text-sm text-slate-600">Loading...</p>
                </div>
              )}

              {legendsLocked && (
                <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network Wiki</p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900">You must be logged in to view this page</h1>
                  <p className="mt-3 max-w-2xl text-base text-slate-600">
                    The Legends wiki is restricted to logged-in players.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-6 rounded-full bg-slate-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900"
                  >
                    Go to login
                  </button>
                </div>
              )}

              {!legendsLoading && !legendsLocked && route.view === "legendsWiki" && (
                <section className="fade-in space-y-8">
                  <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network Wiki</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Legends Wiki</h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                      Explore mobs, items, and hidden mechanics. Certain pages reveal only after you defeat
                      bosses or claim rare relics in-game.
                    </p>
                    <div className="mt-5 max-w-md">
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search mobs, items, landmarks"
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <PageList pages={pages} query={query} onOpen={(slug) => navigate(`/legends-wiki/${slug}`)} />
                </section>
              )}

              {route.view === "rules" && (
                <section className="fade-in space-y-8">
                  <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Server Rules</h1>
                    <p className="mt-3 max-w-2xl text-base text-slate-600">
                      Keep Matrix Network safe and competitive. Breaking these rules can lead to mutes,
                      suspensions, or permanent bans.
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-slate-900">Community Conduct</h2>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li>Be respectful: no harassment, hate speech, or targeted abuse.</li>
                        <li>No spamming or advertising other servers without permission.</li>
                        <li>Keep chat clean: avoid excessive caps and disruptive language.</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-slate-900">Gameplay Integrity</h2>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li>No hacked clients, unfair mods, or automation tools.</li>
                        <li>Do not exploit bugs; report them to staff instead.</li>
                        <li>Alt accounts used to evade punishments are prohibited.</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-slate-900">Raids & Economy</h2>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li>Scamming is allowed, viewer discretion is advised.</li>
                        <li>Boosting leaderboards with alts is not allowed.</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-slate-900">Staff & Appeals</h2>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li>Follow staff instructions during investigations.</li>
                        <li>Use the appeal process respectfully and once per case.</li>
                        <li>Misuse of support channels can lead to restrictions.</li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {route.view === "store" && (
                <section className="fade-in space-y-6">
                  <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Store</h1>
                    <p className="mt-3 text-sm text-slate-600">
                      The Matrix Network store is coming soon.
                    </p>
                  </div>
                </section>
              )}

              {route.view === "applications" && (
                <section className="fade-in space-y-6">
                  <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Matrix Network</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Applications</h1>
                    <p className="mt-3 text-sm text-slate-600">
                      Staff applications will open soon. Keep an eye on announcements.
                    </p>
                  </div>
                </section>
              )}

              {!legendsLoading && !legendsLocked && route.view === "legendsPage" && (
                <WikiPage
                  slug={route.slug}
                  onBack={() => navigate("/legends-wiki")}
                  wikiView={wikiView}
                  isAdmin={session.isAdmin}
                />
              )}

              {route.view === "login" && (
                <LoginCard onLogin={handleLogin} error={loginError} />
              )}

              {route.view === "account" && session.user && (
                <AccountPanel username={session.user} />
              )}

              {route.view === "account" && !session.user && (
                <div className="rounded-3xl bg-white/80 p-8 text-center text-sm text-slate-600">
                  You are not logged in. Log in to see your unlocks.
                </div>
              )}

              {route.view === "admin" && session.isAdmin && (
                <AdminPanel />
              )}

              {route.view === "admin" && !session.isAdmin && (
                <div className="rounded-3xl bg-white/80 p-8 text-center text-sm text-slate-600">
                  You do not have admin access.
                </div>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
