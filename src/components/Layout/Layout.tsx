import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";
import { useTranslation } from "react-i18next";

export const Layout = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchParams.get("lang") !== i18n.language) {
      searchParams.set("lang", i18n.language);
      navigate({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    }
  }, [location.pathname, i18n.language, navigate]);
  return (
    <div className="layout">
      <ScrollToTop />
      <Header />
      <main className="font-nunito">
        <div className=" mx-auto flex max-w-120 min-w-80 flex-col items-center justify-center px-3
        md:max-w-5xl md:px-4 
        lg:max-w-7xl lg:px-8 
        xl:max-w- xl:max-full xl:max-h-full xl:max-w-360 xl:px-10">
          <Suspense fallback={<div>Loading page....</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};
