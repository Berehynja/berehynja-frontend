import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "./AppBar.styled";
import { Header } from "../Header/Header";

export const AppBar = () => {
  return (
    <Container>
      <Header/>
      <Suspense fallback={<div>Loading page....</div>}>
        <Outlet />
      </Suspense>
    </Container>
  );
}