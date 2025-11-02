import logo from "../../assets/images/logo_berehynja1.jpg";
import { Languges } from "../icons/Languges";
import {
  ButtonLanguges,
  HeaderContainer,
  Link,
  LogoBox,
  LogoImg,
  LogoLink,
  LogoText,
  Nav,
} from "./Header.styled";

export function Header() {
  return (
    <HeaderContainer>
      <LogoLink to="/" end>
        <LogoBox>
          <LogoImg src={logo} alt="laibl" />
        </LogoBox>
        <LogoText>
          BEREHYNJA<span>Центр українського розвитку</span>
        </LogoText>
      </LogoLink>
      <Nav>
        <Link to="/" end>Головна</Link>
        <Link to="/about">Про Нас</Link>
        <Link to="/programs">Програми</Link>
        <Link to="/events">Події</Link>
        <Link to="/news">Новини</Link>
      </Nav>
      <ButtonLanguges><Languges/></ButtonLanguges>
    </HeaderContainer>
  );
}
