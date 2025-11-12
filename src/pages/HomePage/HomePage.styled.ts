import styled from "@emotion/styled";
import ban from "../../images/children.jpg";

export const Hero = styled.section`
width: 100%;
`;

export const Baner = styled.div`
  min-width: 320px;
  min-height: 300px;
 
  background-image: url(${ban});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #000;

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    width: ${props => props.theme.breakpoints.s};
    min-height: 500px;
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    width: ${props => props.theme.breakpoints.m};
    min-height: 650px;
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    width: ${props => props.theme.breakpoints.l};
    min-height: 850px;
  }
`;

export const HomeContainer = styled.div`
  width: 100%;
`;
