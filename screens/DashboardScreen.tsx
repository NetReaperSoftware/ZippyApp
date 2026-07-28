import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';

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

  return (
    <ScreenContainer>
      <View style={[styles.appBar, { borderBottomColor: theme.borderLight }]}>
        <TouchableOpacity
          style={[styles.appBarButton, styles.appBarLeft]}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          hitSlop={8}>
          <Ionicons name="person-circle-outline" size={28} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.appBarTitle, { color: theme.text }]}>MyZippy</Text>

        <TouchableOpacity
          style={[styles.appBarButton, styles.appBarRight]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}>
          <Ionicons name="notifications-outline" size={25} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 52,
    borderBottomWidth: 1,
  },
  // Equal fixed widths on both sides keep the title optically centered
  // regardless of the icons' intrinsic sizes.
  appBarButton: {
    width: 44,
    justifyContent: 'center',
  },
  appBarLeft: {
    alignItems: 'flex-start',
  },
  appBarRight: {
    alignItems: 'flex-end',
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    gap: 20,
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
