import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Placeholder figures so the layout is visible while the UI is built out.
const STATS = [
  { key: 'unread', label: 'Unread', value: '12', icon: 'chatbubble-ellipses' },
  { key: 'today', label: 'Today', value: '4', icon: 'calendar' },
  { key: 'contacts', label: 'Contacts', value: '318', icon: 'people' },
  { key: 'followups', label: 'Follow-ups', value: '7', icon: 'flag' },
];

const ACTIVITY = [
  { id: '1', title: 'New message from Dana Whitfield', time: '8m ago' },
  { id: '2', title: 'Appointment confirmed — Marcus Lee', time: '1h ago' },
  { id: '3', title: 'Contact added — Priya Raman', time: '3h ago' },
  { id: '4', title: 'Follow-up due — Owen Bright', time: 'Yesterday' },
];

const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name ?? user?.email ?? 'there';

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hi, {displayName}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Here's what's happening today
          </Text>
        </View>

        <View style={styles.statGrid}>
          {STATS.map(stat => (
            <View
              key={stat.key}
              style={[
                styles.statCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <Ionicons name={stat.icon} size={20} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent activity</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {ACTIVITY.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                index < ACTIVITY.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <View style={styles.activityText}>
                <Text style={[styles.activityTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.activityTime, { color: theme.textMuted }]}>
                  {item.time}
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
    gap: 20,
  },
  header: {
    gap: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  activityText: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 13,
  },
});

export default DashboardScreen;
