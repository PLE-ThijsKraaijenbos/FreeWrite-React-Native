import { cssInterop } from 'nativewind';
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'h1' | 'h2' | 'h3' | 'body-lg' | 'body' | 'body-sm' | 'code' | 'title' | 'subtitle' | 'default' | 'small' | 'smallBold';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={StyleSheet.flatten([{ color: theme[themeColor ?? 'text'] }, styles[type], style])}
      {...rest}
    />
  );
}

cssInterop(ThemedText, { className: 'style' });

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'Unbounded_700Bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'Unbounded_700Bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Unbounded_700Bold',
  },
  'body-lg': {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Inter_400Regular',
  },
  body: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Inter_400Regular',
  },
  'body-sm': {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.OS === 'android' ? '700' : '500',
    fontSize: 12,
  },
  // Compatibility mappings
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'Unbounded_700Bold',
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'Unbounded_700Bold',
  },
  default: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Inter_400Regular',
  },
  small: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  smallBold: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter_700Bold',
  },
});
