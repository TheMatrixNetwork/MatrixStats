const profilePage = { key: "profile", title: "Profile", enabled: true, requiresAuth: true };
const loginPage   = { key: "login",   title: "Log In",  enabled: true, requiresAuth: false };

function Tab({page, loggedIn, activePageKey, setActivePageKey}){
  const isActive = page.key === activePageKey;
  const disabled = !page.enabled;

  return (
    <button
      onClick={() => {
        if (page.requiresAuth && !loggedIn) {
          // any auth-required tab clicked while logged out -> jump to login
          setActivePageKey("login");

        } else if (!disabled) {
          setActivePageKey(page.key);
        }
      }}
      aria-disabled={disabled}
      className={`px-4 py-2 rounded-xl border text-sm font-medium transition select-none
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow"}
          ${isActive && !disabled ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200" : "bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"}
        `}
      title={disabled ? "Page disabled" : page.requiresAuth ? "May require login" : page.title}
    >
      <span className="inline-flex items-center gap-1">
        {page.title}
        {page.requiresAuth && <span aria-hidden className="text-xs">🔒</span>}
      </span>
    </button>
  );
}

export default function Tabs({loggedIn, pages, activePageKey, setActivePageKey}){
  const allPages = [...pages];
  allPages.push(loggedIn ? profilePage : loginPage);

  const tabs = allPages.map(p => {
    return <Tab page={p} loggedIn={loggedIn} activePageKey={activePageKey} setActivePageKey={setActivePageKey} key={p.key} />
  })

  return (
    <nav className="hidden md:block mx-auto mt-6 w-full max-w-5xl px-6">
      <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow dark:bg-gray-800 dark:border dark:border-gray-700">
        { tabs }
      </div>
    </nav>
  )
}