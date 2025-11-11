import styled from '@emotion/styled'

interface Menu {
    mobMenuIsOpen: boolean,
}


export const MobileMenuConteiner = styled.div<Menu>`
  position: absolute;
  display: block;
  top: 75px;
  right: 0;
  width: 200px;
  height: 100vh;
  padding-top: 40px;
  background-color: black;
  
  /* Анимация через keyframes */
  animation: ${({ mobMenuIsOpen }) =>
    mobMenuIsOpen
      ? '0.4s ease forwards slideIn'
      : '0.4s ease forwards slideOut'};
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

    @media (min-width: ${({ theme }) => theme.breakpoints.s}) and (max-width: 1023px) {
      width: 30vw;
      top: 95px;
  }
  };`

