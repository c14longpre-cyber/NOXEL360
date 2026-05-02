/**
 * NOXEL SEO — Module Page
 * Intégré dans NOXEL360 sur /app/seo
 * Reprend l'UI complète du NOXEL SEO standalone
 */

import React, { useEffect, useMemo, useState } from "react";
import noxelSeoLogo from "@/assets/logos/seo/noxel-seo.svg";
import "@/styles/seo-module.css";

/* =========================================================
   API — pointe vers le backend NOXEL360 sur /api/seo
   ========================================================= */

const API_BASE = "/api/seo";

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.error || JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function getHealth() {
  return apiGet<HealthState>("/health");
}

async function getWebsiteVM(url: string) {
  return apiGet<{ ok: boolean; website: WebsiteVM }>(
    `/vm/summary?url=${encodeURIComponent(url)}`
  );
}

async function getIssues(url: string) {
  return apiGet<{ ok: boolean; issues: IssuesPayload }>(
    `/issues?url=${encodeURIComponent(url)}`
  );
}

/* =========================================================
   Types
   ========================================================= */

type HealthState = {
  ok?: boolean;
  status: string;
  service: string;
  uptimeSec?: number;
  timestamp?: string;
};

type WebsiteVM = {
  url: string;
  status: string;
  healthScore: number;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  seoModules: {
    scn: number;
    orbit: number;
    schema: number;
    crawl: number;
  };
  issuesCount: { critical: number; warning: number; info: number };
  lastScan: string | null;
  runId: string | null;
};

type Summary = {
  ok?: boolean;
  url?: string;
  globalScore: number | null;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  seoModules?: {
    scn: number;
    orbit: number;
    schema: number;
    crawl: number;
  };
  issues: { critical: number; warning: number; info: number };
  lastScan: string | null;
};

type IssueItem = {
  id: string;
  title: string;
  why: string;
  impact: string;
  fix: string;
  area?: string;
  severity?: "critical" | "warning" | "info" | string;
  weight?: number;
};

type IssuesPayload = {
  critical: IssueItem[];
  warning: IssueItem[];
  info: IssueItem[];
};

type DetailKey =
  | "global"
  | "performance"
  | "accessibility"
  | "bestPractices"
  | "seo"
  | "seo.scn"
  | "seo.orbit"
  | "seo.schema"
  | "seo.crawl"
  | "critical"
  | "warning"
  | "info"
  | null;

/* =========================================================
   Theme
   ========================================================= */

const THEME = {
  pageBg: "#0b0b10",
  panelBorder: "rgba(216, 212, 223, 0.18)",
  cardBg: "rgba(255,255,255,0.06)",
  cardText: "rgba(255,255,255,0.92)",
  cardMuted: "rgba(255,255,255,0.62)",
  hoverGlow: "0 20px 34px rgba(153, 89, 255, 0.55)",
  selectedGlow: "0 22px 38px rgba(40, 255, 120, 0.45)",
  innerShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
  tealPanelSolid: "rgba(24, 178, 183, 0.92)",
};

/* =========================================================
   Helpers
   ========================================================= */

function scoreColor(score?: number) {
  if (score == null) return "#999";
  if (score >= 85) return "#1b7f3b";
  if (score >= 70) return "#c77700";
  return "#b00020";
}

function clampUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return "https://" + v;
}

