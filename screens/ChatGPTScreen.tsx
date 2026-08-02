import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Content-creation companion, kept separate from ZippyAssistant.
 *
 * The distinction follows the product copy: Zippy AI runs the business (follow
 * up on leads, summarise missed calls, book jobs), while this writes things —
 * posts, emails, descriptions, ideas.
 */
const CONTENT_TYPES = ['Social post', 'Email', 'Service description', 'Review reply', 'Ideas'];

const STARTERS = [
  'Write a post about our spring promo',
  'Draft a follow-up email for a quote',
  'Reply to a 5-star review',
  'Ideas to get more repeat customers',
];

const ChatGPTScreen: React.FC = () => {
  const { theme } = useTheme();
  const [type, setType] = useState(CONTENT_TYPES[0]);
  const [draft, setDraft] = useState('');

  return (
    <ScreenContainer>
      <AppBar title="ChatGPT" showBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.intro, { borderColor: theme.border }]}>
            <View style={[styles.introIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="color-wand" size={22} color={theme.onPrimary} />
            </View>
            <Text style={[styles.introTitle, { color: theme.text }]}>
              Your AI content &amp; support
            </Text>
            <Text style={[styles.introBody, { color: theme.textSecondary }]}>
              Write posts, emails and descriptions in your own voice — or ask for ideas when
              you're stuck.
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>What are you making?</Text>
          <View style={styles.chipRow}>
            {CONTENT_TYPES.map(item => {
              const active = type === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setType(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? theme.primary : 'transparent',
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: active ? theme.onPrimary : theme.textSecondary },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Start with</Text>
          <View style={styles.starters}>
            {STARTERS.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setDraft(s)}
                style={[
                  styles.starter,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}>
                <Text style={[styles.starterText, { color: theme.text }]}>{s}</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.composer, { borderTopColor: theme.borderLight }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Ask for a ${type.toLowerCase()}…`}
            placeholderTextColor={theme.textMuted}
            multiline
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Generate"
            disabled={!draft.trim()}
            style={[
              styles.sendButton,
              { backgroundColor: theme.primary, opacity: draft.trim() ? 1 : 0.4 },
            ]}>
            <Ionicons name="arrow-up" size={18} color={theme.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  intro: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  introIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  introBody: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  starters: {
    gap: 9,
  },
  starter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  starterText: {
    flex: 1,
    fontSize: 15,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 110,
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatGPTScreen;
