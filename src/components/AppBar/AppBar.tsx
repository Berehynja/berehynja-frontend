import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Section, Container, Main } from "./AppBar.styled";
import { Header } from "../Header/Header";

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
      </Container>
    </Section>
  );
};
