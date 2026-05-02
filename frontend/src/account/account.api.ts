const API_BASE = import.meta.env.VITE_API_URL;
const IS_DEV = import.meta.env.DEV;

export type AccountSummary = {
  profile: {
    name: string;
    email: string;
    language: string;
    workspace: string;
  };
  billing: {
    tier: string;
    status: string;
    renewalDate: string;
    plan: string;
  };
  preferences: {
    theme: string;
    notifications: string;
    interfaceMode: string;
    morphProfile: string;
  };
  security: {
    password: string;
    twoFactor: string;
    lastLogin: string;
    sessionProtection: string;
  };
};

const FALLBACK_ACCOUNT: AccountSummary = {
  profile: {
    name: "Guest User",
    email: "guest@noxel360.local",
    language: "English",
    workspace: "NOXEL360",
  },
  billing: {
    tier: "Diamond",
    status: "Fallback",
    renewalDate: "-",
    plan: "Local fallback",
  },
  preferences: {
    theme: "Default Noxel",
    notifications: "Enabled",
    interfaceMode: "Standard",
    morphProfile: "Not configured yet",
  },
  security: {
    password: "Unknown",
    twoFactor: "Unknown",
    lastLogin: "Unknown",
    sessionProtection: "Unknown",
  },
};

function warnDev(message: string, detail?: unknown) {
  if (IS_DEV) {
    console.warn(`[account.api] ${message}`, detail ?? "");
  }
}

export async function fetchAccountSummary(
  signal?: AbortSignal
): Promise<AccountSummary> {
  if (!API_BASE) {
    warnDev("Missing VITE_API_URL, using fallback account.");
    return FALLBACK_ACCOUNT;
  }

  try {
    const res = await fetch(`${API_BASE}/api/account/summary`, {
      method: "GET",
      credentials: "include",
      signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      warnDev(`Account summary request failed (${res.status}), using fallback.`);
      return FALLBACK_ACCOUNT;
    }

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      warnDev(`Expected JSON but received ${contentType || "unknown"}.`);
      return FALLBACK_ACCOUNT;
    }

    const json = (await res.json()) as { ok?: boolean; data?: AccountSummary };

    if (!json?.ok || !json?.data) {
      warnDev("Invalid account summary response, using fallback.", json);
      return FALLBACK_ACCOUNT;
    }

    return json.data;
  } catch (err) {
    if (signal?.aborted) {
      return FALLBACK_ACCOUNT;
    }

    warnDev("Account summary fetch failed, using fallback.", err);
    return FALLBACK_ACCOUNT;
  }
}
