/** Skeleton loader block with pulse animation. */
export function SkeletonLoader({ className = "h-6 w-full" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-700/60 ${className}`}
    />
  );
}
