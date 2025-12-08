import styled from "@emotion/styled";
// import ReactCountryFlag from "react-country-flag";

// interface ToggleLandSwitcherProps {
//   isClickBurger: boolean;
// }

// export const LangugeBox = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   width: 100px;
//   margin: 0 auto;
//   background-color: white;
//   border-radius: 5px;
//   @media (min-width: 1024px) {
//     width: 140px;
//     margin: 0px;
//     padding: 0px;
//   }
// `;

// export const LangDefault = styled.div<ToggleLandSwitcherProps>`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 30px;
//   padding: 0 10px 0 10px;
//   cursor: pointer;
//   & svg {
//     width: 20px;
//     height: 20px;
//     margin-left: auto;
//     /* margin-right: 10px; */
//     fill: #111111ff;
//     transition: 40ms;
//     transform: ${({  isClickBurger }) =>
//      isClickBurger 
//       ? "rotate(180deg)"
//       : "rotate(0deg)"};
//   }
// `;

// export const Flag = styled(ReactCountryFlag)`
//   width: 20px;
//   height: 14px;
//   border-radius: 2px;
//   margin-right: 5px;
// `;

export const LangList = styled.ul`
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 5px 5px;
  bottom: -71px;
  left: 0px;
  background-color: white;
  padding: 0 10px 15px 10px;

`;

export const LangItem = styled.li`
  display: flex;
  margin-top: 15px;
  cursor: pointer;
`;
