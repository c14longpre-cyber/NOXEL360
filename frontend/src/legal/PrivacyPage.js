import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useI18n } from "@/useI18n";
export default function PrivacyPage() {
    const { t } = useI18n();
    return (_jsx("main", { style: {
            minHeight: "100vh",
            background: "#05070d",
            color: "#eef2ff",
            padding: "48px 20px",
        }, children: _jsxs("div", { style: {
                maxWidth: 960,
                margin: "0 auto",
                background: "rgba(11,18,32,.88)",
                border: "1px solid rgba(14,171,142,.46)",
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 18px 60px rgba(0,0,0,.35)",
            }, children: [_jsx("div", { style: { marginBottom: 24 }, children: _jsx("a", { href: "/dashboard", style: {
                            color: "#3CDE6A",
                            textDecoration: "none",
                            fontWeight: 700,
                        }, children: t("legal.backToNoxel") }) }), _jsx("h1", { style: { fontSize: 40, margin: "0 0 16px" }, children: t("privacy.title") }), _jsxs("p", { style: { opacity: 0.82, lineHeight: 1.7 }, children: [t("legal.effectiveDateLabel"), ": ", t("legal.effectiveDateValue")] }), _jsxs("section", { style: { marginTop: 28, lineHeight: 1.8 }, children: [_jsx("p", { children: t("privacy.intro") }), _jsx("h2", { style: { marginTop: 28 }, children: t("privacy.section1.title") }), _jsx("p", { children: t("privacy.section1.lead") }), _jsxs("ul", { children: [_jsx("li", { children: t("privacy.section1.item1") }), _jsx("li", { children: t("privacy.section1.item2") }), _jsx("li", { children: t("privacy.section1.item3") }), _jsx("li", { children: t("privacy.section1.item4") })] }), _jsx("h2", { style: { marginTop: 28 }, children: t("privacy.section2.title") }), _jsx("p", { children: t("privacy.section2.lead") }), _jsxs("ul", { children: [_jsx("li", { children: t("privacy.section2.item1") }), _jsx("li", { children: t("privacy.section2.item2") }), _jsx("li", { children: t("privacy.section2.item3") }), _jsx("li", { children: t("privacy.section2.item4") }), _jsx("li", { children: t("privacy.section2.item5") })] }), _jsx("h2", { style: { marginTop: 28 }, children: t("privacy.section3.title") }), _jsx("p", { children: t("privacy.section3.body") }), _jsx("h2", { style: { marginTop: 28 }, children: t("privacy.section4.title") }), _jsx("p", { children: t("privacy.section4.body") }), _jsx("h2", { style: { marginTop: 28 }, children: t("privacy.section5.title") }), _jsxs("p", { children: [t("privacy.section5.body"), _jsx("br", {}), _jsx("strong", { children: "c.14longpre@gmail.com" })] })] })] }) }));
}
