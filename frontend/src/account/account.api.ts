import type {
  AccountSummary,
  AccountSummaryResponse,
} from "./accountTypes";

const ACCOUNT_SUMMARY_ENDPOINT = "/api/account/summary";

export async function fetchAccountSummary(
  signal?: AbortSignal
): Promise<AccountSummary> {
  const res = await fetch(ACCOUNT_SUMMARY_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Account summary request failed (${res.status})`);
  }

  const json = (await res.json()) as AccountSummaryResponse;

  if (!json?.ok || !json?.data) {
    throw new Error("Invalid account summary payload");
  }

  return json.data;
}