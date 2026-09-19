import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AccountProvider } from "./account/AccountStore";
import { AuthProvider } from "./auth/AuthStore";
import { LanguageProvider } from "./language/LanguageStore";
import { RegionProvider } from "./region/RegionStore";
import "./index.css";
import "./styles/noxel-standard.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <AccountProvider>
            <LanguageProvider>
              <RegionProvider>
                <App />
              </RegionProvider>
            </LanguageProvider>
          </AccountProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

