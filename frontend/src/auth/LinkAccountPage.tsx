import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./AuthStore";
import { HudButton } from "../components/hud/HudButton";

const API_BASE = import.meta.env.VITE_API_URL;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

type ResolveExistingEmailResponse = {
  ok: boolean;
  error?: string;
};

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"}`
    );
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("Server returned invalid JSON");
  }
}

export default function LinkAccountPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const { isAuthenticated, refreshAuth, loginWithProvider, user } = useAuthStore();

  const ticketId = query.get("ticketId") || "";
  const email = query.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmLink() {
    if (!ticketId) {
      setError("Missing link ticket.");
      return;
    }

    if (!API_BASE) {
      setError("Missing VITE_API_URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/resolve-existing-email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ticketId }),
      });

      const json =
        await parseJsonResponse<ResolveExistingEmailResponse>(res);

      if (!res.ok || !json.ok) {
        throw new Error(json?.error || "Failed to link account.");
      }

      await refreshAuth();
      navigate("/app/account?tab=accounts");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to link account.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <section
        className="nx-card"
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 className="nx-card__title" style={{ margin: 0 }}>
            Account already exists
          </h1>

          <p className="nx-card__text" style={{ margin: 0 }}>
            A Noxel360 account already exists
            {email ? ` for ${email}` : ""}. Sign in to your existing account,
            then confirm the link.
          </p>
        </div>

        {!isAuthenticated ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 14, opacity: 0.75 }}>
              You need to sign in to your existing Noxel360 account first.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <HudButton
                action="continue"
                compact
                label="Sign in with Google"
                onClick={() => loginWithProvider("google", "signin")}
              />

              <HudButton
                action="continue"
                compact
                label="Sign in with Microsoft"
                onClick={() => loginWithProvider("microsoft", "signin")}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              Signed in as{" "}
              <strong>{user?.email || user?.name || "current user"}</strong>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <HudButton
                action="ok"
                compact
                label="Confirm link"
                busy={loading}
                busyLabel="Linking..."
                onClick={handleConfirmLink}
              />

              <HudButton
                action="cancel"
                compact
                label="Cancel"
                onClick={() => navigate("/app/account")}
              />
            </div>
          </div>
        )}

        {error ? (
          <div
            style={{
              fontSize: 13,
              color: "#ff8a8a",
              border: "1px solid rgba(255, 138, 138, 0.25)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            {error}
          </div>
        ) : null}
      </section>
    </div>
  );
}


