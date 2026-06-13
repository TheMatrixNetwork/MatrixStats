import { API_BASE } from "../config.js";

export default function LoginLogoutBtn({className, loggedIn, setLoggedIn, setProfile, setActivePageKey}){
  return (
    <button
      onClick={async () => {
        if (loggedIn) {
          await fetch(`${API_BASE}/api/logout`, {
            method: "POST",
            credentials: "include",
          });
          setLoggedIn(false);
          setProfile(null);
          setActivePageKey("home");
        } else {
          setActivePageKey("login");
        }
      }}
      className={`${className} inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 hover:shadow-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 text-nowrap`}
    >
      {loggedIn ? "Log out" : "Log in"}
    </button>
  )
}