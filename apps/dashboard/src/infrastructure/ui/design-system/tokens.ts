/**
 * Source of truth of the My Docs design system.
 * Every value is mirrored as a CSS variable in `apps/dashboard/src/styles.css`.
 */
export const palette = {
  white: '#FFFFFF',
  grey: {
    50: '#F5F7F9',
    100: '#EEF0F4',
    200: '#DDE2EB',
    300: '#C5CDDD',
    400: '#AEB9CF',
    500: '#96A4C1',
    600: '#7E8FB3',
    700: '#6A7896',
    800: '#57617A',
    900: '#434B5D',
    950: '#303441',
  },
  blue: {
    25: '#FAFCFF',
    50: '#F7F9FF',
    100: '#EEF4FF',
    200: '#DCE4FD',
    300: '#B9C7FB',
    400: '#96ACF9',
    500: '#3D64ED',
    600: '#324CAB',
    700: '#304287',
    900: '#2E3862',
  },
  orange: {
    50: '#FFF2ED',
    200: '#FFBEA8',
    500: '#FA420F',
    700: '#C62E08',
    900: '#7E2210',
  },
  amber: {
    50: '#FFF4D5',
    300: '#FED173',
    500: '#FB9814',
    800: '#9B4911',
  },
  green: {
    25: '#F2FBF9',
    100: '#D2F5EE',
    200: '#A6E9DE',
    300: '#64D3C5',
    500: '#2BA198',
    700: '#1D6864',
    900: '#1B4644',
  },
  red: {
    50: '#FFE2E4',
    500: '#ED1136',
    700: '#C8082D',
  },
  purple: {
    25: '#F4F0FF',
    50: '#E8E2FE',
    100: '#E0D5FF',
    200: '#C8B4FE',
    600: '#691FC1',
    800: '#4D198A',
  },
  ink: {
    800: '#1F2129',
    900: '#191E25',
  },
} as const;

export const tokens = {
  colors: {
    background: palette.grey[50],
    foreground: palette.grey[950],
    card: palette.white,
    primary: { DEFAULT: palette.blue[700], foreground: palette.white },
    accent: { DEFAULT: palette.blue[100], foreground: palette.blue[700] },
    heading: palette.blue[900],
    body: palette.grey[900],
    muted: palette.grey[800],
    subtle: palette.grey[700],
    placeholder: palette.grey[600],
    disabled: palette.grey[500],
    border: palette.grey[200],
    input: palette.grey[400],
    link: palette.blue[500],
    ring: palette.blue[500],
    brand: palette.orange[500],
    success: palette.green[700],
    error: palette.red[700],
    warning: palette.amber[800],
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  shadow: {
    popover: '0 8px 24px rgb(25 30 37 / 0.12)',
    panel: '0 12px 32px rgb(25 30 37 / 0.18)',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    displayFontFamily: 'Poppins, sans-serif',
  },
  layout: {
    sidebarWidth: '240px',
    topbarHeight: '56px',
  },
} as const;
