import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import RegionMap from "./RegionMap";
export default function RegionStep({ onNext, onCancel }) {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const handleNext = () => {
        onNext(selectedRegion);
    };
    return (_jsxs("div", { style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingRight: 24,
        }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: "1.6rem", marginBottom: 4 }, children: "Choisissez votre r\u00E9gion" }), _jsx("p", { style: { opacity: 0.8 }, children: "S\u00E9lectionnez une r\u00E9gion du monde pour continuer." })] }), _jsx("div", { style: {
                    marginTop: 32,
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                }, children: _jsx(RegionMap, { selectedRegion: selectedRegion, onSelectRegion: (region) => setSelectedRegion(region) }) }), _jsxs("div", { style: {
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                }, children: [_jsx("button", { type: "button", onClick: onCancel, children: "Annuler" }), _jsx("button", { type: "button", disabled: !selectedRegion, onClick: handleNext, children: "Continuer \u2192" })] })] }));
}
