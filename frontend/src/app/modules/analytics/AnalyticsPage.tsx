export default function NoxelAnalyticsModulePage() {
  const kpis = [
    {
      label: "Active sessions",
      value: "12,480",
      delta: "+8.4%",
      hint: "vs last 7 days",
    },
    {
      label: "Engagement rate",
      value: "64.2%",
      delta: "+3.1%",
      hint: "quality traffic signal",
    },
    {
      label: "Conversion intent",
      value: "28.7%",
      delta: "+5.6%",
      hint: "high-intent visitors",
    },
    {
      label: "Revenue influence",
      value: "$18,940",
      delta: "+12.9%",
      hint: "tracked impact",
    },
  ];

  const channels = [
    { name: "Organic Search", share: 38, trend: "+6.2%", quality: "High" },
    { name: "Direct", share: 24, trend: "+2.4%", quality: "Medium" },
    { name: "Social", share: 16, trend: "+9.8%", quality: "High" },
    { name: "Referral", share: 12, trend: "-1.1%", quality: "Medium" },
    { name: "Paid", share: 10, trend: "+4.0%", quality: "High" },
  ];

  const pages = [
    {
      page: "/",
      visitors: "5,420",
      engagement: "72%",
      intent: "High",
      action: "Refine hero CTA",
    },
    {
      page: "/pricing",
      visitors: "2,980",
      engagement: "68%",
      intent: "Very High",
      action: "Add trust strip",
    },
    {
      page: "/seo",
      visitors: "1,740",
      engagement: "61%",
      intent: "High",
      action: "Strengthen comparison section",
    },
    {
      page: "/contact",
      visitors: "820",
      engagement: "55%",
      intent: "Medium",
      action: "Shorten form flow",
    },
  ];

  const insights = [
    {
      title: "Audience quality is rising",
      text: "Organic and social are both sending stronger engagement than last week, suggesting your top-funnel messaging is aligning better with intent.",
      priority: "Core insight",
    },
    {
      title: "Pricing page has the strongest intent",
      text: "Visitors reaching pricing are highly engaged but still drop before action. This is a strong opportunity for trust, proof, and CTA optimization.",
      priority: "Revenue opportunity",
    },
    {
      title: "Referral traffic needs review",
      text: "Referral volume remains useful, but quality is softer than your main acquisition channels. Review source relevance before scaling it.",
      priority: "Optimization target",
    },
  ];

  const behaviorFlow = [
    { stage: "Visit", value: "12.4k", width: "100%" },
    { stage: "Engaged", value: "8.0k", width: "74%" },
    { stage: "Intent detected", value: "3.6k", width: "48%" },
    { stage: "Action started", value: "1.5k", width: "30%" },
    { stage: "Conversion", value: "480", width: "16%" },
  ];

  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:px-8">
        <header className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(60,222,106,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(112,42,165,0.24),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3CDE6A]/30 bg-[#3CDE6A]/10 px-3 py-1 text-sm text-[#baf7cb]">
                <span className="h-2 w-2 rounded-full bg-[#3CDE6A]" />
                NOXEL ANALYTICS · PRO
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Performance, behavior, and business insight layer
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Measure what visitors do, understand why they act, and surface the next
                best decisions across traffic, engagement, conversion, and revenue.
              </p>
            </div>

            <div className="grid min-w-[280px] grid-cols-2 gap-3 sm:min-w-[340px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Mode</div>
                <div className="mt-2 text-lg font-semibold">Executive View</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Window</div>
                <div className="mt-2 text-lg font-semibold">Last 7 days</div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur"
            >
              <div className="text-sm text-white/55">{item.label}</div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="text-3xl font-semibold tracking-tight">{item.value}</div>
                <div className="rounded-full border border-[#3CDE6A]/25 bg-[#3CDE6A]/10 px-3 py-1 text-sm text-[#bdf5cb]">
                  {item.delta}
                </div>
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
                {item.hint}
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Behavior funnel</h2>
                <p className="mt-1 text-sm text-white/60">
                  High-level movement from visit to conversion.
                </p>
              </div>
              <div className="rounded-full border border-[#702AA5]/35 bg-[#702AA5]/15 px-3 py-1 text-sm text-[#dfc6f5]">
                Intent tracking enabled
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {behaviorFlow.map((item, index) => (
                <div key={item.stage}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/78">
                      {index + 1}. {item.stage}
                    </span>
                    <span className="text-white/55">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3CDE6A] to-[#702AA5]"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold">AI insight stream</h2>
            <p className="mt-1 text-sm text-white/60">
              Priority observations detected from recent behavior.
            </p>

            <div className="mt-5 space-y-4">
              {insights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="mb-2 inline-flex rounded-full border border-[#3CDE6A]/25 bg-[#3CDE6A]/10 px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-[#baf7cb]">
                    {item.priority}
                  </div>
                  <div className="text-base font-semibold">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Channel mix</h2>
                <p className="mt-1 text-sm text-white/60">
                  Acquisition quality by source.
                </p>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
                Compare periods
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {channels.map((channel) => (
                <div key={channel.name} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      <div className="mt-1 text-sm text-white/55">Quality: {channel.quality}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{channel.share}%</div>
                      <div className="text-sm text-[#bdf5cb]">{channel.trend}</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[#3CDE6A]"
                      style={{ width: `${channel.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Top pages</h2>
                <p className="mt-1 text-sm text-white/60">
                  Page performance with action-oriented guidance.
                </p>
              </div>
              <button className="rounded-full border border-[#702AA5]/30 bg-[#702AA5]/12 px-4 py-2 text-sm text-[#e5d1f6] transition hover:bg-[#702AA5]/20">
                Open page intelligence
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_1fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/45">
                <div>Page</div>
                <div>Visitors</div>
                <div>Engagement</div>
                <div>Intent</div>
                <div>Suggested action</div>
              </div>

              {pages.map((row) => (
                <div
                  key={row.page}
                  className="grid grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_1fr] gap-3 border-b border-white/10 px-4 py-4 text-sm last:border-b-0"
                >
                  <div className="font-medium text-white/92">{row.page}</div>
                  <div className="text-white/72">{row.visitors}</div>
                  <div className="text-white/72">{row.engagement}</div>
                  <div>
                    <span className="rounded-full border border-[#3CDE6A]/25 bg-[#3CDE6A]/10 px-2.5 py-1 text-xs text-[#baf7cb]">
                      {row.intent}
                    </span>
                  </div>
                  <div className="text-white/65">{row.action}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="text-sm text-white/55">Smart recommendation</div>
            <div className="mt-3 text-lg font-semibold">Connect Analytics → SEO</div>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Use engagement and intent patterns to prioritize pages that deserve deeper SEO
              action first.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="text-sm text-white/55">Smart recommendation</div>
            <div className="mt-3 text-lg font-semibold">Connect Analytics → CRM</div>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Send high-intent visitors into audience segments and lifecycle flows once CRM is
              active.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="text-sm text-white/55">Smart recommendation</div>
            <div className="mt-3 text-lg font-semibold">Connect Analytics → Maestro</div>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Let Maestro turn insights into suggested actions, tasks, and module handoffs.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
