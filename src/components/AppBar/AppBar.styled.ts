import styled from "@emotion/styled";

// import { Theme } from '../../styles/Theme.styled.ts';


export const Hidden = styled.div`
  /* visibility: hidden; */
  display: none;
  width: 100vw;
  height: 300vh;
  background-color: black;
  opacity: 0.2;

  position: absolute;
  top: 0;

  /* z-index: 6; */
  z-index: ${props => props.theme.zIndexes};

  &.isHidden {
    /* visibility: visible; */
    display: block;
  }
`;

export const Section = styled.section`
  /* padding-top: ${props => props.theme.spacing.step * 5}px; */
  /* padding-bottom: ${props => props.theme.spacing.step * 5}px; */

  @media (min-width: ${({theme}) => theme.breakpoints.s}) {
    /* padding-top: ${props => props.theme.spacing.step * 10}px; */
    /* padding-bottom: ${props => props.theme.spacing.step * 10}px; */
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    /* padding-top: ${props => props.theme.spacing.step * 20}px; */
    /* padding-bottom: ${props => props.theme.spacing.step * 20}px; */
  }
`;

export const Container = styled.div`
  /* outline: 1px solid red; */

 /* padding-left: ${props => props.theme.spacing.step * 7}px;
  padding-right: ${props => props.theme.spacing.step * 7}px; */

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
    /* padding-left: ${props => props.theme.spacing.step * 15}px;
    padding-right: ${props => props.theme.spacing.step * 15}px; */
    width: ${props => props.theme.breakpoints.m};
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    padding-left: ${props => props.theme.spacing.step * 5 }px;
    padding-right: ${props => props.theme.spacing.step * 5 }px;
    width: ${props => props.theme.breakpoints.l};
  };
  /* @media (min-width: ${props => props.theme.breakpoints.xl}) {
    width: ${props => props.theme.breakpoints.xl};
  }
*/`;

export const Main = styled.div``;