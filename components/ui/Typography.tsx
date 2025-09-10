import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../src/theme';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption' | 'overline';

export type TypographyProps = RNTextProps & {
  variant?: TypographyVariant;
  muted?: boolean;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

export default function Typography({
  children,
  variant = 'body',
  muted = false,
  weight,
  style,
  ...rest
}: TypographyProps) {
  const { theme } = useTheme();
  const { colors, fontSizes, fontWeights } = theme;

  const baseColor = muted ? colors.textMuted : colors.text;
  const [size, defaultWeight] = (() => {
    switch (variant) {
      case 'h1':
        return [fontSizes['3xl'], 'bold' as const];
      case 'h2':
        return [fontSizes['2xl'], 'bold' as const];
      case 'h3':
        return [fontSizes.xl, 'semibold' as const];
      case 'subtitle':
        return [fontSizes.lg, 'medium' as const];
      case 'caption':
        return [fontSizes.sm, 'regular' as const];
      case 'overline':
        return [fontSizes.xs, 'medium' as const];
      case 'body':
      default:
        return [fontSizes.md, 'regular' as const];
    }
  })();

  const fw = fontWeights[weight ?? defaultWeight];

  return (
    <RNText
      style={[{ color: baseColor, fontSize: size, fontWeight: fw }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

