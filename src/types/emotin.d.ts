import {  ThemeType } from '../styles/Theme.styled.ts';

// 2. Оголосіть, що ви модифікуєте модуль '@emotion/react'
declare module '@emotion/react' {
  // 3. Розширте стандартний інтерфейс Theme (з великої літери)
  export interface Theme extends ThemeType {}
}