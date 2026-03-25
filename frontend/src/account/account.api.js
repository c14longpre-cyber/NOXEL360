const API_BASE = import.meta.env.VITE_API_URL;
export async function fetchAccountSummary(signal) {
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
    return json.data;
}
