import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import NoxelAccessModal from "./NoxelAccessModal";
import { useI18n } from "../useI18n";
import { HudButton } from "../components/hud/HudButton";
export default function NoxelAccessButton() {
    const [open, setOpen] = useState(false);
    const { t } = useI18n();
    return (_jsxs(_Fragment, { children: [_jsx(HudButton, { action: "continue", compact: true, className: "access-hud", label: t("auth.access"), onClick: () => setOpen(true) }), _jsx(NoxelAccessModal, { open: open, onClose: () => setOpen(false) })] }));
}
