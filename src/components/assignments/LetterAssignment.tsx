import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { LetterContent } from '@/types/journey';

type Props = {
  content: LetterContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function LetterAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [text, setText] = useState('');

  const saved = responseData as { text?: string } | undefined;
  const isEmpty = text.trim().length === 0;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <ThemedText type="h2" className="mb-6">
          {content.title_text}
        </ThemedText>

        {saved?.text ? (
          <View className="p-4 rounded-xl min-h-40" style={{ backgroundColor: theme.backgroundElement }}>
            <ThemedText className="text-body-sm">{saved.text}</ThemedText>
          </View>
        ) : (
          <TextInput
            variant="letter"
            placeholder="Write your letter here..."
            value={text}
            onChangeText={setText}
          />
        )}
      </ScrollView>

      {!saved?.text && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <CTAButton label="Submit" onPress={() => onComplete({ text })} disabled={isEmpty} />
        </View>
      )}
    </View>
  );
}
