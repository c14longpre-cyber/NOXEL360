import React from "react";

export type RegionId =
  | "north-america"
  | "south-america"
  | "europe"
  | "africa"
  | "asia"
  | "oceania";

type RegionMapProps = {
  selectedRegion: RegionId | null;
  onSelectRegion: (region: RegionId) => void;
};

const REGIONS: Array<{ id: RegionId; label: string }> = [
  { id: "north-america", label: "North America" },
  { id: "south-america", label: "South America" },
  { id: "europe", label: "Europe" },
  { id: "africa", label: "Africa" },
  { id: "asia", label: "Asia" },
  { id: "oceania", label: "Oceania" },
];

export default function RegionMap({
  selectedRegion,
  onSelectRegion,
}: RegionMapProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(180px, 220px))",
        gap: 16,
        width: "100%",
        maxWidth: 500,
      }}
    >
      {REGIONS.map((region) => {
        const active = selectedRegion === region.id;

        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion(region.id)}
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              border: active ? "2px solid #3CDE6A" : "1px solid rgba(255,255,255,0.18)",
              background: active ? "rgba(60, 222, 106, 0.14)" : "rgba(255,255,255,0.04)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.98rem",
              fontWeight: 600,
              transition: "all 0.18s ease",
            }}
          >
            {region.label}
          </button>
        );
      })}
    </div>
  );
}
