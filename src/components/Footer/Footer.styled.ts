import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const FooterStyled = styled.footer`
    background-color: #161942ff;
  /* margin-top: ${props => props.theme.spacing.step * 8}px; */
`;

export const FooterContainer = styled.div`
  display: block;
  margin: 0 auto;
  overflow: hidden;
  color: ${props => props.theme.colors.white};
  gap: ${props => props.theme.spacing.step * 1}px;
  padding: 20px ${props => props.theme.spacing.step * 0}px
    ${props => props.theme.spacing.step * 10}px
    ${props => props.theme.spacing.step * 0}px;
  @media (min-width: ${props => props.theme.breakpoints.xs}) and (max-width: 767px) {
    min-width: ${props => props.theme.breakpoints.xs};
    max-width: 480px;
  }

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 ${props => props.theme.spacing.step * 10}px
      ${props => props.theme.spacing.step * 20}px
      ${props => props.theme.spacing.step * 10}px;
    width: ${props => props.theme.breakpoints.s};
    gap: ${props => props.theme.spacing.step * 5}px;
  };
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    flex-wrap: nowrap;
    padding: 0 ${props => props.theme.spacing.step * 5}px
      ${props => props.theme.spacing.step * 20}px
      ${props => props.theme.spacing.step * 5}px;
    width: ${props => props.theme.breakpoints.m};
    gap: ${props => props.theme.spacing.step * 10}px;
  };
  @media (min-width: ${props => props.theme.breakpoints.l}) {
    width: ${props => props.theme.breakpoints.l};
  };
`;


interface ToggleProps {
    isOpenContacts: boolean;
  isOpenAdress: boolean;
}

export const FooterBox = styled.div<ToggleProps>`
  /* width: 250px; */
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  padding-bottom: 14px;
  @media (min-width: ${props =>props.theme.breakpoints.xs}) and (max-width: 767px) {
    justify-content: start;
    position: relative;
    overflow: hidden;
    max-height: ${({
      isOpenContacts,
      isOpenAdress,
    }) =>
      isOpenContacts || isOpenAdress
        ? '280px'
        : '72px'};
    transition: max-height 0.8s ease;
    border-bottom: 0.5px solid ${props => props.theme.colors.white};
    padding-left: 28px;
    padding-right: 28px;
  };

  @media (min-width: ${props => props.theme.breakpoints.s}) {
    padding-top: 40px;
    width: 280px;
  }
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    width: 350px;
  }
`;


export const ArrowWraper = styled.span<ToggleProps>`
  position: absolute;
  right: 25px;
  top: 18px;
  transform: ${({
    isOpenContacts,
    isOpenAdress,
  }) =>
  isOpenContacts || isOpenAdress
      ? 'rotate(180deg)'
      : 'rotate(0deg)'};
  @media (min-width: ${props => props.theme.breakpoints.s}) {
    display: none;
  }
`;

export const FooterH2Styled = styled.h2`
  /* color: ${props => props.theme.colors.black}; */
  font-size: ${props => props.theme.fontSizes.l};
  font-weight: ${props => props.theme.fontWeight.Medium};
  line-height: ${props => props.theme.lineHeight.l};
  padding-top: ${props => props.theme.spacing.step * 3}px;
  padding-bottom: ${props => props.theme.spacing.step * 3}px;
  @media (min-width: ${props =>props.theme.breakpoints.xs}) and (max-width: 767px) {
    margin-bottom: ${props => props.theme.spacing.step * 2}px;
  }
`;

export const FooterList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-wrap: 'nowrap';
  gap: ${props => props.theme.spacing.step * 2}px;
  margin-top: ${props => props.theme.spacing.step * 2}px;
  @media (min-width: ${props => props.theme.breakpoints.s}) {
    margin-top: ${props => props.theme.spacing.step * 5}px;
  }
`;

export const FooterLinkStyled = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.s};
  line-height: ${props => props.theme.lineHeight.l};

  svg {
      margin-right: ${props => props.theme.spacing.step * 3}px;;
    };

  &:hover {
    text-decoration: underline;
  };

  &:active {
    color: ${props => props.theme.colors.secGreen};
    text-decoration: none;
  }

  &.active {
    color: ${props => props.theme.colors.white};
    /* background-color: ${props => props.theme.colors.accent}; */
    /* padding: 6px 12px; */
    /* border-radius: 4px; */
    /* transform: scale(1); */
    pointer-events: none;
  };
  @media (min-width: ${props =>props.theme.breakpoints.xs}) and (max-width: 767px) {
    
    font-size: ${props => props.theme.fontSizes.s};
    font-weight: ${props => props.theme.fontWeight.Medium};
    line-height: ${props => props.theme.lineHeight.xl};
    margin-bottom: ${props => props.theme.spacing.step * 4}px;
    
  }
  @media (min-width: ${props => props.theme.breakpoints.s}) {
    padding: 10px 0;
  }
`;

export const SocialListStyled = styled.ul`
  display: flex;
  gap: ${props => props.theme.spacing.step * 4}px;
  margin-top: ${props => props.theme.spacing.step * 14}px;
  @media (min-width: ${props => props.theme.breakpoints.xs}) and (max-width: 767px) {
    padding-left: 28px;
    padding-right: 28px;
  }
  @media (min-width: ${props => props.theme.breakpoints.s}) {
    gap: ${props => props.theme.spacing.step * 10}px;
    margin-top: ${props => props.theme.spacing.step * 5}px;
  }
`;

export const SocialLinkStyled = styled.a`
  display: block;
  ${'' /* padding: 8px; */}
`;

export const ContactsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.step * 4}px;
  margin-top: ${props => props.theme.spacing.step * 8}px;
  padding: 0px 28px;
`;

export const LicenseLink = styled(Link)`
  padding: 0px 28px;
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeight.Light};
  line-height: ${props => props.theme.lineHeight.m};
  letter-spacing: 1.1px;
`;