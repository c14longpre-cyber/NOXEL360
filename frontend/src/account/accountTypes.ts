import type React from "react";

export type AccountProfile = {
  name: string;
  email: string;
  language: string;
  workspace: string;
};

export type AccountBilling = {
  tier: string;
  status: string;
  renewalDate: string;
  plan: string;
};

export type AccountPreferences = {
  theme: string;
  notifications: string;
  interfaceMode: string;
  morphProfile: string;
};

export type AccountSecurity = {
  password: string;
  twoFactor: string;
  lastLogin: string;
  sessionProtection: string;
};

export type AccountSummary = {
  profile: AccountProfile;
  billing: AccountBilling;
  preferences: AccountPreferences;
  security: AccountSecurity;
};

export type AccountSummaryResponse = {
  ok: boolean;
  data: AccountSummary;
};

export type BackendSource = "backend" | "fallback";

export type AccountStoreState = {
  account: AccountSummary | null;
  loading: boolean;
  error: string | null;
  backendSource: BackendSource;
};

export type AccountStoreValue = AccountStoreState & {
  refreshAccount: () => Promise<void>;
  setAccount: React.Dispatch<React.SetStateAction<AccountSummary | null>>;
  patchPreferences: (patch: Partial<AccountPreferences>) => void;
};


