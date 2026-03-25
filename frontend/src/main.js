import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AccountProvider } from "./account/AccountStore";
import { AuthProvider } from "./auth/AuthStore";
import "./index.css";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID");
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(GoogleOAuthProvider, { clientId: GOOGLE_CLIENT_ID, children: _jsx(AuthProvider, { children: _jsx(AccountProvider, { children: _jsx(App, {}) }) }) }) }) }));
