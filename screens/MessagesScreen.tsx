import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
};

// Placeholder data so the list renders while the UI is built out.
const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Dana Whitfield',
    preview: 'That works for me — see you Thursday.',
    time: '8m',
    unread: true,
  },
  {
    id: '2',
    name: 'Marcus Lee',
    preview: 'Can we move the appointment to 3pm?',
    time: '1h',
    unread: true,
  },
  {
    id: '3',
    name: 'Priya Raman',
    preview: 'Thanks for the quick turnaround!',
    time: '4h',
    unread: false,
  },
  {
    id: '4',
    name: 'Owen Bright',
    preview: 'Sending the paperwork over tonight.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    name: 'Sofia Alvarez',
    preview: 'Got it, appreciate the update.',
    time: 'Mon',
    unread: false,
  },
];

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const MessagesScreen: React.FC = () => {
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.row} activeOpacity={0.6}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
          {initialsOf(item.name)}
        </Text>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.time, { color: theme.textMuted }]}>{item.time}</Text>
        </View>
        <Text
          style={[
            styles.preview,
            { color: item.unread ? theme.text : theme.textSecondary },
          ]}
          numberOfLines={1}>
          {item.preview}
        </Text>
      </View>

      {item.unread && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
      </View>

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.borderLight }]} />
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
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
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    marginLeft: 56,
  },
});

export default MessagesScreen;
