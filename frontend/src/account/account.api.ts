const API_BASE = import.meta.env.VITE_API_URL;

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

export async function fetchAccountSummary(
  signal?: AbortSignal
): Promise<AccountSummary> {
  if (!API_BASE) {
    throw new Error("Missing VITE_API_URL");
  }

  const res = await fetch(`${API_BASE}/api/account/summary`, {
    method: "GET",
    credentials: "include",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`Account summary request failed (${res.status})`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Account summary expected JSON but received ${contentType || "unknown content type"}`
    );
  }

  let json: { ok?: boolean; data?: AccountSummary };

  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Account summary returned invalid JSON");
  }

  if (!json?.ok || !json?.data) {
    throw new Error("Account summary response is invalid");
  }

  return json.data;
}
