import styled from '@emotion/styled';

export const SvgFooterStyled = styled.svg`
  fill: ${props => props.theme.colors.white};

  &:hover,
  &:focus {
    fill: ${props => props.theme.colors.secGreen};
    cursor: pointer;
  }

  &:active {
    transform: scale(0.95);
    fill: ${props => props.theme.colors.secGreen};
    cursor: pointer;
  }
`;