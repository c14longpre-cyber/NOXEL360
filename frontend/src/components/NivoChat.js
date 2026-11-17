import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import "./nivo.css";
// Nivo 1.0 — support assistant of the NOXEL sites. Same file in noxelseo, noxelforge, noxelspectra and noxel360
// (frontend/src/components/NivoChat.tsx + nivo.css). It always talks to the NOXEL SEO API (routes/nivo.routes.ts),
// with `site` so it answers from that site's facts; when a person must answer, it offers to pass the question to the
// team (reply within 24 business hours). Conversations are kept 12 months only when a NOXEL SEO session exists.
const NIVO_API = "https://noxelseo-production.up.railway.app";
const SITE_NAME = { seo: "NOXEL SEO", forge: "NOXEL FORGE", spectra: "NOXEL SPECTRA", "360": "NOXEL360" };
const TEXT = {
    fr: {
        open: "Ouvrir l'aide de Nivo", help: "Besoin d'aide ?", chat: "Clavardez avec Nivo", close: "Fermer", title: "Nivo", subtitle: "Assistant IA",
        welcome: "Bonjour! Je suis Nivo, l'assistant IA de {site}. Comment puis-je vous aider?",
        placeholder: "Écrivez votre question…", send: "Envoyer", thinking: "Nivo écrit…",
        error: "Nivo est momentanément indisponible. Écrivez-nous à contact@noxel360.com : une personne vous répondra dans les 24 heures ouvrables.",
        limited: "Vous avez envoyé beaucoup de messages. Réessayez dans quelques minutes, ou écrivez à contact@noxel360.com.",
        noticeGuest: "Nivo est un assistant IA qui répond à partir des informations de {site}. Vos messages ne sont pas conservés.",
        noticeUser: "Nivo est un assistant IA qui répond à partir des informations de {site}. La conversation est conservée 12 mois avec votre compte.",
        erase: "Effacer mes conversations", erased: "Vos conversations ont été effacées.",
        handoffTitle: "Transmettre votre question à l'équipe", name: "Votre nom", email: "Votre courriel", question: "Votre question",
        consent: "J'accepte que NOXEL me réponde par courriel au sujet de cette question.",
        handoffSend: "Transmettre", handoffDone: "Merci! Votre question est transmise. Vous aurez une réponse complète dans les 24 heures ouvrables.",
        handoffError: "L'envoi n'a pas fonctionné. Écrivez-nous directement à contact@noxel360.com.",
        fieldError: "Vérifiez votre nom, votre courriel et la case de consentement.",
        transfer: "Transmettre ma question à l'équipe",
    },
    en: {
        open: "Open Nivo help", help: "Need help?", chat: "Chat with Nivo", close: "Close", title: "Nivo", subtitle: "AI assistant",
        welcome: "Hello! I'm Nivo, the AI assistant of {site}. How can I help you?",
        placeholder: "Type your question…", send: "Send", thinking: "Nivo is typing…",
        error: "Nivo is unavailable right now. Write to contact@noxel360.com: a person will answer within 24 business hours.",
        limited: "You've sent many messages. Try again in a few minutes, or write to contact@noxel360.com.",
        noticeGuest: "Nivo is an AI assistant that answers from {site}'s information. Your messages are not kept.",
        noticeUser: "Nivo is an AI assistant that answers from {site}'s information. The conversation is kept 12 months with your account.",
        erase: "Erase my conversations", erased: "Your conversations were erased.",
        handoffTitle: "Pass your question to the team", name: "Your name", email: "Your e-mail", question: "Your question",
        consent: "I agree that NOXEL answers me by e-mail about this question.",
        handoffSend: "Send to the team", handoffDone: "Thank you! Your question was passed on. You'll get a complete answer within 24 business hours.",
        handoffError: "Sending failed. Write to us directly at contact@noxel360.com.",
        fieldError: "Check your name, your e-mail and the consent box.",
        transfer: "Pass my question to the team",
    },
};
const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`).toLowerCase();
export default function NivoChat({ locale, site = "seo", apiBase, accountEmail = null }) {
    const lang = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
    const name = SITE_NAME[site];
    const tx = Object.fromEntries(Object.entries(TEXT[lang]).map(([k, v]) => [k, v.replace("{site}", name)]));
    const API_BASE = apiBase ?? NIVO_API;
    // Conversation kept only when the NOXEL SEO API recognises a session (answer of /api/support/history)
    const [kept, setKept] = useState(false);
    const [open, setOpen] = useState(false);
    const [msgs, setMsgs] = useState([]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState(null);
    const [handoff, setHandoff] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", question: "", consent: false, website2: "" });
    const [formError, setFormError] = useState(null);
    const convId = useRef(newId());
    const loadedFor = useRef(null);
    const listRef = useRef(null);
    // Signed-in account: reopen its last conversation (once per account, and once for a visitor)
    useEffect(() => {
        const who = accountEmail ?? "visitor";
        if (!open || loadedFor.current === who)
            return;
        loadedFor.current = who;
        fetch(`${API_BASE}/api/support/history?site=${site}`, { credentials: "include" })
            .then((r) => { setKept(r.ok); return r.ok ? r.json() : null; })
            .then((d) => {
            const c = d?.conversation;
            if (c?.id && Array.isArray(c.messages) && c.messages.length) {
                convId.current = c.id;
                setMsgs(c.messages);
            }
        })
            .catch(() => setKept(false));
    }, [open, accountEmail, API_BASE, site]);
    useEffect(() => {
        const box = listRef.current;
        if (box)
            box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    }, [msgs, busy, handoff]);
    const lastQuestion = () => [...msgs].reverse().find((m) => m.role === "user")?.content ?? "";
    async function send() {
        const q = input.trim();
        if (!q || busy)
            return;
        const next = [...msgs, { role: "user", content: q }];
        setMsgs(next);
        setInput("");
        setBusy(true);
        setNote(null);
        try {
            const r = await fetch(`${API_BASE}/api/support/chat`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ site, messages: next.slice(-16), conversationId: convId.current, lang }),
            });
            if (r.status === 429) {
                setNote(tx.limited);
                return;
            }
            const d = await r.json().catch(() => null);
            if (!r.ok || !d?.ok) {
                setNote(tx.error);
                return;
            }
            setMsgs([...next, { role: "assistant", content: d.reply }]);
            if (d.handoff)
                openHandoff(q);
        }
        catch {
            setNote(tx.error);
        }
        finally {
            setBusy(false);
        }
    }
    function openHandoff(question) {
        setForm((f) => ({ ...f, name: f.name || "", email: f.email || accountEmail || "", question: question ?? lastQuestion() }));
        setFormError(null);
        setHandoff("form");
    }
    async function sendHandoff() {
        if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) || !form.consent || form.question.trim().length < 3) {
            setFormError(tx.fieldError);
            return;
        }
        setHandoff("sending");
        setFormError(null);
        try {
            const r = await fetch(`${API_BASE}/api/support/handoff`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ site, name: form.name, email: form.email, question: form.question, contactConsent: form.consent, website2: form.website2, lang, transcript: msgs }),
            });
            if (!r.ok)
                throw new Error("not ok");
            setHandoff("done");
        }
        catch {
            setHandoff("form");
            setFormError(tx.handoffError);
        }
    }
    async function erase() {
        try {
            const r = await fetch(`${API_BASE}/api/support/history`, { method: "DELETE", credentials: "include" });
            if (r.ok) {
                setMsgs([]);
                convId.current = newId();
                setNote(tx.erased);
            }
        }
        catch { /* keep the conversation on screen */ }
    }
    if (!open) {
        return (_jsxs("button", { type: "button", className: "nivo-launcher", onClick: () => setOpen(true), "aria-label": tx.open, children: [_jsx("span", { className: "nivo-launcher__mark", "aria-hidden": "true", children: "N" }), _jsxs("span", { className: "nivo-launcher__text", children: [_jsx("span", { className: "nivo-launcher__label", children: tx.help }), _jsx("span", { className: "nivo-launcher__sub", children: tx.chat })] })] }));
    }
    return (_jsxs("section", { className: "nivo-panel", role: "dialog", "aria-label": `${tx.title} · ${tx.subtitle}`, children: [_jsxs("header", { className: "nivo-panel__head", children: [_jsx("span", { className: "nivo-launcher__mark", "aria-hidden": "true", children: "N" }), _jsxs("div", { children: [_jsx("strong", { children: tx.title }), " ", _jsxs("span", { className: "nivo-panel__sub", children: ["\u00B7 ", tx.subtitle] })] }), _jsx("button", { type: "button", className: "nivo-panel__close", onClick: () => setOpen(false), "aria-label": tx.close, children: "\u2715" })] }), _jsxs("div", { className: "nivo-panel__list", ref: listRef, "aria-live": "polite", children: [_jsx("p", { className: "nivo-msg nivo-msg--bot", children: tx.welcome }), msgs.map((m, i) => _jsx("p", { className: `nivo-msg ${m.role === "user" ? "nivo-msg--me" : "nivo-msg--bot"}`, children: m.content }, i)), busy && _jsx("p", { className: "nivo-msg nivo-msg--bot nivo-msg--typing", children: tx.thinking }), note && _jsx("p", { className: "nivo-note", children: note }), handoff === "form" || handoff === "sending" ? (_jsxs("div", { className: "nivo-handoff", children: [_jsx("strong", { children: tx.handoffTitle }), _jsx("input", { "aria-label": tx.name, placeholder: tx.name, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }), _jsx("input", { "aria-label": tx.email, placeholder: tx.email, type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) }), _jsx("textarea", { "aria-label": tx.question, placeholder: tx.question, rows: 3, value: form.question, onChange: (e) => setForm({ ...form, question: e.target.value }) }), _jsx("input", { className: "nivo-hp", tabIndex: -1, autoComplete: "off", "aria-hidden": "true", value: form.website2, onChange: (e) => setForm({ ...form, website2: e.target.value }) }), _jsxs("label", { className: "nivo-consent", children: [_jsx("input", { type: "checkbox", checked: form.consent, onChange: (e) => setForm({ ...form, consent: e.target.checked }) }), " ", tx.consent] }), formError && _jsx("p", { className: "nivo-note", children: formError }), _jsx("button", { type: "button", className: "nivo-btn", disabled: handoff === "sending", onClick: sendHandoff, children: tx.handoffSend })] })) : handoff === "done" ? (_jsx("p", { className: "nivo-msg nivo-msg--bot", children: tx.handoffDone })) : msgs.length > 0 ? (_jsx("button", { type: "button", className: "nivo-link", onClick: () => openHandoff(), children: tx.transfer })) : null] }), _jsxs("form", { className: "nivo-panel__input", onSubmit: (e) => { e.preventDefault(); void send(); }, children: [_jsx("input", { "aria-label": tx.placeholder, placeholder: tx.placeholder, value: input, maxLength: 1500, onChange: (e) => setInput(e.target.value) }), _jsx("button", { type: "submit", className: "nivo-btn", disabled: busy || !input.trim(), children: tx.send })] }), _jsxs("p", { className: "nivo-panel__notice", children: [kept ? tx.noticeUser : tx.noticeGuest, kept && _jsxs(_Fragment, { children: [" ", _jsx("button", { type: "button", className: "nivo-link nivo-link--inline", onClick: erase, children: tx.erase })] })] })] }));
}
