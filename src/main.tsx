import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./components/AuthProvider/AuthProvider.tsx";
import App from "./components/App/App.tsx";
import { ToastProvider } from "./components/ui/ToastProvider.tsx";

import "./i18n.tsx";
import "modern-normalize/modern-normalize.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider />
        
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
