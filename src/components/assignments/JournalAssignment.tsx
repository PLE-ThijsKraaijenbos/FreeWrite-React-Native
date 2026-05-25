import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { JournalContent, LetterContent } from '@/types/journey';

type TextWritingProps = {
  content: JournalContent | LetterContent;
  preamble?: string;
  placeholder: string;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

function TextWritingAssignment({ content, preamble, placeholder, responseData, onComplete }: TextWritingProps) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [text, setText] = useState('');

  const saved = responseData as { text?: string } | undefined;
  const isEmpty = text.trim().length === 0;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <ThemedText type="subtitle" className="mb-6">
          {content.title_text}
        </ThemedText>

        {preamble && (
          <ThemedText themeColor="textSecondary" className="mb-4">
            {preamble}
          </ThemedText>
        )}

        {saved?.text ? (
          <View className="p-4 rounded-xl min-h-40" style={{ backgroundColor: theme.backgroundElement }}>
            <ThemedText className="text-base leading-6">{saved.text}</ThemedText>
          </View>
        ) : (
          <TextInput
            multiline
            numberOfLines={6}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            style={{
              backgroundColor: theme.backgroundElement,
              color: theme.text,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              lineHeight: 24,
              minHeight: 160,
              textAlignVertical: 'top',
            }}
          />
        )}
      </ScrollView>

      {!saved?.text && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <Pressable
            onPress={() => onComplete({ text })}
            disabled={isEmpty}
            className="items-center justify-center py-4 rounded-xl"
            style={{ backgroundColor: isEmpty ? theme.backgroundElement : '#3c87f7' }}>
            <ThemedText style={{ color: isEmpty ? theme.textSecondary : '#ffffff', fontWeight: '700' }}>
              Submit
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

type JournalProps = {
  content: JournalContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function JournalAssignment({ content, responseData, onComplete }: JournalProps) {
  return (
    <TextWritingAssignment
      content={content}
      placeholder="Write here..."
      responseData={responseData}
      onComplete={onComplete}
    />
  );
}

type LetterProps = {
  content: LetterContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function LetterAssignment({ content, responseData, onComplete }: LetterProps) {
  return (
    <TextWritingAssignment
      content={content}
      preamble="Dear..."
      placeholder="Write your letter here..."
      responseData={responseData}
      onComplete={onComplete}
    />
  );
}
