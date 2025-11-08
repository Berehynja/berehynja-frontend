import styled from "@emotion/styled";

// import { Theme } from '../../styles/Theme.styled.ts';

export const LayoutContainer = styled.div`
position: relative;
  `

export const Hidden = styled.div`
  /* visibility: hidden; */
  display: none;
  width: 100vw;
  height: 300vh;
  background-color: black;
  opacity: 0.2;

  position: absolute;
  top: 0;

  z-index: ${props => props.theme.zIndexes};

  &.isHidden {
    /* visibility: visible; */
    display: block;
  }
`;


export const Container = styled.div`
  /* outline: 1px solid red; */

 /* padding-left: ${props => props.theme.spacing.step * 7}px;
  padding-right: ${props => props.theme.spacing.step * 7}px; */
  margin-top: 70px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${props => props.theme.breakpoints.xs} ) and (max-width: 767px) {
    min-width: ${props => props.theme.breakpoints.xs};
   max-width: 430px;
  }

  @media (min-width: ${props => props.theme.breakpoints.s}) {

    /* padding-left: ${props => props.theme.spacing.step * 10}pxt
    padding-right: ${props => props.theme.spacing.step * 10}px; */
    width: ${(props) => { console.log(props);
        return props.theme.breakpoints.s}};
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin-top: 90px;
    /* padding-left: ${props => props.theme.spacing.step * 15}px;
    padding-right: ${props => props.theme.spacing.step * 15}px; */
    width: ${props => props.theme.breakpoints.m};
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    margin-top: 90px;
    padding-left: ${props => props.theme.spacing.step * 5 }px;
    padding-right: ${props => props.theme.spacing.step * 5 }px;
    width: ${props => props.theme.breakpoints.l};
  };
  /* @media (min-width: ${props => props.theme.breakpoints.xl}) {
    width: ${props => props.theme.breakpoints.xl};
  }
*/`;

export const Main = styled.main`
display: flex;
flex-direction: column;
justify-content: start;
align-items: center;
`;