import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';

type ChannelKey = 'sms' | 'email' | 'voice';

const CHANNELS: { key: ChannelKey; label: string; icon: string }[] = [
  { key: 'sms', label: 'SMS', icon: 'chatbubble-outline' },
  { key: 'email', label: 'Email', icon: 'mail-outline' },
  { key: 'voice', label: 'Voice', icon: 'mic-outline' },
];

const AUDIENCES = [
  { key: 'all', label: 'All contacts', count: 318 },
  { key: 'leads', label: 'New leads', count: 42 },
  { key: 'clients', label: 'Past clients', count: 176 },
];

/** Placeholder history so the screen shows what a sent broadcast looks like. */
const SENT = [
  { id: 'b1', title: 'Spring service reminder', channel: 'SMS', reach: 176, when: '3d ago' },
  { id: 'b2', title: 'Holiday hours', channel: 'Email', reach: 318, when: '2w ago' },
];

const BroadcastsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [channel, setChannel] = useState<ChannelKey>('sms');
  const [audience, setAudience] = useState('all');
  const [message, setMessage] = useState('');

  return (
    <ScreenContainer>
      <AppBar title="Broadcasts" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Channel</Text>
        <View style={styles.row}>
          {CHANNELS.map(c => {
            const active = channel === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                onPress={() => setChannel(c.key)}
                style={[
                  styles.channel,
                  {
                    backgroundColor: active ? theme.primary : theme.cardBackground,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}>
                <Ionicons
                  name={c.icon}
                  size={18}
                  color={active ? theme.onPrimary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.channelLabel,
                    { color: active ? theme.onPrimary : theme.textSecondary },
                  ]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Audience</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {AUDIENCES.map((a, index) => {
            const selected = audience === a.key;
            return (
              <TouchableOpacity
                key={a.key}
                onPress={() => setAudience(a.key)}
                style={[
                  styles.audienceRow,
                  index < AUDIENCES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.borderLight,
                  },
                ]}>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={19}
                  color={selected ? theme.primary : theme.textMuted}
                />
                <Text style={[styles.audienceLabel, { color: theme.text }]}>{a.label}</Text>
                <Text style={[styles.audienceCount, { color: theme.textMuted }]}>
                  {a.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="What do you want to send?"
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

        <PrimaryButton title="Send broadcast" onPress={() => {}} />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Recently sent</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {SENT.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.sentRow,
                index < SENT.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <View style={styles.sentBody}>
                <Text style={[styles.sentTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.sentMeta, { color: theme.textMuted }]}>
                  {item.channel} · {item.reach} recipients · {item.when}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  channel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
  },
  channelLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  audienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  audienceLabel: {
    flex: 1,
    fontSize: 15,
  },
  audienceCount: {
    fontSize: 13,
  },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  sentBody: {
    flex: 1,
    gap: 3,
  },
  sentTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sentMeta: {
    fontSize: 12.5,
  },
});

export default BroadcastsScreen;
