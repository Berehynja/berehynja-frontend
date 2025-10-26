import { HeaderContainer, Link, Nav } from "./Header.styled";

export function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Link to="/" end>Home</Link>
        <Link to="service">Service</Link>
        <Link to="galery">Galery</Link>
      </Nav>
    </HeaderContainer>
  );
}