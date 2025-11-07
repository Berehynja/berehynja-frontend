import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { Theme } from "../../styles/Theme.styled";

export const HeaderStyled = styled.header`
padding: 5px 0;
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
  /* position: fixed; */
  display: flex;
  transition: top 0.2s;
  align-items: center;
  padding: 0px 15px;
  /* border-bottom: 1px solid #000; */
  background-color: #ffffff;
  z-index: 10;
  > nav {
    display: flex;
  }
`;

export const LogoText = styled.p`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 20px;

  font-size: 32px;
  font-weight: 500;
  font-family: "Times New Roman";
  color: #000000;
  & span {
    font-size: 16px;
    font-weight: 400;
    font-family: "Times New Roman";
  }
`;

export const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
