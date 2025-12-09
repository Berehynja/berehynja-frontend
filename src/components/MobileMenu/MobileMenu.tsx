import { X } from 'lucide-react';
import dekor from "../../images/dek.jpg";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useEffect } from 'react';


interface MobileMenuProps {
  mobMenuIsOpen: boolean;
  setMobMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenu = ({ mobMenuIsOpen, setMobMenuIsOpen }: MobileMenuProps) => {
   useEffect(() => {
    if (mobMenuIsOpen) {
      document.body.style.overflow = "hidden";   // блокируем скролл
    } else {
      document.body.style.overflow = "";         // возвращаем скролл
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobMenuIsOpen]);
  return (
    <>
    {mobMenuIsOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/30 "
          onClick={() => setMobMenuIsOpen(false)}
        />
      )}
    <div
    className=
    {`fixed flex top-0 right-0 
    w-50 h-screen bg-linear-to-br from-blue-100 to-yellow-100 overflow-hidden
    transition-transform duration-300 ease
    ${mobMenuIsOpen ? 'translate-x-0' : 'translate-x-full'}
    sm:w-[30vw]`}
    
    >
      <button className=" absolute top-4 right-4 z-10 " onClick={()=>setMobMenuIsOpen(!mobMenuIsOpen)} aria-label='close mobile menu'>
        <X className=' stroke-stone-500 ' size={32}/>
      </button>
      <div 
      className=" flex flex-col bg-repeat-y bg-size-[1.5rem] w-6 h-full"
      style={{backgroundImage: `url(${dekor})`}}
      ></div>

      <div className=" relative flex flex-col justify-start items-center w-full mx-auto py-16 ">
       <HeaderNav />
       <LanguageSwitcher/>
      </div>
      
    </div>
    </>
  );
};
