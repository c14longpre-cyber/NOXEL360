import { useEffect } from "react";
import { useNexusStore } from "../store/nexus.store";

export default function NexusButton() {
  const language = useNexusStore((s: any) => s.language);
  const country = useNexusStore((s: any) => s.country);
  const hydrate = useNexusStore((s: any) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <button
      type="button"
      className="nx-pill"
      title="Nexus language selector"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(60,222,106,0.10)",
        color: "inherit",
        cursor: "pointer"
      }}
    >
      <span>🌍</span>
      <span>{country || "--"}</span>
      <span>{language.toUpperCase()}</span>
    </button>
  );
}




