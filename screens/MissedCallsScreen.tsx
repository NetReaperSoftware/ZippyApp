import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useMissedCalls } from '../hooks';
import { relativeTime } from '../utils/format';
import type { DashboardStackParamList, MainTabParamList } from '../types/Navigation';
import type { MissedCall, TextBackStatus } from '../types/Models';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'MissedCalls'>;

const STATUS_LABELS: Record<TextBackStatus, string> = {
  sent: 'Text-back sent',
  pending: 'Sending…',
  failed: 'Text-back failed',
};

const MissedCallsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const tabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { data: calls } = useMissedCalls();

  const statusColor = (status: TextBackStatus) =>
    status === 'failed' ? theme.error : status === 'pending' ? theme.warning : theme.success;

  const renderItem = ({ item }: { item: MissedCall }) => {
    const label = item.callerName ?? item.phone;

    return (
      <TouchableOpacity
        activeOpacity={item.conversationId ? 0.7 : 1}
        disabled={!item.conversationId}
        onPress={() =>
          item.conversationId &&
          tabNavigation.navigate('InboxTab', {
            screen: 'Conversation',
            params: { conversationId: item.conversationId, contactName: label },
          })
        }
        style={[
          styles.card,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: item.recovered ? theme.success : theme.surfaceElevated },
          ]}>
          <Ionicons
            name={item.recovered ? 'checkmark' : 'call-outline'}
            size={18}
            color={item.recovered ? theme.onPrimary : theme.textSecondary}
          />
        </View>

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {label}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: statusColor(item.textBackStatus) }]} />
            <Text style={[styles.status, { color: theme.textSecondary }]}>
              {STATUS_LABELS[item.textBackStatus]}
              {item.recovered ? ' · replied' : ''}
            </Text>
          </View>
        </View>

        <Text style={[styles.time, { color: theme.textMuted }]}>
          {relativeTime(item.occurredAt)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <AppBar title="Missed Calls" onBack={() => navigation.goBack()} />

      <FlatList
        data={calls}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>
            No missed calls. Nice work.
          </Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    fontSize: 13,
  },
  time: {
    fontSize: 13,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default MissedCallsScreen;
