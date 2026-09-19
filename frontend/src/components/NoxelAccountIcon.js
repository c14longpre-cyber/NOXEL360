import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./noxel-account-icon.css";
const TIER_CLASS = {
    bronze: "tier-bronze",
    silver: "tier-silver",
    gold: "tier-gold",
    platinum: "tier-platinum",
    diamond: "tier-diamond",
};
export default function NoxelAccountIcon({ connected = false, tier = "diamond", size = 78, className = "", }) {
    const stateClass = connected ? "is-connected" : "is-disconnected";
    const tierClass = connected ? TIER_CLASS[tier] : "tier-off";
    return (_jsx("div", { className: `noxel-account-icon ${stateClass} ${tierClass} ${className}`.trim(), style: { width: size, height: size }, "aria-label": connected ? `Connected account (${tier})` : "Disconnected account", title: connected ? `Connected • ${tier}` : "Disconnected", children: _jsxs("svg", { viewBox: "0 0 100 100", className: "noxel-account-icon__svg", role: "img", "aria-hidden": "true", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "noxelRefreshGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#702AA5" }), _jsx("stop", { offset: "100%", stopColor: "#3CDE6A" })] }) }), _jsx("path", { className: "noxel-account-icon__ring", d: "M50 11\n             A39 39 0 1 1 22 22", fill: "none", strokeWidth: "7", strokeLinecap: "round" }), _jsx("path", { className: "noxel-account-icon__arrow", d: "M22 22 L22 10 L34 10", fill: "none", strokeWidth: "7", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("circle", { className: "noxel-account-icon__head", cx: "50", cy: "37", r: "11" }), _jsx("path", { className: "noxel-account-icon__body", d: "M28 74\n             C28 60, 37 52, 50 52\n             C63 52, 72 60, 72 74\n             L72 80\n             L28 80 Z" })] }) }));
}
