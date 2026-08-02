import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useConversations } from '../hooks';
import { CHANNEL_ICONS, CHANNEL_LABELS, initialsOf, relativeTime } from '../utils/format';
import type { InboxStackParamList } from '../types/Navigation';
import type { Channel, Conversation } from '../types/Models';

type Nav = NativeStackNavigationProp<InboxStackParamList, 'Inbox'>;

type Filter = 'all' | Channel;

const FILTERS: Filter[] = ['all', 'sms', 'webchat', 'messenger', 'instagram', 'missed_call'];

const filterLabel = (f: Filter) => (f === 'all' ? 'All' : CHANNEL_LABELS[f]);

const InboxScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: conversations } = useConversations();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? conversations : conversations.filter(c => c.channel === filter)),
    [conversations, filter],
  );

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.6}
      onPress={() =>
        navigation.navigate('Conversation', {
          conversationId: item.id,
          contactName: item.contactName,
        })
      }>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
          {initialsOf(item.contactName)}
        </Text>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.contactName}
          </Text>
          <Text style={[styles.time, { color: theme.textMuted }]}>
            {relativeTime(item.lastMessageAt)}
          </Text>
        </View>

        <Text
          style={[
            styles.preview,
            { color: item.unread ? theme.text : theme.textSecondary },
          ]}
          numberOfLines={1}>
          {item.lastMessage}
        </Text>

        <View style={styles.channelRow}>
          <Ionicons name={CHANNEL_ICONS[item.channel]} size={12} color={theme.textMuted} />
          <Text style={[styles.channelLabel, { color: theme.textMuted }]}>
            {CHANNEL_LABELS[item.channel]}
          </Text>
        </View>
      </View>

      {item.unread && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <AppBar title="Inbox" />

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => {
            const selected = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.primary : 'transparent',
                    borderColor: selected ? theme.primary : theme.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipLabel,
                    { color: selected ? theme.onPrimary : theme.textSecondary },
                  ]}>
                  {filterLabel(f)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.borderLight }]} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>
            Nothing in {filterLabel(filter).toLowerCase()} yet.
          </Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
  },
  preview: {
    fontSize: 14,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelLabel: {
    fontSize: 12,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    marginLeft: 56,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default InboxScreen;
