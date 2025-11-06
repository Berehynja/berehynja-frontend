import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";


export const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  font-size: 20px;
  padding: 5px 10px;
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