import { useAccountStore } from "../../account/AccountStore";
import { useAuthStore } from "../../auth/AuthStore";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";

<NoxelAccountIcon connected={true} tier="diamond" size={78} />
export default function AccountPage() {
  const { account, loading, error, backendSource, refreshAccount } =
    useAccountStore();
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();

  return (
    <div className="noxel-landing">
      <div className="nx-wrap">
        <header className="nx-hero">
          <div className="nx-hero__text">
            <div className="nx-kicker">NOXEL360</div>
            <h1 className="nx-title">Account Center</h1>
            <p className="nx-subtitle">
              Manage your profile, plan, preferences, and future platform
              settings.
            </p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span className="pill">
                Source:{" "}
                {backendSource === "backend" ? "Live backend" : "Fallback mock"}
              </span>
              <span className="pill">
                Status: {loading ? "Loading..." : "Ready"}
              </span>
              {error ? <span className="pill">Error: {error}</span> : null}
              <span className="pill">
                Auth:{" "}
                {authLoading
                  ? "Checking session..."
                  : isAuthenticated
                    ? "Connected"
                    : "Guest"}
              </span>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                className="nx-btn"
                onClick={refreshAccount}
                type="button"
              >
                Refresh account
              </button>

              <GoogleLoginButton />

              {isAuthenticated ? <UserMenu /> : null}
            </div>

            {user ? (
              <div style={{ marginTop: 12 }}>
                <span className="pill">Signed in as: {user.name}</span>
                <span className="pill" style={{ marginLeft: 8 }}>
                  {user.email}
                </span>
              </div>
            ) : null}
          </div>
        </header>

        <div
          className="nx-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          <article className="nx-card">
            <div className="nx-card__title">Profile</div>
            <p className="nx-card__text">
              <strong>Name:</strong> {account?.profile.name ?? "—"}
              <br />
              <strong>Email:</strong> {account?.profile.email ?? "—"}
              <br />
              <strong>Language:</strong> {account?.profile.language ?? "—"}
              <br />
              <strong>Workspace:</strong> {account?.profile.workspace ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Plan &amp; Billing</div>
            <p className="nx-card__text">
              <strong>Tier:</strong> {account?.billing.tier ?? "—"}
              <br />
              <strong>Status:</strong> {account?.billing.status ?? "—"}
              <br />
              <strong>Renewal:</strong> {account?.billing.renewalDate ?? "—"}
              <br />
              <strong>Plan:</strong> {account?.billing.plan ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Preferences</div>
            <p className="nx-card__text">
              <strong>Theme:</strong> {account?.preferences.theme ?? "—"}
              <br />
              <strong>Notifications:</strong>{" "}
              {account?.preferences.notifications ?? "—"}
              <br />
              <strong>Interface mode:</strong>{" "}
              {account?.preferences.interfaceMode ?? "—"}
              <br />
              <strong>Morph profile:</strong>{" "}
              {account?.preferences.morphProfile ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Security</div>
            <p className="nx-card__text">
              <strong>Password:</strong> {account?.security.password ?? "—"}
              <br />
              <strong>2FA:</strong> {account?.security.twoFactor ?? "—"}
              <br />
              <strong>Last login:</strong>{" "}
              {account?.security.lastLogin ?? "—"}
              <br />
              <strong>Session protection:</strong>{" "}
              {account?.security.sessionProtection ?? "—"}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
