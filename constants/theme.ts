/**
 * Design tokens matching the Suppliers App Figma prototype.
 */

export const Palette = {
  ink: '#1F2A44',
  muted: '#626A7C',
  faint: '#A9B6CC',
  header: '#B9CBE8',
  teal: '#75C9C8',
  tealSoft: '#DFF2F1',
  coral: '#F28F6B',
  coralDeep: '#F28F6B',
  dotOrange: '#F28F6B',
  cardBorder: '#B9CBE8',
  screen: '#F8FAFD',
  pill: '#F8FAFD',
  white: '#FFFFFF',
} as const;

const tintColorLight = Palette.teal;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.screen,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  screenH: 12,
  screenBottom: 24,
  cardGap: 10,
  cardPadding: 12,
  headerPadding: 16,
} as const;

export const Layout = {
  buttonHeight: 48,
  searchHeight: 48,
  tabBarHeight: 76,
  iconBox: 40,
  screenMaxWidth: 480,
} as const;

export const Font = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_700Bold',
} as const;
