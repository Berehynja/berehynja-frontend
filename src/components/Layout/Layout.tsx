import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import {  Container, Main, LayoutContainer } from "./Layout.styled";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";

export const Layout = () => {
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
