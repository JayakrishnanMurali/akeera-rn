export type ColorScale = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  success: string;
  warning: string;
  danger: string;
};

export type Radii = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type Spacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
};

export type FontSizes = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
};

export type FontWeights = {
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
};

export type ThemeTokens = {
  colors: ColorScale;
  radii: Radii;
  spacing: Spacing;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  shadows: {
    sm: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width: number; height: number }; elevation: number };
    md: { shadowColor: string; shadowOpacity: number; shadowRadius: number; shadowOffset: { width: number; height: number }; elevation: number };
  };
};

export const SUPABASE_GREEN = '#3ECF8E';

export const lightTokens: ThemeTokens = {
  colors: {
    background: '#FFFFFF',
    surface: '#F7F7F8',
    border: '#E5E7EB',
    text: '#0B1220',
    textMuted: '#6B7280',
    accent: SUPABASE_GREEN,
    accentText: '#0B1220',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
  },
};

export const darkTokens: ThemeTokens = {
  ...lightTokens,
  colors: {
    background: '#0B1220',
    surface: '#101826',
    border: '#1F2A3C',
    text: '#F8FAFC',
    textMuted: '#A0AEC0',
    accent: SUPABASE_GREEN,
    accentText: '#0B1220',
    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#F87171',
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

