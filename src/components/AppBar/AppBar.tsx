import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Section, Container, Main } from "./AppBar.styled";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const AppBar = () => {
  return (
    <Section>
      <Container>
        <Header />
        <Main>
          <Suspense fallback={<div>Loading page....</div>}>
            <Outlet />
          </Suspense>
        </Main>
        <Footer />
      </Container>
    </Section>
  );
};
