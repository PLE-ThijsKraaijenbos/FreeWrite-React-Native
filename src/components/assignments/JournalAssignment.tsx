import { useState } from 'react';
import { View } from 'react-native';

import { AssignmentLayout } from '@/components/assignments/AssignmentLayout';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { JournalContent } from '@/types/journey';

type Props = {
  content: JournalContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function JournalAssignment({ content, responseData, onComplete }: Props) {
  const [text, setText] = useState('');

  const saved = responseData as { text?: string } | undefined;
  const isEmpty = text.trim().length === 0;

  if (saved?.text) {
    return (
      <AssignmentLayout title={content.title_text} scroll>
        <TextInput
          variant="journal"
          value={saved.text}
          editable={false}
        />
      </AssignmentLayout>
    );
  }

  return (
    <AssignmentLayout title={content.title_text} scroll>
      <ThemedText type="body">
        Write whatever comes to mind, there&apos;s no right or wrong answer.
      </ThemedText>
      <TextInput
        variant="journal"
        placeholder={content.input_field_placeholder}
        value={text}
        onChangeText={setText}
      />
      <Divider />
      <CTAButton label="Save" onPress={() => onComplete({ text })} disabled={isEmpty} />
    </AssignmentLayout>
  );
}
