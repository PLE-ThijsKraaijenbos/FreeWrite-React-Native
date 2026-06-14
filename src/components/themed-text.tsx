import { cssInterop } from 'nativewind';
import { Text, type TextProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'h1' | 'h2' | 'h3' | 'body-lg' | 'body' | 'body-sm' | 'body-lg-bold' | 'body-bold' | 'body-sm-bold';
  themeColor?: ThemeColor;
};

const typeClasses: Record<NonNullable<ThemedTextProps['type']>, string> = {
  h1: 'text-h1 font-heading-bold text-neutral-600',
  h2: 'text-h2 font-heading-bold text-neutral-600',
  h3: 'text-h3 font-heading-bold text-neutral-600',
  'body-lg': 'text-body-lg font-body text-neutral-500',
  body: 'text-body font-body text-neutral-500',
  'body-sm': 'text-body-sm font-body text-neutral-500',
  'body-lg-bold': 'text-body-lg font-body-bold text-neutral-500',
  'body-bold': 'text-body font-body-bold text-neutral-500',
  'body-sm-bold': 'text-body-sm font-body-bold text-neutral-500',
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      className={typeClasses[type]}
      style={[themeColor ? { color: theme[themeColor] } : undefined, style]}
      {...rest}
    />
  );
}

cssInterop(ThemedText, { className: 'style' });
