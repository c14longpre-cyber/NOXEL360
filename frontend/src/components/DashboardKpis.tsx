import React from "react";

type Kpi = {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  badge?: string;
};

const TrendIcon = ({ t }: { t?: Kpi["trend"] }) => {
  if (t === "up") return <span className="text-emerald-400">▲</span>;
  if (t === "down") return <span className="text-rose-400">▼</span>;
  if (t === "flat") return <span className="text-slate-400">•</span>;
  return null;
};

export default function DashboardKpis() {
  const kpis: Kpi[] = [
    { label: "Global Score", value: "92", sub: "+3 this week", trend: "up", badge: "Excellent" },
    { label: "Performance", value: "Good", sub: "LCP 2.1s • INP 160ms", trend: "flat" },
    { label: "SEO Health", value: "7 issues", sub: "2 critical", trend: "down", badge: "Attention" },
    { label: "Audience Reach", value: "—", sub: "Atlas soon", trend: "flat" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">{k.label}</p>
            <div className="flex items-center gap-2">
              <TrendIcon t={k.trend} />
              {k.badge ? (
                <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-white/80">
                  {k.badge}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {k.value}
          </div>
          {k.sub ? <p className="mt-1 text-xs text-white/60">{k.sub}</p> : null}
        </div>
      ))}
    </div>
  );
}
