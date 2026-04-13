import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  getModule,
  type Tier,
  type ModuleStatus,
} from "../modules/modules.registry";
import { MODULE_COMPONENTS } from "@/app/modules/modules.runtime";

/* ======================================================
   NOXEL360 — Module Host
   - Layout corrigé
   - Logo à gauche
   - Contenu à droite
   - Gros titre retiré
   ====================================================== */

// TODO: brancher le vrai tier utilisateur (auth / store)
const CURRENT_TIER: Tier = "bronze";

/* Ordre réel des tiers (FR) */
const TIER_ORDER: Tier[] = ["bronze", "argent", "or", "platine", "diamant"];

function tierRank(tier: Tier): number {
  return TIER_ORDER.indexOf(tier);
}

function hasAccess(current: Tier, required: Tier): boolean {
  return tierRank(current) >= tierRank(required);
}

export default function ModuleHost() {
  const { moduleId } = useParams<{ moduleId?: string }>();
  const mod = getModule(moduleId);

  // Ajuste ce chemin si nécessaire selon ton arborescence réelle
  const logoSrc = mod ? `/logos/${mod.id}.webp` : "";

  /* =========================
     Module introuvable
     ========================= */
  if (!mod) {
    return (
      <div className="noxel-landing">
        <div className="nx-wrap">
          <div className="nx-content">
            <h2>Module introuvable</h2>
            <p>
              <Link to="/dashboard" className="nx-card__link">
                ← Retour dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Tier gating
     ========================= */
  const allowed = hasAccess(CURRENT_TIER, mod.minTier);

  if (!allowed) {
    return (
      <div className="noxel-landing">
        <div className="nx-wrap">
          <header className="nx-hero">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px minmax(0, 1fr)",
                gap: 28,
                alignItems: "start",
              }}
            >
              <div>
                <img
                  src={logoSrc}
                  alt={mod.name}
                  className="module-landing-logo"
                  loading="lazy"
                  style={{
                    width: 180,
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ minWidth: 0 }}>
                <div className="nx-kicker">NOXEL360</div>
                <p className="nx-subtitle" style={{ marginTop: 8 }}>
                  Ce module nécessite le tier <strong>{mod.minTier}</strong>.
                </p>
              </div>
            </div>
          </header>

          <div className="nx-card nx-card--highlight">
            <div className="nx-card__title">Accès verrouillé</div>

            <p className="nx-card__text">
              Ton tier actuel : <strong>{CURRENT_TIER}</strong>
            </p>

            <ul className="nx-card__list">
              <li>
                <strong>Tier minimum :</strong> {mod.minTier}
              </li>
              <li>
                <strong>Route :</strong> {mod.route}
              </li>
              <li>
                <strong>ID :</strong> {mod.id}
              </li>
            </ul>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <Link to="/pricing" className="nav-cta" style={{ marginTop: 0 }}>
                Upgrade & Pricing
              </Link>
              <Link
                to="/dashboard"
                className="nav-cta"
                style={{ marginTop: 0, opacity: 0.9 }}
              >
                Retour dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Module externe
     ========================= */
  if (mod.kind === "external" && mod.externalUrl) {
    return (
      <div className="noxel-landing" style={{ padding: 0 }}>
        <iframe
          title={mod.name}
          src={mod.externalUrl}
          className="w-full h-full border-0"
          style={{ display: "block", height: "100vh" }}
        />
      </div>
    );
  }

  /* =========================
     Module désactivé
     ========================= */
  const effectiveStatus: ModuleStatus = mod.status ?? "placeholder";

  if (effectiveStatus === "disabled") {
    return (
      <div className="noxel-landing">
        <div className="nx-wrap">
          <header className="nx-hero">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px minmax(0, 1fr)",
                gap: 28,
                alignItems: "start",
              }}
            >
              <div>
                <img
                  src={logoSrc}
                  alt={mod.name}
                  className="module-landing-logo"
                  loading="lazy"
                  style={{
                    width: 180,
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ minWidth: 0 }}>
                <div className="nx-kicker">NOXEL360</div>
                <p className="nx-subtitle" style={{ marginTop: 8 }}>
                  Module désactivé pour le moment.
                </p>
              </div>
            </div>
          </header>

          <div className="nx-content">
            <p>
              <Link to="/dashboard" className="nx-card__link">
                ← Retour dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }



/* =========================
   Module runtime injection
   ========================= */

const Component = MODULE_COMPONENTS[mod.id];

if (Component) {
  return <Component />;
}

/* =========================
   Fallback placeholder
   ========================= */
return (
  <div className="noxel-landing">
    <div className="nx-wrap">
      <header className="nx-hero">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px minmax(0, 1fr)",
            gap: 36,
            alignItems: "start",
          }}
        >
          <div>
            <img
              src={logoSrc}
              alt={mod.name}
              className="module-landing-logo"
              loading="lazy"
              style={{
                width: 220,
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="nx-kicker">NOXEL360</div>

            <p className="nx-subtitle" style={{ marginTop: 8 }}>
              Module interne — prêt à être branché.
            </p>

            <div style={{ marginTop: 24 }}>
              <div className="nx-card">
                <div className="nx-card__title">Placeholder</div>

                <p className="nx-card__text">
                  Ce module n’est pas encore connecté.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
);
}
