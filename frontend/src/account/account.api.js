const ACCOUNT_SUMMARY_ENDPOINT = "/api/account/summary";
export async function fetchAccountSummary(signal) {
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
    const json = (await res.json());
    if (!json?.ok || !json?.data) {
        throw new Error("Invalid account summary payload");
    }
    return json.data;
}
