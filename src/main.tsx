import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./i18n.tsx";
import "modern-normalize/modern-normalize.css";
import { Global, ThemeProvider } from "@emotion/react";
import { GlobalStyles } from "./styles/GlobalStyles.styled.ts";
import { Theme } from "./styles/Theme.styled.ts";

import App from "./components/App/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/berehynja-frontend">
      <ThemeProvider theme={Theme}>
        <Global styles={GlobalStyles} />
        <Suspense fallback={<div>Loading...</div>}>
        <App />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
