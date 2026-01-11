import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider.tsx";

import "./i18n.tsx";
import "modern-normalize/modern-normalize.css";
import "./index.css";

import App from "./components/App/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/berehynja-frontend/">
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
