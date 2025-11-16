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
   flex-wrap: nowrap;
   align-items: center;
   flex-direction: column;
  padding: 14px 15px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(145deg, #3b7ddd, #2a5cb8);
  border: none;
  border-radius: 12px;
  box-shadow: 6px 6px 12px #1d3f7a;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 8px 8px 16px #6c9aebff;
    filter: brightness(1.1);
  }; 

  &.active {
    color: #fbff00ff;
    box-shadow: 5px 5px 16px #d0e1fdff;
    filter: brightness(1.2);
    
  }
`;