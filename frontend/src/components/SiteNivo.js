import { jsx as _jsx } from "react/jsx-runtime";
import NivoChat from "./NivoChat";
import { useLanguage } from "../language/LanguageStore";
// Nivo, l'assistant de support NOXEL, sur NOXEL360 (faits de NOXEL360, API de NOXEL SEO)
export default function SiteNivo() {
    const { language } = useLanguage();
    return _jsx(NivoChat, { locale: String(language || "en"), site: "360" });
}
