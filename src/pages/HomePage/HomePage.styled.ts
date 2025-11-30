import styled from "@emotion/styled";
import ban from "../../images/children.jpg";

export const Hero = styled.section`
width: 100%;
`;

export const Baner = styled.div`
  min-width: 320px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start; 
  padding: 40px; 
  background-image: url(${ban});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #000;

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    max-width: ${props => props.theme.breakpoints.s};
    min-height: 500px;
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    max-width: ${props => props.theme.breakpoints.m};
    min-height: 650px;
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    max-width: ${props => props.theme.breakpoints.l};
    min-height: 850px;
  }
`;

export const BannerTitele = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 36px;
  color: #ffffffff;
  text-align: start;
  margin-bottom: 20px;
`;

export const BanerText = styled.p`
  display: block;
  width: 100%; 
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  text-indent: 30px;
  color: #ffffffff;
  margin: 0 auto;
  padding: 20px;
  font-size: 28px;
  line-height: 1.5;
  `;

export const HomeContainer = styled.div`
  width: 100%;
`;
