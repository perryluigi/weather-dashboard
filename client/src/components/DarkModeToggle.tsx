import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-700 shadow-sm shadow-sky-200/40 transition-colors duration-300 hover:border-sky-400/80 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-sky-900/40"
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-base transition-transform duration-300 ${
          dark ? "rotate-0" : "rotate-180"
        }`}
      >
        {dark ? "🌙" : "☀️"}
      </span>
      <span>{dark ? "Dark" : "Light"} mode</span>
    </button>
  );
}
