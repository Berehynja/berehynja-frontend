export interface ThemeType {
  colors: {
    [key: string]: string;}
  fontSizes: {
    [key: string]: string;}
  lineHeight: { 
    [key: string]: string;}
  fontWeight: {
    [key: string]: number;}
  breakpoints: {
    [key: string]: string;}
  animations: {
    cubicBezier: string;
    transitionDuration: string;}
  spacing: {
    step: number;}
  zIndexes: {
    [key: string]: number;}
  }

export const Theme = Object({
  colors: {
    // main
    green: '#B2AB73',
    grey: '#B2B2B2',
    orange: '#E68314',
    black: '#000000',
    white: '#ffffff',
    beige: '#F3ECDC',
    mainBackground: '#ffffff',

    // secondary
    secGreen: '#D8D4B8',
    secGrey: '#D8D8D8',
    secBlack: '#4F4F4F',
    secOrange: '#ffa55bff',
    // other
    brightGreen: '#00bd35',
    brightRed: '#ff1515',
    brightBlue: '#9ce0ffff',
    brightYelow: '#fdffa3ff',

    filterImg: 'rgba(178, 178, 178, 0.60)',
  },
  fontSizes: {
    xxs: '12px',
    xs: '14px',
    s: '16px',
    m: '18px',
    l: '20px',
    xl: '24px',
    xxl: '32px',
    xxxl: '56px',
  },
  lineHeight: {
    s: '16px',
    m: '18px',
    l: '20px',
    xl: '24px',
    xxl: '32px',
    xxxl: '64px',
  },

  fontWeight: {
    Light: 300,
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
  },

  breakpoints: {
    xs: '320px',
    s: '768px',
    m: '1024px',
    l: '1280px',
    // xl: '1440px',
  },
  animations: {
    // cubicBezier: 'cubic-bezier(0, 0.110, 0.35, 2);',
    cubicBezier: 'cubic-bezier(.17,.67,.83,.67)',
    transitionDuration: '0.1s',
  },
  spacing: {
    step: 4,
  },
  zIndexes: {
    header: 800,
    filterSearch: 12,
    scrollToTop: 20,
    foldedContainer: 12,
    priceSliderBase: 1,
    carousel: 5,
    app: 12,
    priceSlider: 12,
    sortSelect: 12,
    catalogPetButtons: 15,
    backdropLoader: 888,
    loginMenu: 10,
  },
}) as ThemeType;