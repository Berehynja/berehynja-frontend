import styled from "@emotion/styled";
import ban from "../../images/banner223.webp";

export const Hero = styled.section``;

export const Baner = styled.div`
  min-width: 320px;
  min-height: 320px;
 
  background-image: url(${ban});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #000;

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    max-width: ${props => props.theme.breakpoints.s};
    height: ${props => props.theme.breakpoints.s};
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    max-width: ${props => props.theme.breakpoints.m};
    height: ${props => props.theme.breakpoints.m};
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    max-width: ${props => props.theme.breakpoints.l};
    height: ${props => props.theme.breakpoints.l};
  }
`;

export const HomeContainer = styled.div`
  width: 100%;
`;
