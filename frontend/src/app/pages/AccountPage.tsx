import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
import { useModulesIndex } from "../modules/useModulesIndex";
import { useI18n } from "@/useI18n";
import { HudButton } from "@/components/hud/HudButton";

/**
 * Page Compte : n'affiche que ce que le backend connaît vraiment, c'est-à-dire
 * la session (/api/auth/session : utilisateur + fournisseurs reliés).
 * NOXEL360 ne vend rien : pas de palier ni de facturation ici, chaque module
 * (NOXEL SEO, NOXEL Forge) garde son compte et ses prix sur son propre site.
 * Jamais de compte de démonstration à la place d'un vrai.
 */
function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return date.toLocaleString(locale || undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return date.toLocaleString();
  }
}

export default function AccountPage() {
  const { user, isAuthenticated, loading, refreshAuth } = useAuthStore();
  const { t, language } = useI18n();
  const modules = useModulesIndex();

  return (
    <div className="noxel-landing">
      <div className="nx-wrap">
        <header className="nx-hero">
          <div className="account-hero-layout">
            <div className="account-hero-left">
              <img src="/logos/NOXEL_360_LOGO.svg" alt="NOXEL360" style={{ height: 150 }} />
            </div>

            <div className="account-hero-center">
              <h1 className="nx-title">{t("account.title")}</h1>
            </div>

            <div className="account-hero-right">
              <div
                className="account-hero-top"
                style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}
              >
                <NoxelAccountIcon connected={isAuthenticated} size={78} />

                <HudButton
                  action="reload-page"
                  iconOnly
                  label={t("account.refresh")}
                  busy={loading}
                  busyLabel={t("account.refresh")}
                  onClick={refreshAuth}
                />

                {!isAuthenticated ? <NoxelAccessButton /> : <UserMenu />}
              </div>

              <div
                className="account-hero-meta"
                style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", marginTop: 10 }}
              >
                <span className="pill">
                  {t("account.auth")}:{" "}
                  {loading ? t("account.checking") : isAuthenticated ? t("account.connected") : t("account.guest")}
                </span>
                {user?.name && (
                  <span className="pill">
                    {t("account.signedInAs")}: {user.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="nx-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <article className="nx-card">
            <div className="nx-card__title">{t("account.profile")}</div>
            {isAuthenticated && user ? (
              <p className="nx-card__text">
                <strong>{t("account.name")}:</strong> {user.name ?? "—"}
                <br />
                <strong>{t("account.email")}:</strong> {user.email ?? "—"}
                <br />
                <strong>{t("account.lastLogin")}:</strong> {formatDate(user.lastLoginAt, language)}
              </p>
            ) : (
              <div className="nx-card__text" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span>{loading ? t("account.checking") : t("account.guest")}</span>
                {!loading && <NoxelAccessButton />}
              </div>
            )}
          </article>

          <article className="nx-card">
            <div className="nx-card__title">{t("dashboard.modules")}</div>
            <ul className="nx-card__text" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {modules.map((m) => (
                <li key={m.key}>
                  <a
                    href={m.route}
                    {...(m.external ? { target: "_blank", rel: "noopener" } : {})}
                    style={{ color: "#3ddc84", textDecoration: "none" }}
                  >
                    {m.name} — {t("dashboard.card.open")}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {isAuthenticated && (
          <div style={{ marginTop: 20 }}>
            <ConnectedAccountsCard />
          </div>
        )}
      </div>
    </div>
  );
}
