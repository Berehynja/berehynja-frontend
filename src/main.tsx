import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "modern-normalize/modern-normalize.css";
import { Global, ThemeProvider } from "@emotion/react";
import { GlobalStyles } from "./styles/GlobalStyles.tsx";
import { theme } from "./styles/theme.tsx";

import App from "./components/App/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/berehynja-frontend">
      <ThemeProvider theme={theme}>
        <Global styles={GlobalStyles} />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
