import styled from "@emotion/styled";

export const FooterStyled = styled.footer`
  background-color: #161942ff;
`;

export const FooterContainer = styled.div`
  display: block;
  margin: 0 auto;
  /* overflow: hidden; */
  color: ${(props) => props.theme.colors.white};
  gap: ${(props) => props.theme.spacing.step * 1}px;
  padding: 20px ${(props) => props.theme.spacing.step * 0}px
    ${(props) => props.theme.spacing.step * 10}px
    ${(props) => props.theme.spacing.step * 0}px;
    
  @media (max-width: 767px) {
    min-width: 100px;
    max-width: 480px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 ${(props) => props.theme.spacing.step * 10}px
      ${(props) => props.theme.spacing.step * 20}px
      ${(props) => props.theme.spacing.step * 10}px;
    width: ${(props) => props.theme.breakpoints.s};
    gap: ${(props) => props.theme.spacing.step * 5}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.m}) {
    flex-wrap: nowrap;
    padding: 0 ${(props) => props.theme.spacing.step * 5}px
      ${(props) => props.theme.spacing.step * 20}px
      ${(props) => props.theme.spacing.step * 5}px;
    width: ${(props) => props.theme.breakpoints.m};
    gap: ${(props) => props.theme.spacing.step * 30}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.l}) {
    width: ${(props) => props.theme.breakpoints.l};
  }
`;


interface TogglePropsContact {
  isOpenContacts: boolean;
}
interface TogglePropsAdress {
  isOpenAdress: boolean;
}

export const FooterBoxContact = styled.div<TogglePropsContact>`
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  padding-bottom: 14px;
  @media  (max-width: 767px) {
    justify-content: start;
    overflow: hidden;
    max-width: 480px;
    max-height: ${({ isOpenContacts}) =>
     isOpenContacts ? "280px" : "72px"};
    transition: max-height 0.8s ease;
    border-bottom: 0.5px solid ${(props) => props.theme.colors.white};
    padding-left: 28px;
    padding-right: 28px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    padding-top: 40px;
  }
`;

export const FooterBoxAdress = styled.div<TogglePropsAdress>`
 display: flex;
  flex-direction: column;
  padding-top: 14px;
  padding-bottom: 14px;
  @media  (max-width: 767px) {
    justify-content: start;
    overflow: hidden;
    max-width: 480px;
    max-height: ${({ isOpenAdress}) =>
     isOpenAdress ? "280px" : "72px"};
    transition: max-height 0.8s ease;
    border-bottom: 0.5px solid ${(props) => props.theme.colors.white};
    padding-left: 28px;
    padding-right: 28px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    padding-top: 40px;
  }

`;

export const ArrowWraperContacts = styled.div<TogglePropsContact>`
display: flex;
justify-content: space-between;
align-items: center;
& > svg {
transform: ${({ isOpenContacts}) =>
    isOpenContacts  
      ? "rotate(180deg)"
      : "rotate(0deg)"};
    @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    display: none;
  }
    }

  
`;
export const ArrowWraperAdress = styled.div<TogglePropsAdress>`
display: flex;
justify-content: space-between;
align-items: center;
& > svg {
  background-color: inherit;
transform: ${({  isOpenAdress }) =>
     isOpenAdress 
      ? "rotate(180deg)"
      : "rotate(0deg)"};
      
    @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    display: none;
  }
    }

      
`;


export const FooterH2Styled = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.l};
  font-weight: ${(props) => props.theme.fontWeight.Medium};
  line-height: ${(props) => props.theme.lineHeight.l};
  padding-top: ${(props) => props.theme.spacing.step * 3}px;
  padding-bottom: ${(props) => props.theme.spacing.step * 3}px;
  @media  (max-width: 767px) {
    margin-bottom: ${(props) => props.theme.spacing.step * 2}px;
  }
`;

export const FooterLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: "nowrap";
  margin-top: ${(props) => props.theme.spacing.step * 2}px;
  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    margin-top: ${(props) => props.theme.spacing.step * 5}px;
  }
`;

export const FooterLinkStyled = styled.a`
  display: flex;
  align-items: center;
  min-height: 52px;
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSizes.s};
  line-height: ${(props) => props.theme.lineHeight.l};
  svg {
    margin-right: ${(props) => props.theme.spacing.step * 3}px;
  }

  &:hover {
     color: ${(props) => props.theme.colors.secOrange};
    text-decoration: underline;
    transition: 250ms;
  }

  &:active {
    color: ${(props) => props.theme.colors.secGreen};
    text-decoration: none;
  }

  @media  (max-width: 767px) {
    font-size: ${(props) => props.theme.fontSizes.s};
    font-weight: ${(props) => props.theme.fontWeight.Medium};
    line-height: ${(props) => props.theme.lineHeight.xl};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    padding: 10px 0;
  }
`;

export const SocialStyled = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.step * 11}px;
  
  @media  (max-width: 767px) {
    align-items: center;
    justify-content: center;
    padding-left: 28px;
    padding-right: 28px;
    margin-top: ${(props) => props.theme.spacing.step * 8}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    gap: ${(props) => props.theme.spacing.step * 10}px;
    padding-top: ${(props) => props.theme.spacing.step * 2 + 2}px;
    padding-bottom: ${(props) => props.theme.spacing.step * 2 + 2}px;
  }
`;

export const SocialLinkStyled = styled.a`
  display: block;

`;

export const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.step * 4}px;
  margin-top: ${(props) => props.theme.spacing.step * 8}px;
  padding: 0px 28px;
`;

export const License = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  padding: 0px 28px;
  margin-top: 40px;
  font-size: ${(props) => props?.theme.fontSizes.xs};
  font-weight: ${(props) => props?.theme.fontWeight.Light};
  line-height: ${(props) => props?.theme.lineHeight.m};
  letter-spacing: 1.1px;
  @media (min-width: ${(props) => props.theme.breakpoints.s}) {
    display: none;
  }
`;
