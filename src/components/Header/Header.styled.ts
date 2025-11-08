import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { Theme } from "../../styles/Theme.styled";

export const HeaderStyled = styled.header`
  position: fixed;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  left: 0;
  width: 100%;
  padding: 5px 0;
  background-color: ${Theme.colors.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

export const HeaderContainer = styled.div`
   margin-left: auto;
   margin-right: auto;
  @media (min-width: ${Theme.breakpoints.xs}) and (max-width: 767px) {
    min-width: ${Theme.breakpoints.xs};
    max-width: 430px;
  }
  @media (min-width: ${Theme.breakpoints.s}) {
    width: ${Theme.breakpoints.s};
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
  background-color: #ffffff;
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

const rotateAnimation = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
`;

export const ButtonLanguges = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  & svg {
    fill: #ffffffff;
    transition: 250ms;
  }
  &:hover svg {
    stroke: #1973faff;
    fill: #fffcceff;
    /* animation: ${rotateAnimation} 2500ms linear infinite; */
  }
`;
