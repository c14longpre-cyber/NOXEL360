import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import NoxelAccessModal from "./NoxelAccessModal";
import { useI18n } from "../useI18n";
export default function NoxelAccessButton() {
    const [open, setOpen] = useState(false);
    const { t } = useI18n();
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "account-btn", onClick: () => setOpen(true), children: t("auth.access") }), _jsx(NoxelAccessModal, { open: open, onClose: () => setOpen(false) })] }));
}
