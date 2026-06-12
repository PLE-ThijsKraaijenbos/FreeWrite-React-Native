import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shadows } from '@/constants/shadows';

import ChatBubbleIcon from '@/assets/icons/chat-bubble.svg';
import ChatBubbleOutlineIcon from '@/assets/icons/chat-bubble-outline.svg';
import HomeIcon from '@/assets/icons/home.svg';
import HomeOutlineIcon from '@/assets/icons/home-outline.svg';
import QuillIcon from '@/assets/icons/quill.svg';
import QuillOutlineIcon from '@/assets/icons/quill-outline.svg';

cssInterop(LinearGradient, { className: 'style' });

export type TabKey = 'index' | 'journey' | 'community';
type Variant = 'icon-only' | 'default' | 'labeled';

const TABS = [
  { key: 'index' as TabKey, label: 'Home', Icon: HomeIcon, OutlineIcon: HomeOutlineIcon },
  { key: 'journey' as TabKey, label: 'Write', Icon: QuillIcon, OutlineIcon: QuillOutlineIcon },
  { key: 'community' as TabKey, label: 'Community', Icon: ChatBubbleIcon, OutlineIcon: ChatBubbleOutlineIcon },
];

interface NavigationProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  variant?: Variant;
}

export function Navigation({ activeTab, onTabPress, variant = 'icon-only' }: NavigationProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-around bg-neutral-100 border-t border-neutral-200 px-4 pt-3"
      style={{ paddingBottom: bottom + 12 }}
    >
      {TABS.map(({ key, label, Icon, OutlineIcon }) => {
        const isActive = activeTab === key;
        const showLabel = variant === 'labeled' || (variant === 'default' && isActive);

        return (
          <TouchableOpacity
            key={key}
            onPress={() => onTabPress(key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className="items-center justify-center"
          >
            {isActive ? (
              <LinearGradient
                colors={['#7DDFC2', '#3DC8A0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={shadows.drop}
                className="w-14 h-14 rounded-xl items-center justify-center"
              >
                <Icon width={28} height={28} color="#FAFAF8" />
              </LinearGradient>
            ) : (
              <View className="w-14 h-14 items-center justify-center">
                <OutlineIcon width={28} height={28} color="#8F8D84" />
              </View>
            )}
            {showLabel && (
              <Text
                className={`text-body-sm font-body mt-1 ${isActive ? 'text-primary-400' : 'text-neutral-400'}`}
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
