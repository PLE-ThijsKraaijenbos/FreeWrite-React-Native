import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';

cssInterop(LinearGradient, { className: 'style' });

const TOP_BOTTOM = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

const textShadow = StyleSheet.create({
  white: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  // Give the drop shadow room at the bottom of the frame so it isn't clipped,
  // then pull the layout back up by the same amount (net-zero, keeps the label
  // visually centred in the button).
  room: { paddingBottom: 4, marginBottom: -4 },
});

type CTAButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'default';
  size?: 'default' | 'small';
  disabled?: boolean;
  onPress?: () => void;
};

export function CTAButton({ label, variant = 'primary', size = 'default', disabled, onPress }: CTAButtonProps) {
  const small = size === 'small';
  const colored = variant !== 'default';

  const colors: [string, string] =
    variant === 'primary' ? ['#7DDFC2', '#3DC8A0'] :
    variant === 'secondary' ? ['#FCAA88', '#F47D4E'] :
    ['#FAFAF8', '#EBEBE6'];

  return (
    <Pressable onPress={onPress} disabled={disabled} className={`${small ? '' : 'w-full'} ${disabled ? 'opacity-50' : ''}`}>
      <LinearGradient
        colors={colors}
        {...TOP_BOTTOM}
        style={[shadows.drop, disabled && { elevation: 0 }]}
        className={`flex-row justify-center items-center rounded-lg ${small ? 'px-4 py-2' : 'py-3'}`}
      >
        <ThemedText
          type={small ? 'h3' : 'h2'}
          style={colored ? [textShadow.white, textShadow.room] : undefined}
          className={`text-center ${small ? '' : 'flex-1'} ${colored ? 'text-neutral-100' : 'text-neutral-600'}`}
        >
          {label}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

export function CTASmall(props: Omit<CTAButtonProps, 'size'>) {
  return <CTAButton {...props} size="small" />;
}

const ctaLargeGradients: Record<1 | 2 | 3, [string, string]> = {
  1: ['#7DDFC2', '#3DC8A0'],
  2: ['#3DC8A0', '#1A8C72'],
  3: ['#1A8C72', '#0D5C4A'],
};

type CTALargeProps = {
  label: string;
  gradient: 1 | 2 | 3;
  icon?: ReactNode;
  onPress?: () => void;
};

export function CTALarge({ label, gradient, icon, onPress }: CTALargeProps) {
  return (
    <Pressable onPress={onPress} className="w-full">
      <LinearGradient
        colors={ctaLargeGradients[gradient]}
        {...TOP_BOTTOM}
        style={shadows.drop}
        className="flex-row items-center gap-2.5 pl-3 pr-4 py-2 rounded-lg"
      >
        <ThemedText type="h3" style={[textShadow.white, textShadow.room]} className="flex-1 text-center text-neutral-100">
          {label}
        </ThemedText>
        {icon && (
          <View className="w-20 h-20 overflow-hidden">
            {icon}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

type DoubleCTAProps = {
  // 'default' — neutral grey left + green right (e.g. Cancel / Confirm).
  // 'secondary' — orange left + green right (two distinct choices).
  variant?: 'default' | 'secondary';
  leftLabel: string;
  rightLabel: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};

export function DoubleCTA({ variant = 'default', leftLabel, rightLabel, onPressLeft, onPressRight }: DoubleCTAProps) {
  const secondary = variant === 'secondary';

  return (
    <View className="w-full flex-row items-center gap-8">
      <Pressable onPress={onPressLeft} className="flex-1">
        <LinearGradient
          colors={secondary ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
          {...TOP_BOTTOM}
          style={shadows.drop}
          className="py-3 rounded-lg justify-center items-center"
        >
          <ThemedText
            type="h3"
            style={secondary ? [textShadow.white, textShadow.room] : undefined}
            className={`text-center ${secondary ? 'text-neutral-100' : 'text-neutral-600'}`}
          >
            {leftLabel}
          </ThemedText>
        </LinearGradient>
      </Pressable>
      <Pressable onPress={onPressRight} className="flex-1">
        <LinearGradient
          colors={['#7DDFC2', '#3DC8A0']}
          {...TOP_BOTTOM}
          style={shadows.drop}
          className="py-3 rounded-lg justify-center items-center"
        >
          <ThemedText type="h3" style={[textShadow.white, textShadow.room]} className="text-center text-neutral-100">
            {rightLabel}
          </ThemedText>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
