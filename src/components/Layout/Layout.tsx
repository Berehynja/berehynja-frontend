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
        <main >
          <div className=" flex flex-col justify-center items-center min-w-80 max-w-120 mx-auto 
          sm:max-w-3xl
          md:px-4 md:max-w-5xl
          lg:px-8 lg:max-w-7xl
          xl:px-10 xl:max-w-360

          ">
            <Suspense fallback={<div>Loading page....</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      <Footer />
    </div>
  );
};
