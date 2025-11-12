import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";



export const Nav = styled.nav`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (max-width: 1023px) {
    flex-direction: column;
    margin-bottom: 20px;
  }
`;

export const Link = styled(NavLink)`
  display: flex;
  justify-content: center;
  font-size: 20px;
  padding: 5px 10px;
  border-radius: 10px;
  align-items: center;
  text-decoration: none;
  color: #000000ff;
  font-weight: 400;
  background-color: #fff;
  &:hover {
    color: white;
    background-color: #ddbe8fff;
    transition: 250ms;
  }
  &.active {
    color: white;
    background-color: #e68a00ff;
    /* border: 1px solid #000000ff; */
    /* transition: 250ms; */
   
   transition: "all 0.25s ease" ;
    pointer-events: none;
  }
`;

