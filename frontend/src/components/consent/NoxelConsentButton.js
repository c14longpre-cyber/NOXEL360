import { jsx as _jsx } from "react/jsx-runtime";
/** The vanilla component must first be installed in Vite's index.html. */
export function NoxelConsentButton(props) {
    return _jsx("button", { ...props, type: "button", "data-noxel-consent-settings": true, children: props.children || 'Préférences de confidentialité' });
}
