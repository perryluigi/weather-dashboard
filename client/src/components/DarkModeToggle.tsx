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
      className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 shadow-sm shadow-sky-900/40 transition-colors duration-300 hover:border-sky-400/80"
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
