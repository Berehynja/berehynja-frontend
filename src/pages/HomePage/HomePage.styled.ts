import styled from "@emotion/styled";
import { Theme } from "../../styles/Theme.styled";
import  ban  from '../../images/banner223.webp';

export const Hero = styled.section`
  margin-top: ${Theme.spacing.step * 4 + 2}px;
`;

export const Baner = styled.div`
    min-width: 290px;
    min-height: 290px;
    background-image: url(${ban});;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #000;

@media (min-width: ${Theme.breakpoints.s}) {
    min-width: ${Theme.breakpoints.s};
    min-height: ${Theme.breakpoints.s};

  }

    @media (min-width: ${Theme.breakpoints.m}) {
     min-width: ${Theme.breakpoints.m};
    min-height: ${Theme.breakpoints.m};
  }
  @media (min-width: ${Theme.breakpoints.l}) {
    width: auto;
  };
`;

export const HomeContainer = styled.div`
width: 100%;
`;