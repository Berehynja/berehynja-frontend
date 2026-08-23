import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";
import { CookieConsent } from "../ui/CookieConsent";
import { PageLoader } from "../ui/PageLoader";

export const Layout = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLanguage = (
      i18n.resolvedLanguage || i18n.language
    ).split("-")[0];

    document.documentElement.lang =
      currentLanguage === "ua" ? "uk" : currentLanguage;
  }, [i18n.language, i18n.resolvedLanguage]);

  return (
    <div className="layout">
      <ScrollToTop />
      <Header />

      <main className="font-nunito">
        <div className="mx-auto flex w-full max-w-120 flex-col items-center justify-center px-3 pb-16 md:max-w-5xl md:px-4 md:pb-20 lg:max-w-7xl lg:px-8 xl:max-w-360 xl:px-10">
          <Suspense fallback={<PageLoader visible />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
};