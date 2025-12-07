import { BattonCloseMenu, DekorWrapper, MobileMenuConteiner, NavWrapper } from "./MobileMenu.styled";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import { CrossToDelete } from "../icons/CrossToDelete";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useWindowSize } from "../../hooks/useWindowSize";


interface MobileMenuProps {
  mobMenuIsOpen: boolean;
  setMobMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenu = ({ mobMenuIsOpen, setMobMenuIsOpen }: MobileMenuProps) => {
  const screenWidth = useWindowSize();
  return (
    <MobileMenuConteiner className="mobile_menu" mobMenuIsOpen={mobMenuIsOpen}>
      <BattonCloseMenu onClick={()=>setMobMenuIsOpen(!mobMenuIsOpen)}>
        <CrossToDelete/>
      </BattonCloseMenu>
      <DekorWrapper/>

      <NavWrapper><HeaderNav />
      {screenWidth < 640 && <LanguageSwitcher/>}
      </NavWrapper>
      
      {/* <DekorWrapper><Dekor/><Dekor/></DekorWrapper> */}
    </MobileMenuConteiner>
  );
};