function makeId() {
  try {
    if ((crypto as any)?.randomUUID) return (crypto as any).randomUUID();
  } catch {}
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function normalizeIssuesPayload(raw: any): IssuesPayload {
  const empty: IssuesPayload = { critical: [], warning: [], info: [] };
  if (!raw) return empty;

  if (Array.isArray(raw.critical) && Array.isArray(raw.warning) && Array.isArray(raw.info)) {
    return raw as IssuesPayload;
  }

  const list =
    (Array.isArray(raw) ? raw : null) ??
    (Array.isArray(raw.issues) ? raw.issues : null) ??
    (Array.isArray(raw.items) ? raw.items : null) ??
    null;

  if (!list) return empty;

  const out: IssuesPayload = { critical: [], warning: [], info: [] };
  for (const it of list) {
    const sev = String(it?.severity ?? it?.level ?? "info").toLowerCase();
    const item: IssueItem = {
      id: String(it?.id ?? makeId()),
      title: String(it?.title ?? "Issue"),
      why: String(it?.why ?? ""),
      impact: String(it?.impact ?? ""),
      fix: String(it?.fix ?? ""),
      severity: sev,
      area: it?.area,
      weight: it?.weight,
    };
    if (sev === "critical" || sev === "high") out.critical.push(item);
    else if (sev === "warning" || sev === "medium") out.warning.push(item);
    else out.info.push(item);
  }
  return out;
}

function websiteToSummary(vm: WebsiteVM | null): Summary | null {
  if (!vm) return null;
  return {
    ok: true,
    url: vm.url,
    globalScore: vm.healthScore ?? null,
    performance: vm.scores?.performance ?? 0,
    accessibility: vm.scores?.accessibility ?? 0,
    bestPractices: vm.scores?.bestPractices ?? 0,
    seo: vm.scores?.seo ?? 0,
    seoModules: {
      scn: vm.seoModules?.scn ?? 0,
      orbit: vm.seoModules?.orbit ?? 0,
      schema: vm.seoModules?.schema ?? 0,
      crawl: vm.seoModules?.crawl ?? 0,
    },
    issues: {
      critical: vm.issuesCount?.critical ?? 0,
      warning: vm.issuesCount?.warning ?? 0,
      info: vm.issuesCount?.info ?? 0,
    },
    lastScan: vm.lastScan ?? null,
  };
}

/* =========================================================
   Sub-components
   ========================================================= */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.82)",
        fontWeight: 950,
        opacity: 0.8,
        marginBottom: 8,
        letterSpacing: 0.6,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function TinyPill({ label, value, dot }: { label: string; value: number | string; dot: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 14,
        border: "2px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.04)",
        color: THEME.cardText,
        fontSize: 13,
        fontWeight: 900,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span style={{ color: THEME.cardMuted, fontSize: 11, textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontWeight: 950 }}>{value}</span>
    </span>
  );
}

function Card({
  title,
  value,
  subtitle,
  onClick,
  active,
  kind = "score",
  full,
  slim,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  onClick?: () => void;
  active?: boolean;
  kind?: "score" | "count";
  full?: boolean;
  slim?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const numVal = typeof value === "number" ? value : undefined;
  const color = kind === "score" ? scoreColor(numVal) : THEME.cardText;

  const baseShadow = `${THEME.innerShadow}, 0 14px 26px rgba(0,0,0,0.28)`;
  const boxShadow = active
    ? `${THEME.innerShadow}, ${THEME.selectedGlow}, 0 16px 32px rgba(0,0,0,0.35)`
    : hover
    ? `${THEME.innerShadow}, ${THEME.hoverGlow}, 0 16px 32px rgba(0,0,0,0.35)`
    : baseShadow;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: full ? "1 / -1" : undefined,
        borderRadius: 18,
        padding: slim ? "12px 14px" : "16px 18px",
        border: active
          ? "2px solid rgba(40,255,120,0.45)"
          : "1px solid rgba(255,255,255,0.10)",
        background: active ? "rgba(255,255,255,0.08)" : THEME.cardBg,
        cursor: onClick ? "pointer" : "default",
        boxShadow,
        transition: "box-shadow 160ms ease, transform 140ms ease, background 160ms ease",
        transform: active || hover ? "translateY(-2px)" : "translateY(0px)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: THEME.cardMuted,
          opacity: 0.9,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: slim ? 20 : 38,
          fontWeight: 980,
          color,
          lineHeight: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11, color: THEME.cardMuted, opacity: 0.75 }}>{subtitle}</div>
      )}
    </div>
  );
}

