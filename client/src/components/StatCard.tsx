interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-1 min-w-[110px] items-center gap-3 rounded-2xl bg-slate-900/70 px-3 py-3 text-xs text-slate-200 shadow-md shadow-sky-900/40 transition-transform duration-150 hover:-translate-y-[2px] hover:shadow-lg">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-lg">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-50">{value}</p>
      </div>
    </div>
  );
}
