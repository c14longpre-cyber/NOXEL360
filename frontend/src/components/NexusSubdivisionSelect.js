import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function NexusSubdivisionSelect({ subdivisions = [], onAccept, onDecline, }) {
    if (!subdivisions.length)
        return null;
    return (_jsxs("div", { style: { marginTop: 16 }, children: [_jsxs("select", { onChange: (e) => {
                    const item = subdivisions.find((s) => s.code === e.target.value) ?? null;
                    onAccept?.(item);
                }, children: [_jsx("option", { value: "", children: "Select subdivision" }), subdivisions.map((s) => (_jsx("option", { value: s.code, children: s.name }, s.code)))] }), _jsx("button", { type: "button", onClick: onDecline, children: "Clear" })] }));
}
