import styled from "@emotion/styled";
import { NavLink } from 'react-router-dom';

export const HeaderContainer = styled.header`
  /* position: fixed; */
  display: flex;
  transition: top 0.2s;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-bottom: 1px solid #000;
  background-color: #ffffff;
  z-index: 10;
  > nav {
    display: flex;
  }
`;


export const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  font-size: 25px;
  padding: 8px 16px;
  width: 100px;
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
  gap: 80px;
  justify-content: center;
  align-items: center;
  width: 100%;
`;