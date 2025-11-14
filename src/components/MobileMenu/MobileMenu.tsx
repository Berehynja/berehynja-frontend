import { BattonCloseMenu, MobileMenuConteiner } from "./MobileMenu.styled";
import { Navigation } from "../Navigation/Navigation";
import { ButtonLanguges } from "../Header/Header.styled";
import { Languges } from "../icons/Languges";
import { CrossToDelete } from "../icons/CrossToDelete";

interface MobileMenuProps {
  mobMenuIsOpen: boolean;
  setMobMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenu = ({ mobMenuIsOpen, setMobMenuIsOpen }: MobileMenuProps) => {
  return (
    <MobileMenuConteiner className="mobile_menu" mobMenuIsOpen={mobMenuIsOpen}>

      <Navigation />
      <BattonCloseMenu onClick={()=>setMobMenuIsOpen(!mobMenuIsOpen)}>
        <CrossToDelete/>
      </BattonCloseMenu>
      <ButtonLanguges>
        <span>UA</span>
        <Languges />
      </ButtonLanguges>
    </MobileMenuConteiner>
  );
};
