import { Link, Nav } from "./Navigation.styled";

export const Navigation = () => {
  return (
    <Nav  >
      <Link to="/" end>
        ГОЛОВНА
      </Link>
      <Link to="about">ПРО НАС</Link>
      <Link to="programs">ПРОГРАМИ</Link>
      <Link to="events">ПОДІЇ</Link>
      <Link to="news">НОВИНИ</Link>
    </Nav>
  );
};
