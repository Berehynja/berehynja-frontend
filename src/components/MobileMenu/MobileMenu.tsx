import { MobileMenuConteiner } from "./MobileMenu.styled";
import { Navigation } from "../Navigation/Navigation";
import { ButtonLanguges } from "../Header/Header.styled";
import { Languges } from "../icons/Languges";

export const MobileMenu = ({ mobMenuIsOpen }: { mobMenuIsOpen: boolean }) => {
  return (
    <MobileMenuConteiner mobMenuIsOpen={mobMenuIsOpen}>
      <Navigation />
      <ButtonLanguges>
        <span>UA</span>
        <Languges />
      </ButtonLanguges>
    </MobileMenuConteiner>
  );
};
