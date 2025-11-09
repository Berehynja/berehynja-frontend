import styled from "@emotion/styled";
import { Theme } from "../../styles/Theme.styled";
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

  @media (min-width: ${Theme.breakpoints.s}) {
    max-width: ${Theme.breakpoints.s};
    height: ${Theme.breakpoints.s};
  }
  @media (min-width: ${Theme.breakpoints.m}) {
    max-width: ${Theme.breakpoints.m};
    height: ${Theme.breakpoints.m};
  }
  @media (min-width: ${Theme.breakpoints.l}) {
    max-width: ${Theme.breakpoints.l};
    height: ${Theme.breakpoints.l};
  }
`;

export const HomeContainer = styled.div`
  width: 100%;
`;
