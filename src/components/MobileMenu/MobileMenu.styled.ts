import styled from "@emotion/styled";
import dekor from "../../images/dek.jpg";

interface Menu {
  mobMenuIsOpen: boolean;
}

export const MobileMenuConteiner = styled.div<Menu>`
  position: fixed;
  display: flex;
  top: 0px;
  right: 0px;
  width: 200px;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  animation: ${({ mobMenuIsOpen }) => (mobMenuIsOpen ? "slideIn" : "slideOut")}
    0.4s ease forwards;
  visibility: ${({ mobMenuIsOpen }) => (mobMenuIsOpen ? "visible" : "hidden")};
  transition: visibility 0s linear
    ${({ mobMenuIsOpen }) => (mobMenuIsOpen ? "0s" : "0.4s")};
  pointer-events: ${({ mobMenuIsOpen }) => (mobMenuIsOpen ? "auto" : "none")};

  & {
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.s}) and (max-width: 1023px) {
    width: 30vw;
  }
`;

export const DekorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url(${dekor});
  background-size: 25px;
  background-repeat: repeat-y;
  width: 25px;
  height: 100%;
`;
export const NavWrapper = styled.div`
    margin-top: 70px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;

`;

export const BattonCloseMenu = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
`;
