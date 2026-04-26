import React from "react";

export default function DashboardCommandCenter() {
  const actions = [
    { title: "Fix missing meta descriptions", desc: "12 pages affected • SEO impact high" },
    { title: "Compress hero images", desc: "2.8MB savings • Performance boost" },
    { title: "Resolve broken links", desc: "5 broken URLs detected" },
  ];

  const services = [
    { name: "Backend API", status: "Online" },
    { name: "Audit Engine", status: "Online" },
    { name: "Pagespeed", status: "Standby" },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
      {/* Left (2 cols) */}
      <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/90">Command Center</h3>
          <span className="text-xs text-white/50">Last 7 days</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/60">Score trend</p>
            <div className="mt-2 h-16 rounded-lg border border-white/10 bg-black/20" />
            <p className="mt-2 text-xs text-white/50">Sparkline placeholder (branch later)</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/60">Recent analyses</p>
            <ul className="mt-2 space-y-2 text-xs text-white/70">
              <li>• Homepage audit completed</li>
              <li>• Performance scan saved</li>
              <li>• Keyword audit updated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right (1 col) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <h3 className="text-sm font-semibold text-white/90">Recommended actions</h3>
        <div className="mt-3 space-y-3">
          {actions.map((a) => (
            <div key={a.title} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-sm text-white/90">{a.title}</p>
              <p className="mt-1 text-xs text-white/60">{a.desc}</p>
              <button className="mt-3 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/90 hover:bg-white/15">
                Open
              </button>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold text-white/90">Services</h3>
        <div className="mt-3 space-y-2">
          {services.map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <span className="text-xs text-white/70">{s.name}</span>
              <span className="text-xs text-emerald-300">{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
