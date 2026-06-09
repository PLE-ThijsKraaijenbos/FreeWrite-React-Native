import { useState } from 'react';
import { NativeSyntheticEvent, TextInput as RNTextInput, TextInputContentSizeChangeEventData, TextInputProps, Text, View } from 'react-native';

import PostageStampIcon from '@/assets/icons/postage-stamp.svg';

type Props = TextInputProps & {
  variant?: 'default' | 'letter' | 'journal';
  label?: string;
};

const LETTER_FONT_SIZE = 20;
const LETTER_LINE_HEIGHT = 26;
const JOURNAL_FONT_SIZE = 16;
const JOURNAL_LINE_HEIGHT = 22;
const JOURNAL_MARGIN = 32;

export function TextInput({ variant = 'default', label, placeholder, value, onChangeText, multiline, ...rest }: Props) {
  const minLines = variant === 'journal' ? 5 : 4;
  const lineHeight = variant === 'journal' ? JOURNAL_LINE_HEIGHT : LETTER_LINE_HEIGHT;
  const [numLines, setNumLines] = useState(minLines);

  const handleContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const h = e.nativeEvent.contentSize.height;
    setNumLines(Math.max(minLines, Math.ceil(h / lineHeight)));
  };

  if (variant === 'letter') {
    return (
      <View className="rounded-lg shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] bg-secondary-100 border-4 border-secondary-300 p-4">
        <View className="flex-row justify-between items-start pb-2">
          <Text className="text-body font-body text-neutral-600">Dear me,</Text>
          <PostageStampIcon width={24} height={24} />
        </View>
        <View style={{ position: 'relative', minHeight: minLines * LETTER_LINE_HEIGHT }}>
          {Array.from({ length: numLines }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: (i + 1) * LETTER_LINE_HEIGHT - 1,
                height: 1,
                backgroundColor: '#B05530',
              }}
            />
          ))}
          <RNTextInput
            {...rest}
            multiline
            placeholder={placeholder}
            placeholderTextColor="#8F8D84"
            value={value}
            onChangeText={onChangeText}
            textAlignVertical="top"
            onContentSizeChange={handleContentSizeChange}
            style={{
              fontSize: LETTER_FONT_SIZE,
              lineHeight: LETTER_LINE_HEIGHT,
              fontFamily: 'Inter_400Regular',
              color: '#2A2924',
              minHeight: minLines * LETTER_LINE_HEIGHT,
              backgroundColor: 'transparent',
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              includeFontPadding: false,
            }}
          />
        </View>
      </View>
    );
  }

  if (variant === 'journal') {
    return (
      <View
        className="rounded-lg shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] bg-neutral-100 border-2 border-neutral-400"
        style={{ paddingVertical: 8 }}>
        <View style={{ position: 'relative', minHeight: minLines * JOURNAL_LINE_HEIGHT }}>
          {/* Horizontal ruled lines + hole-punch dots */}
          {Array.from({ length: numLines }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: (i + 1) * JOURNAL_LINE_HEIGHT - 1,
              }}>
              <View style={{ height: 1, backgroundColor: '#CCCBC4' }} />
              <View
                style={{
                  position: 'absolute',
                  left: 10,
                  top: -2,
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: '#2A2924',
                }}
              />
            </View>
          ))}
          {!value && (
            <Text
              style={{
                position: 'absolute',
                top: 0,
                left: JOURNAL_MARGIN + 8,
                right: 16,
                fontSize: JOURNAL_FONT_SIZE,
                lineHeight: JOURNAL_LINE_HEIGHT,
                fontFamily: 'Inter_400Regular',
                color: '#8F8D84',
                pointerEvents: 'none',
              }}>
              {placeholder ?? 'Reflect on your thoughts, feelings and experiences...'}
            </Text>
          )}
          <RNTextInput
            {...rest}
            multiline
            placeholder=""
            value={value}
            onChangeText={onChangeText}
            textAlignVertical="top"
            onContentSizeChange={handleContentSizeChange}
            style={{
              fontSize: JOURNAL_FONT_SIZE,
              lineHeight: JOURNAL_LINE_HEIGHT,
              fontFamily: 'Inter_400Regular',
              color: '#2A2924',
              minHeight: minLines * JOURNAL_LINE_HEIGHT,
              backgroundColor: 'transparent',
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: JOURNAL_MARGIN + 8,
              paddingRight: 16,
              includeFontPadding: false,
            }}
          />
        </View>
        {/* Vertical left margin line — child of outer View so it spans paddingVertical, rendered last to paint above ruled lines */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: JOURNAL_MARGIN,
            width: 1,
            backgroundColor: '#7B3020',
          }}
        />
      </View>
    );
  }

  return (
    <View>
      {label && <Text className="text-body font-body-bold text-neutral-500 pb-1">{label}</Text>}
      <View
        className={`rounded-lg shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] bg-neutral-200 flex-row ${multiline ? 'items-start' : 'items-center'} px-4 py-3`}>
        <RNTextInput
          multiline={multiline}
          {...rest}
          placeholder={placeholder ?? 'example@email.com'}
          placeholderTextColor="#8f8d84"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-body font-body text-neutral-600"
        />
      </View>
    </View>
  );
}
