import { Link, Nav } from "./HeaderNav.styled";

export const HeaderNav = () => {
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
