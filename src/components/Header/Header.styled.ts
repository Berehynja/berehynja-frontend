import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Theme } from "../../styles/Theme.styled";

export const HeaderStyled = styled.header`
  position: relative;
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  left: 0;
  width: 100%;
  padding: 5px 0;
  /* background-color: #ffffffff; */
  background-image: repeating-linear-gradient(
    -20deg,
     #e8f2ffff, 
    #e8f2ffff 5px, 
    #fffdebff 10px,
    #fffdebff 20px
  );
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

export const HeaderContainer = styled.div`
   margin-left: auto;
   margin-right: auto;
   height: 70px;
  @media (min-width: ${Theme.breakpoints.xs}) and (max-width: 767px) {
    min-width: ${Theme.breakpoints.xs};
    max-width: 480px;
  }
  @media (min-width: ${Theme.breakpoints.s}) {
    width: ${Theme.breakpoints.s};
    height: 90px;
  }
  @media (min-width: ${Theme.breakpoints.m}) {
    width: ${Theme.breakpoints.m};
  }
  @media (min-width: ${Theme.breakpoints.l}) {
    padding: 0 ${Theme.spacing.step * 5}px;
    width: ${Theme.breakpoints.l};
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  background-color: transparent;
  z-index: 10;

`;

export const LogoText = styled.p`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  justify-content: center;
  align-items: center;
  margin-left: 15px;

  font-size: 22px;
  font-weight: 500;
  font-family: "montserrat", sans-serif;
  color: #000000;
  & span {
    font-size: 20px;
    font-weight: 500;
    font-family: "Caveat", cursive;
  }
  @media (min-width: ${Theme.breakpoints.s}) {
    font-size: 32px;
    margin-left: 20px;
  }
`;

export const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
  @media (max-width: 767px) {
    width: 70px;
    height: 70px;
  }
  }
`;

export const LogoLink = styled(NavLink)`
  display: flex;
  justify-content: center;
  text-decoration: none;
`;

export const ButtonLanguges = styled.button`
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border: none;
  cursor: pointer;
  & svg {
    fill: #ffffffff;
    transition: 250ms;
  }
  &:hover svg {
    stroke: #1973faff;
    fill: #fffcceff;
  }
  @media (max-width: 1023px) {
    /* width: ${Theme.breakpoints.m}; */
  }
`;

export const ButtonMobMenu = styled.button`
padding-left: 15px;
padding-right: 15px;
height: 70px;
cursor: pointer;
`;