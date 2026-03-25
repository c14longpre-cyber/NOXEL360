import { apiGet } from "../lib/api";

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

export async function fetchAccountSummary(): Promise<AccountSummary> {
  const res = await apiGet<{ ok: boolean; data: AccountSummary }>("/api/account/summary");

  if (!res.ok || !res.data) {
    throw new Error("Account summary request failed");
  }

  return res.data;
}