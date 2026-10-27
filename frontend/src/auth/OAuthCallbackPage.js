import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuthStore } from "./AuthStore";
/**
 * Ancienne page de retour OAuth. Le backend redirige aujourd'hui vers
 * /app/account après avoir posé le cookie de session ; cette page ne fait que
 * relire la session auprès du serveur. Elle ne crée jamais un utilisateur à
 * partir des paramètres de l'adresse : n'importe qui pourrait en fabriquer.
 */
export default function OAuthCallbackPage() {
    const { refreshAuth } = useAuthStore();
    const [message, setMessage] = useState("Completing sign-in...");
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error") || "";
    useEffect(() => {
        if (error) {
            setMessage("Sign-in failed. Please try again.");
            return;
        }
        let cancelled = false;
        void refreshAuth().finally(() => {
            if (!cancelled)
                window.location.replace("/app/account");
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "#05070d",
            color: "#eef2ff",
        }, children: _jsxs("div", { style: {
                width: "100%",
                maxWidth: 560,
                padding: 24,
                borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
            }, children: [_jsx("h1", { style: { marginTop: 0, marginBottom: 12 }, children: "NOXEL360" }), _jsx("p", { style: { margin: 0, opacity: 0.9 }, children: message }), error && (_jsx("p", { style: { marginTop: 16 }, children: _jsx("a", { href: "/app/account", style: { color: "#3ddc84" }, children: "/app/account" }) }))] }) }));
}
