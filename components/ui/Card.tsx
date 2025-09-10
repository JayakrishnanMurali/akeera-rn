import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';

export type CardProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export default function Card({ children, style, elevated = true, padding = 'md' }: CardProps) {
  const { theme } = useTheme();
  const { colors, radii, spacing, shadows } = theme;
  const pad = padding === 'none' ? 0 : padding === 'sm' ? spacing.sm : padding === 'lg' ? spacing.lg : spacing.md;

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: theme.mode === 'dark' ? '#1E293B' : colors.border,
          padding: pad,
          ...(elevated ? shadows.sm : {}),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
