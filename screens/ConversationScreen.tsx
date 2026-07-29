import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useMessages } from '../hooks';
import { clockTime } from '../utils/format';
import type { InboxStackParamList } from '../types/Navigation';
import type { Message } from '../types/Models';

type Nav = NativeStackNavigationProp<InboxStackParamList, 'Conversation'>;
type Route = RouteProp<InboxStackParamList, 'Conversation'>;

const QUICK_REPLIES = ["Thanks for reaching out!", "We're open today", 'Can I book you in?'];

const ConversationScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data: messages } = useMessages(params.conversationId);
  const [draft, setDraft] = useState('');

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.bubbleRow, item.outbound ? styles.alignEnd : styles.alignStart]}>
      <View
        style={[
          styles.bubble,
          item.outbound
            ? { backgroundColor: theme.primary }
            : { backgroundColor: theme.surfaceElevated },
        ]}>
        {item.fromAI && (
          <View style={styles.aiTag}>
            <Ionicons name="sparkles" size={11} color={theme.onPrimary} />
            <Text style={[styles.aiTagText, { color: theme.onPrimary }]}>Zippy AI</Text>
          </View>
        )}
        <Text
          style={[
            styles.bubbleText,
            { color: item.outbound ? theme.onPrimary : theme.text },
          ]}>
          {item.body}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            { color: item.outbound ? theme.onPrimary : theme.textMuted },
          ]}>
          {clockTime(item.sentAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <AppBar title={params.contactName} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.textMuted }]}>
              No messages in this conversation yet.
            </Text>
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}>
          {QUICK_REPLIES.map(reply => (
            <TouchableOpacity
              key={reply}
              onPress={() => setDraft(reply)}
              style={[styles.quickChip, { borderColor: theme.border }]}>
              <Text style={[styles.quickChipText, { color: theme.textSecondary }]}>
                {reply}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.composer, { borderTopColor: theme.borderLight }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Draft with Zippy AI"
            style={[styles.aiButton, { backgroundColor: theme.surfaceElevated }]}>
            <Ionicons name="sparkles" size={18} color={theme.primary} />
          </TouchableOpacity>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
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
  list: {
    padding: 16,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignEnd: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.9,
  },
  aiTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
  quickRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  quickChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickChipText: {
    fontSize: 13,
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
  aiButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 110,
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: 15,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ConversationScreen;
