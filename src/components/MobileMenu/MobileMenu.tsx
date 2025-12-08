import { X } from 'lucide-react';
import dekor from "../../images/dek.jpg";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";


interface MobileMenuProps {
  mobMenuIsOpen: boolean;
  setMobMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenu = ({ mobMenuIsOpen, setMobMenuIsOpen }: MobileMenuProps) => {
  return (
    <div
    className=
    {`fixed flex top-0 right-0 
    w-50 h-screen bg-stone-800 overflow-hidden
    transition-transform duration-300 ease-in-out
    ${mobMenuIsOpen ? 'translate-x-0' : 'translate-x-full'}
    sm:w-[30vw]`}
    
    >
      <button className=" absolute top-4 right-4 " onClick={()=>setMobMenuIsOpen(!mobMenuIsOpen)} aria-label='close mobile menu'>
        <X className=' stroke-white' size={32}/>
      </button>
      <div 
      className=" flex flex-col bg-repeat-y bg-size-[1.5rem] w-6 h-full"
      style={{backgroundImage: `url(${dekor})`}}
      ></div>

      <div className=" flex flex-col justify-start items-center w-full mx-auto py-16 ">
       <HeaderNav />
       <LanguageSwitcher/>
      </div>
      
    </div>
  );
};
