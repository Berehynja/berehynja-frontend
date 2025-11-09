import styled from "@emotion/styled";

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
  margin-top: 80px;
  @media (min-width: ${props => props.theme.breakpoints.s}) {
    margin-top: 100px;
  };
  @media (min-width: ${props => props.theme.breakpoints.m}) {
  };
  @media (min-width: ${props => props.theme.breakpoints.l}) {
  };
`;

export const Main = styled.main`
display: flex;
flex-direction: column;
justify-content: start;
align-items: center;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${props => props.theme.breakpoints.xs} ) and (max-width: 767px) {
    min-width: ${props => props.theme.breakpoints.xs};
   max-width: 480px;
  }

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    padding-left: ${props => props.theme.spacing.step * 4}px;
    padding-right: ${props => props.theme.spacing.step * 4}px;
    width: ${(props) => props.theme.breakpoints.s};
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    padding-left: ${props => props.theme.spacing.step * 5}px;
    padding-right: ${props => props.theme.spacing.step * 5}px;
    width: ${props => props.theme.breakpoints.m};
  }
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    width: ${props => props.theme.breakpoints.l};
  };
`;