import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { adjust } from '@/src/theme/color-utils';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  loading?: boolean;
  accessibilityLabel?: string;
};

export default function Button({
  variant = 'solid',
  size = 'md',
  disabled,
  style,
  textStyle,
  onPress,
  children,
  loading,
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  const paddings: Record<Size, { py: number; px: number; font: number }> = {
    sm: { py: spacing.xs + 2, px: spacing.md, font: 14 },
    md: { py: spacing.sm + 2, px: spacing.lg, font: 16 },
    lg: { py: spacing.md, px: spacing['2xl'], font: 18 },
  };

  const baseBg =
    variant === 'solid' ? colors.accent : variant === 'outline' ? 'transparent' : 'transparent';
  const baseText = variant === 'solid' ? colors.accentText : colors.text;
  const baseBorder = variant === 'outline' ? colors.border : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => {
        const bg =
          variant === 'solid'
            ? pressed
              ? adjust(colors.accent, -20)
              : baseBg
            : pressed
            ? theme.mode === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.06)'
            : baseBg;
        const borderColor = pressed && variant === 'outline' ? colors.text : baseBorder;
        const opacity = disabled ? 0.5 : 1;
        const { py, px } = paddings[size];
        return [
          {
            backgroundColor: bg,
            borderColor,
            borderWidth: variant === 'outline' ? 1 : 0,
            paddingVertical: py,
            paddingHorizontal: px,
            borderRadius: radii.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            opacity,
          } as ViewStyle,
          style,
        ];
      }}
    >
      {loading ? (
        <ActivityIndicator color={baseText} />
      ) : (
        <Text
          style={[
            {
              color: baseText,
              fontSize: paddings[size].font,
              fontWeight: '600',
            } as TextStyle,
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
