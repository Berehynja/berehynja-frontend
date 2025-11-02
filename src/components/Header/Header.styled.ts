import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { NavLink } from "react-router-dom";

export const HeaderContainer = styled.header`
  /* position: fixed; */
  display: flex;
  transition: top 0.2s;
  align-items: center;
  padding: 5px 15px;
  border-bottom: 1px solid #000;
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
  margin: 0;

  font-size: 38px;
  font-weight: 500;
  font-family: "Times New Roman";
  color: #000000;
  & span {
    font-size: 16px;
    font-weight: 400;
    font-family: "Times New Roman";
  }
`;

export const LogoImg = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
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

export const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  font-size: 25px;
  padding: 5px 10px;
  /* width: 100px; */
  border-radius: 5px;
  align-items: center;
  text-decoration: none;
  color: #aca8a3;
  font-weight: 500;
  background-color: #fff;
  &:hover {
    color: white;
    background-color: #b2b2b2;
    transition: 250ms;
  }
  &.active {
    color: white;
    background-color: #4d4d4d;
    transition: 250ms;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  height: 100px;
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
