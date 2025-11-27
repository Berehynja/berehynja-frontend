import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {  Container, Main, LayoutContainer } from "./Layout.styled";
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
    <LayoutContainer>
      <ScrollToTop />
      <Header />
        <Container>
          <Main>
            <Suspense fallback={<div>Loading page....</div>}>
              <Outlet />
            </Suspense>
          </Main>
        </Container>
      <Footer />
    </LayoutContainer>
  );
};
