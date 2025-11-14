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
  font-weight: 600;
  color: #fff;
  /* text-transform: uppercase; */
  background: linear-gradient(145deg, #3b7ddd, #2a5cb8);
  border: none;
  border-radius: 12px;
  box-shadow:
    6px 6px 12px #1d3f7a;
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

// export const NavButton = styled.button`
//   position: relative;
//   display: inline-block;
//   padding: 12px 20px;
//   font-size: 16px;
//   font-weight: 600;
//   color: #fff;
//   background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
//   border: none;
//   border-radius: 10px;
//   cursor: pointer;
//   user-select: none;
//   box-shadow: 0 6px 0 #1e40af, 0 6px 12px rgba(0, 0, 0, 0.3);
//   transition:
//     transform 0.15s ease,
//     box-shadow 0.15s ease,
//     filter 0.2s ease;

//   &:hover {
//     transform: translateY(-2px);
//     filter: brightness(1.05);
//     box-shadow: 0 8px 0 #1e40af, 0 8px 16px rgba(0, 0, 0, 0.35);
//   }

//   &:active {
//     transform: translateY(4px);
//     box-shadow: 0 2px 0 #1e40af, 0 2px 6px rgba(0, 0, 0, 0.25);
//   }

//   &:focus {
//     outline: none;
//     box-shadow:
//       0 6px 0 #1e40af,
//       0 0 0 4px rgba(59, 130, 246, 0.4);
//   }

// `;