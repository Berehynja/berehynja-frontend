import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Section, Container, Main, AppBarContainer } from "./AppBar.styled";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const AppBar = () => {
  return (
    <AppBarContainer>
      <Header />
      <Section>
        <Container>
          <Main>
            <Suspense fallback={<div>Loading page....</div>}>
              <Outlet />
            </Suspense>
          </Main>
        </Container>
      </Section>
      <Footer />
    </AppBarContainer>
  );
};
