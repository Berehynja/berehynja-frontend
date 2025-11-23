import { useState } from "react";
import { LogoSvg } from "../icons/Logo";
import { useWindowSize } from "../../hooks/useWindowSize";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import {
  HeaderStyled,
  HeaderContainer,
  HeaderWrapper,
  LogoBox,
  LogoLink,
  LogoText,
  ButtonMobMenu,
} from "./Header.styled";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { MobMenuIcon } from "../icons/MobMenuIcon";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

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
              <HeaderNav />
              <LanguageSwitcher/>
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
