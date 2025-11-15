import styled from '@emotion/styled'

interface Menu {
    mobMenuIsOpen: boolean,
}


export const MobileMenuConteiner = styled.div<Menu>`
  position: fixed;
  top: 0px;
  right: 0px;
  width: 200px;
  height: 100vh;
  padding-top: 60px;
  background: #000000ff;
  overflow: hidden;
  /* Анимация */
  animation: ${({ mobMenuIsOpen }) => mobMenuIsOpen ? 'slideIn' : 'slideOut'} 0.4s ease forwards;
  visibility: ${({ mobMenuIsOpen }) => mobMenuIsOpen ? "visible" : "hidden"};
  transition: visibility 0s linear ${({ mobMenuIsOpen }) => mobMenuIsOpen ? "0s" : "0.4s"}; 
  pointer-events: ${({ mobMenuIsOpen }) => mobMenuIsOpen ? "auto" : "none"};

  /* Чтобы keyframes были доступны */
  & {
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100%); }
    }
}
    @media (min-width: ${({ theme }) => theme.breakpoints.s}) and (max-width: 1023px) {
      width: 30vw;
      /* top: 95px; */
  }
  
  ;`

  export const BattonCloseMenu = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  `;

