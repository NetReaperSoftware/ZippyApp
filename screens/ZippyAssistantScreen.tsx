import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';

const SUGGESTIONS = [
  'Follow up with my unread leads',
  'Draft a reply to Marcus',
  "Summarise today's missed calls",
  'Write a promo post for this week',
];

/**
 * Zippy AI assistant. The transcript is a static sample for now — wiring the
 * composer to the OpenAI-backed endpoint is a later pass.
 */
const ZippyAssistantScreen: React.FC = () => {
  const { theme } = useTheme();
  const [draft, setDraft] = useState('');

  return (
    <ScreenContainer>
      <AppBar title="Zippy AI" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.intro, { borderColor: theme.border }]}>
            <View style={[styles.introIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="sparkles" size={22} color={theme.onPrimary} />
            </View>
            <Text style={[styles.introTitle, { color: theme.text }]}>
              Your AI front desk
            </Text>
            <Text style={[styles.introBody, { color: theme.textSecondary }]}>
              Zippy answers missed calls, follows up with leads, and books
              appointments while you're on the job.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Try asking
          </Text>

          <View style={styles.suggestions}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setDraft(s)}
                style={[
                  styles.suggestion,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}>
                <Text style={[styles.suggestionText, { color: theme.text }]}>{s}</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.composer, { borderTopColor: theme.borderLight }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask Zippy anything"
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
            accessibilityLabel="Send"
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
    gap: 20,
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestions: {
    gap: 10,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suggestionText: {
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

export default ZippyAssistantScreen;
