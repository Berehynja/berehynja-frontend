import { useState } from "react";
import { LogoSvg } from "../icons/Logo";
import { Languges } from "../icons/Languges";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Navigation } from "../Navigation/Navigation";
import {
  HeaderStyled,
  ButtonLanguges,
  HeaderContainer,
  HeaderWrapper,
  LogoBox,
  LogoLink,
  LogoText,
  ButtonMobMenu,
} from "./Header.styled";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { MobMenuIcon } from "../icons/MobMenuIcon";

export function Header() {
  const [mobMenuIsOpen, setMobMenuIsOpen] = useState(false);
  const screenWidth = useWindowSize();

  const ToggleMobMenu = () => {
    setMobMenuIsOpen(!mobMenuIsOpen);
  };

  return (
    <HeaderStyled className="header">
      <HeaderContainer className="header_container">
        <HeaderWrapper className="header_wrapper">
          <LogoLink to="/" end>
            <LogoBox>
              <LogoSvg />
            </LogoBox>
            <LogoText>
              BEREHYNJA<span>український простір</span>
            </LogoText>
          </LogoLink>

          {screenWidth >= 1024 ? (
            <>
              <Navigation />
              <ButtonLanguges>
                <span>UA</span>
                <Languges />
              </ButtonLanguges>
            </>
          ) : (
            <>
              <ButtonMobMenu onClick={ToggleMobMenu}>
                <MobMenuIcon />
              </ButtonMobMenu>
              <MobileMenu
                mobMenuIsOpen={mobMenuIsOpen}
                setMobMenuIsOpen={setMobMenuIsOpen}
              />
            </>
          )}
        </HeaderWrapper>
      </HeaderContainer>
    </HeaderStyled>
  );
}
