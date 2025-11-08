import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import {  Container, Main, LayoutContainer } from "./Layout.styled";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const Layout = () => {
  return (
    <LayoutContainer>
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
