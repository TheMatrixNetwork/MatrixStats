import { useEffect, useState } from "react";
import LoginLogoutBtn from "../components/LoginLogoutBtn";

export default function Header({loggedIn, setLoggedIn, setProfile, activePageKey, setActivePageKey, pages}){

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      // Default to dark if no preference is stored; honor explicit 'light'
      if (stored === 'light') return false;
      return true;
    }
    return true; // default dark in non-browser contexts
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return(
    <header
      className={`flex items-center justify-between px-6 py-4 bg-white shadow-sm dark:bg-gray-800 ${
        activePageKey === 'rsvp' ? 'relative z-50' : 'sticky top-0 z-50'
      }`}
    >
      <div className="leading-tight">
        <h1 className="text-xl font-semibold">L.E.F.T.S.</h1>
        <p className="text-sm text-gray-500">Seems to be all that's left</p>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <img src="Logo.png" alt="Site Logo" className="h-24" />
      </div>

      <div className="flex md:hidden">
        <select className="py-2 px-4 rounded-xl dark:bg-gray-900" value={activePageKey} onChange={e => setActivePageKey(e.target.value)}>
          { pages.map(page => <option value={page.key} key={page.key}>{ page.title }</option>) }
        </select>
      </div>

      <div className="flex items-center gap-2">
        <LoginLogoutBtn className={"hidden sm:flex"} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setProfile={setProfile} setActivePageKey={setActivePageKey} />

        <button
          onClick={() => setIsDark((v) => !v)}
          className="ml-3 px-3 py-2 rounded-2xl shadow text-sm font-medium border hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}