import styled from "@emotion/styled";
import { Theme } from "../../styles/Theme.styled";
import  ban  from '../../images/banner223.webp';

export const Hero = styled.section`
  margin-top: ${Theme.spacing.step * 4 + 2}px;
`;

export const Baner = styled.div`
    width: 1240px;
    min-height: 900px;
    background-image: url(${ban});;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #000;
`;

export const HomeContainer = styled.div`
width: 100%;
`;