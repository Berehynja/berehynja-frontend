import { BattonCloseMenu, DekorWrapper, MobileMenuConteiner, NavWrapper } from "./MobileMenu.styled";
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
      <BattonCloseMenu onClick={()=>setMobMenuIsOpen(!mobMenuIsOpen)}>
        <CrossToDelete/>
      </BattonCloseMenu>
      <DekorWrapper/>

      <NavWrapper><Navigation />
      <ButtonLanguges>
        <span>UA</span>
        <Languges />
      </ButtonLanguges></NavWrapper>
      
      {/* <DekorWrapper><Dekor/><Dekor/></DekorWrapper> */}
    </MobileMenuConteiner>
  );
};