function IssueCard({ it, sevColor }: { it: IssueItem; sevColor: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background: "rgba(0,0,0,0.22)",
        boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.10), 0 0 0 2px ${sevColor}33`,
      }}
    >
      <div style={{ fontWeight: 980, fontSize: 16, color: THEME.cardText }}>
        {it.title}
      </div>
      <div
        style={{ marginTop: 10, fontSize: 14, color: THEME.cardMuted, lineHeight: 1.45 }}
      >
        {it.why && (
          <div>
            <b style={{ color: THEME.cardText }}>Why:</b> {it.why}
          </div>
        )}
        {it.fix && (
          <div style={{ marginTop: 8 }}>
            <b style={{ color: THEME.cardText }}>Fix:</b> {it.fix}
          </div>
        )}
        {it.impact && (
          <div style={{ marginTop: 8, opacity: 0.9 }}>
            <b style={{ color: THEME.cardText }}>Impact:</b> {it.impact}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Main Component
   ========================================================= */

export default function SeoModulePage() {
  const [health, setHealth] = useState<HealthState | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [issues, setIssues] = useState<IssuesPayload | null>(null);
  const [selected, setSelected] = useState<DetailKey>(null);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("https://noxel360.com/");
  const [targetLabel, setTargetLabel] = useState("(local)");

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async (url?: string) => {
    setLoading(true);
    setErr(null);
    const target = clampUrl(url ?? urlInput);
    try {
      const [h, vm, iss] = await Promise.all([
        getHealth(),
        getWebsiteVM(target),
        getIssues(target),
      ]);
      setHealth(h);
      setSummary(websiteToSummary(vm.website));
      setIssues(normalizeIssuesPayload(iss.issues));
      setTargetLabel(target || "(local)");
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const scanUrl = async () => {
    const url = clampUrl(urlInput);
    if (!url) return;
    setScanLoading(true);
    setErr(null);
    try {
      const [vm, iss, h] = await Promise.all([
        getWebsiteVM(url),
        getIssues(url),
        getHealth(),
      ]);
      setSummary(websiteToSummary(vm.website));
      setIssues(normalizeIssuesPayload(iss.issues));
      setHealth(h);
      setTargetLabel(url);
    } catch (e: any) {
      setErr(e?.message || "Scan failed.");
    } finally {
      setScanLoading(false);
    }
  };

  const scoreMeta = useMemo(() => {
    if (!summary) return null;
    type ScoreKey = Exclude<DetailKey, "critical" | "warning" | "info" | null>;
    const map: Record<ScoreKey, { label: string; value: number; desc: string }> = {
      global: { label: "Global score", value: summary.globalScore ?? 0, desc: "Overall quality signal (mix of categories)." },
      performance: { label: "Performance", value: summary.performance ?? 0, desc: "Speed & loading efficiency." },
      accessibility: { label: "Accessibility", value: summary.accessibility ?? 0, desc: "Usability for all users (ARIA, contrast, etc.)." },
      bestPractices: { label: "Best Practices", value: summary.bestPractices ?? 0, desc: "Modern web best practices & safety checks." },
      seo: { label: "SEO", value: summary.seo ?? 0, desc: "Indexing & metadata fundamentals." },
      "seo.scn": { label: "SEO SCN", value: summary.seoModules?.scn ?? 0, desc: "Semantic content network and topical structure." },
      "seo.orbit": { label: "SEO Orbit", value: summary.seoModules?.orbit ?? 0, desc: "Authority, context, and ranking ecosystem signals." },
      "seo.schema": { label: "SEO Schema", value: summary.seoModules?.schema ?? 0, desc: "Structured data quality and entity markup coverage." },
      "seo.crawl": { label: "SEO Crawl", value: summary.seoModules?.crawl ?? 0, desc: "Crawlability, discoverability, and index path quality." },
    };
    return map;
  }, [summary]);

  const isScoreKey = (k: DetailKey): k is Exclude<DetailKey, "critical" | "warning" | "info" | null> =>
    k !== null && k !== "critical" && k !== "warning" && k !== "info";

  const isSeverityKey = (k: DetailKey): k is "critical" | "warning" | "info" =>
    k === "critical" || k === "warning" || k === "info";

  const selectedIssuesList = useMemo(() => {
    if (!issues || !isSeverityKey(selected)) return [];
    return (issues as any)[selected as string] || [];
  }, [issues, selected]);

  const headerStatus = useMemo(() => {
    if (!health) return { line1: "Health: …", line2: `Target: ${targetLabel}` };
    const up = health.uptimeSec != null ? ` · uptime ${health.uptimeSec}s` : "";
    return {
      line1: `Health: ${health.status} — ${health.service}${up}`,
      line2: `Target: ${targetLabel}`,
    };
  }, [health, targetLabel]);

  const rightTitle = useMemo(() => {
    if (!selected) return "Details: —";
    const labels: Record<Exclude<DetailKey, null>, string> = {
      global: "Details: Global score",
      performance: "Details: Performance",
      accessibility: "Details: Accessibility",
      bestPractices: "Details: Best Practices",
      seo: "Details: SEO",
      "seo.scn": "Details: SEO SCN",
      "seo.orbit": "Details: SEO Orbit",
      "seo.schema": "Details: SEO Schema",
      "seo.crawl": "Details: SEO Crawl",
      critical: "Details: Critical issues",
      warning: "Details: Warnings",
      info: "Details: Info",
    };
    return labels[selected];
  }, [selected]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: THEME.pageBg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          padding: 18,
          borderBottom: "1px solid rgba(47, 233, 23, 0.35)",
          background:
            "linear-gradient(180deg, rgba(4,6,12,0.88) 0%, rgba(8,10,18,0.78) 100%)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 18,
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <img
            src={noxelSeoLogo}
            alt="NOXEL SEO"
            style={{ height: 80, width: 80, display: "block" }}
          />

          {/* Status */}
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
              padding: "12px 16px",
              boxShadow: `${THEME.innerShadow}, 0 18px 30px rgba(0,0,0,0.22)`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.1,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.60)",
              }}
            >
              Search visibility & intelligence
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 18,
                fontWeight: 980,
                color: "rgba(255,255,255,0.96)",
              }}
            >
              NOXEL SEO
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {headerStatus.line1}
            </div>
            <div style={{ marginTop: 2, fontSize: 12, fontWeight: 800, color: THEME.cardText }}>
              {headerStatus.line2}
            </div>
          </div>

          {/* Scan bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minWidth: 360,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && scanUrl()}
                placeholder="https://example.com"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(0,0,0,0.25)",
                  color: THEME.cardText,
                  outline: "none",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              />
              <button
                onClick={scanUrl}
                disabled={scanLoading}
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(40,255,120,0.35)",
                  background: "rgba(40,255,120,0.16)",
                  color: THEME.cardText,
                  cursor: scanLoading ? "not-allowed" : "pointer",
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
                type="button"
              >
                {scanLoading ? "Scanning…" : "Scan"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => refresh()}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  color: THEME.cardText,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 900,
                  fontSize: 13,
                }}
                type="button"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(153,89,255,0.35)",
                  background: "rgba(153,89,255,0.12)",
                  color: THEME.cardText,
                  cursor: "pointer",
                  fontWeight: 950,
                  fontSize: 13,
                }}
                type="button"
              >
                Export PDF
              </button>
            </div>
            {err && (
              <div style={{ fontSize: 12, color: "#ff4d6d" }}>
                Error: <b>{err}</b>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(600px, 1fr) minmax(480px, 560px)",
          gap: 14,
          padding: 18,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Left: Score cards */}
        <div style={{ overflow: "auto", padding: "4px 8px" }}>
          {/* Row 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 20,
            }}
          >
            <Card title="Global" value={summary?.globalScore ?? "—"} onClick={() => setSelected("global")} active={selected === "global"} />
            <Card title="Performance" value={summary?.performance ?? "—"} onClick={() => setSelected("performance")} active={selected === "performance"} />
            <Card title="Accessibility" value={summary?.accessibility ?? "—"} onClick={() => setSelected("accessibility")} active={selected === "accessibility"} />
          </div>

          {/* Row 2 */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 20,
            }}
          >
            <Card title="Best Practices" value={summary?.bestPractices ?? "—"} onClick={() => setSelected("bestPractices")} active={selected === "bestPractices"} />
            <Card title="SEO" value={summary?.seo ?? "—"} onClick={() => setSelected("seo")} active={selected === "seo"} />
            <Card
              title="Last scan"
              value={summary?.lastScan ? new Date(summary.lastScan).toLocaleString() : "—"}
              full
              slim
            />
          </div>

          {/* Row 3 — SEO sub-modules */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <Card title="SEO SCN" value={summary?.seoModules?.scn ?? "—"} onClick={() => setSelected("seo.scn")} active={selected === "seo.scn"} />
            <Card title="SEO Orbit" value={summary?.seoModules?.orbit ?? "—"} onClick={() => setSelected("seo.orbit")} active={selected === "seo.orbit"} />
            <Card title="SEO Schema" value={summary?.seoModules?.schema ?? "—"} onClick={() => setSelected("seo.schema")} active={selected === "seo.schema"} />
            <Card title="SEO Crawl" value={summary?.seoModules?.crawl ?? "—"} onClick={() => setSelected("seo.crawl")} active={selected === "seo.crawl"} />
          </div>

          {/* Row 4 — Issues */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 20,
            }}
          >
            <Card title="Critical issues" value={summary?.issues?.critical ?? "—"} onClick={() => setSelected("critical")} active={selected === "critical"} kind="count" />
            <Card title="Warnings" value={summary?.issues?.warning ?? "—"} onClick={() => setSelected("warning")} active={selected === "warning"} kind="count" />
            <Card title="Info" value={summary?.issues?.info ?? "—"} onClick={() => setSelected("info")} active={selected === "info"} kind="count" />
          </div>
        </div>

        {/* Right: Detail panel */}
        <div
          style={{
            height: "100%",
            border: `1px solid ${THEME.panelBorder}`,
            borderRadius: 18,
            background: `linear-gradient(180deg, ${THEME.tealPanelSolid} 0%, rgba(14,16,22,0.92) 30%, rgba(14,16,22,0.92) 100%)`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 18px 40px rgba(0,0,0,0.40)",
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 950, fontSize: 16, color: THEME.cardText }}>
                {rightTitle}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, color: THEME.cardMuted }}>
                {isScoreKey(selected)
                  ? "Focus + reasons + fixes"
                  : isSeverityKey(selected)
                  ? "Filtered by severity"
                  : "Click a card to see why + fixes"}
              </div>
            </div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                style={{
                  marginLeft: "auto",
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(195,58,58,0.16)",
                  background: "rgba(0,0,0,0.22)",
                  color: THEME.cardText,
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 13,
                }}
                type="button"
              >
                Close
              </button>
            )}
          </div>

          {/* Panel body */}
          <div style={{ padding: 14, overflow: "auto", flex: 1 }}>
            {!issues || !summary ? (
              <div style={{ opacity: 0.8, fontSize: 13, color: THEME.cardMuted }}>
                {loading ? "Loading…" : "Scan a URL to see results."}
              </div>
            ) : !selected ? (
              <div style={{ opacity: 0.8, fontSize: 13, color: THEME.cardMuted }}>
                Select a card (Global / Performance / Critical…)
              </div>
            ) : isScoreKey(selected) ? (
              (() => {
                const meta = scoreMeta?.[selected];
                if (!meta || !issues) return null;
                const scoreCol = scoreColor(meta.value);
                return (
                  <div style={{ display: "grid", gap: 14 }}>
                    <div
                      style={{
                        borderRadius: 18,
                        padding: 14,
                        background: "rgba(0,0,0,0.26)",
                        boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.12), 0 0 0 3px ${scoreCol}`,
                      }}
                    >
                      <div style={{ fontSize: 16, color: THEME.cardText, fontWeight: 950 }}>
                        {meta.label}
                      </div>
                      <div style={{ fontSize: 40, color: scoreCol, fontWeight: 980, marginTop: 8, lineHeight: 1 }}>
                        {meta.value}
                      </div>
                      <div style={{ marginTop: 8, color: THEME.cardMuted, lineHeight: 1.35 }}>
                        {meta.desc}
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <TinyPill label="critical" value={issues.critical.length} dot="#b00020" />
                        <TinyPill label="warning" value={issues.warning.length} dot="#c77700" />
                        <TinyPill label="info" value={issues.info.length} dot="#999" />
                      </div>
                    </div>
                    {(["critical", "warning", "info"] as const).map((level) => {
                      const items = issues[level] || [];
                      if (!items.length) return null;
                      const sevColor = level === "critical" ? "#b00020" : level === "warning" ? "#c77700" : "#999";
                      return (
                        <div key={level}>
                          <SectionTitle>{level} ({items.length})</SectionTitle>
                          <div style={{ display: "grid", gap: 10 }}>
                            {items.map((it: IssueItem) => (
                              <IssueCard key={it.id} it={it} sevColor={sevColor} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : isSeverityKey(selected) ? (
              <div style={{ display: "grid", gap: 14 }}>
                <SectionTitle>
                  {String(selected).toUpperCase()} ({selectedIssuesList.length})
                </SectionTitle>
                {!selectedIssuesList.length ? (
                  <div style={{ opacity: 0.85, fontSize: 13, color: THEME.cardMuted }}>
                    No issues.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {selectedIssuesList.map((it: IssueItem) => (
                      <IssueCard
                        key={it.id}
                        it={it}
                        sevColor={
                          selected === "critical" ? "#b00020"
                          : selected === "warning" ? "#c77700"
                          : "#999"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          button, input { display: none !important; }
        }
      `}</style>
    </div>
  );
}


