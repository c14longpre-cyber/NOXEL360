import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthStore";
import { LanguageProvider } from "./language/LanguageStore";
import { RegionProvider } from "./region/RegionStore";
import "./index.css";
import "./styles/noxel-standard.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
              <AuthProvider>
                      <LanguageProvider>
              <RegionProvider>
                <App />
              </RegionProvider>
            </LanguageProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

