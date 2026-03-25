import { apiGet } from "../lib/api";
export async function fetchAccountSummary() {
    const res = await apiGet("/api/account/summary");
    if (!res.ok || !res.data) {
        throw new Error("Account summary request failed");
    }
    return res.data;
}
