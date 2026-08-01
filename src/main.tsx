import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./components/AuthProvider/AuthProvider.tsx";
import App from "./components/App/App.tsx";
import {
  LoaderProvider,
  SuspenseLoader,
} from "./components/ui/LoaderProvider.tsx";
import { ToastProvider } from "./components/ui/ToastProvider.tsx";

import "./i18n.tsx";
import "modern-normalize/modern-normalize.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/berehynja-frontend/">
      <AuthProvider>
        <ToastProvider />

        <LoaderProvider>
          <Suspense fallback={<SuspenseLoader loaderKey="app" />}>
            <App />
          </Suspense>
        </LoaderProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
