import { LogoSvg } from "../icons/Logo";
import { Languges } from "../icons/Languges";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Navigation } from "../Navigation/Navigation";
import {
  ButtonLanguges,
  HeaderContainer,
  LogoBox,
  LogoLink,
  LogoText,
 
} from "./Header.styled";

export function Header() {
  const screenWidth = useWindowSize();
  return (
    <HeaderContainer>
      <LogoLink to="/" end>
        <LogoBox>
          <LogoSvg />
        </LogoBox>
        <LogoText>
          BEREHYNJA<span>Центр українського розвитку</span>
        </LogoText>
      </LogoLink>
       {screenWidth >= 1024 && <Navigation />}
      <ButtonLanguges><Languges/></ButtonLanguges>
    </HeaderContainer>
  );
}
