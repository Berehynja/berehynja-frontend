import { Link, Nav } from "./Navigation.styled";

export const Navigation = () => {
  return (
    <Nav>
      <Link to="/" end>
        Головна
      </Link>
      <Link to="about">Про Нас</Link>
      <Link to="programs">Програми</Link>
      <Link to="events">Події</Link>
      <Link to="news">Новини</Link>
    </Nav>
  );
};
