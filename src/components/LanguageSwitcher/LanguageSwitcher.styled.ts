import styled from "@emotion/styled";


export const LangugeBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  border: none;
  cursor: pointer;
  & svg {
    margin-left: 5px;
    fill: #ffffffff;
    transition: 250ms;
  }
  &:hover svg {
    stroke: #1973faff;
    fill: #fffcceff;
  }
  @media (max-width: 1023px) {
    margin-bottom: 20px;
  }
`;