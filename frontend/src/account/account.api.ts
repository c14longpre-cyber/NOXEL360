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
  const res = await fetch(`${API_BASE}/api/account/summary`, {
    method: "GET",
    credentials: "include",
    signal,
  });

  if (!res.ok) {
    throw new Error(`Account summary request failed (${res.status})`);
  }

  const json = await res.json();

  if (!json?.ok || !json?.data) {
    throw new Error("Account summary response is invalid");
  }

  return json.data as AccountSummary;
}