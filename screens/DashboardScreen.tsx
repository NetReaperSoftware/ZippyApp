import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useActivity, useDashboardStats } from '../hooks';
import { currency, relativeTime } from '../utils/format';
import type { DashboardStackParamList, MainTabParamList } from '../types/Navigation';
import type { ActivityItem } from '../types/Models';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>;

const ACTIVITY_ICONS: Record<ActivityItem['kind'], string> = {
  message: 'chatbubble-ellipses',
  appointment: 'calendar',
  lead: 'person-add',
  missed_call: 'call',
};

const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  // Separate handle for jumping to a sibling tab (Leads lives in the More stack).
  const tabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { data: stats } = useDashboardStats();
  const { data: activity } = useActivity();

  const openLeads = () => tabNavigation.navigate('MoreTab', { screen: 'Leads' });

  const secondaryStats = [
    { key: 'leads', label: 'New leads', value: String(stats.newLeads), onPress: openLeads },
    { key: 'booked', label: 'Booked', value: String(stats.bookedThisWeek) },
    { key: 'recovered', label: 'Recovered', value: currency(stats.revenueRecovered) },
  ];

  return (
    <ScreenContainer>
      <AppBar
        title="MyZippy"
        left={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Profile"
            hitSlop={8}
            onPress={() => tabNavigation.navigate('MoreTab', { screen: 'Profile' })}>
            <Ionicons name="person-circle-outline" size={28} color={theme.text} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            hitSlop={8}
            onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={25} color={theme.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero: the product's core promise, always first. */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MissedCalls')}
          style={[
            styles.hero,
            { backgroundColor: theme.cardBackground, borderColor: theme.primary },
          ]}>
          <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="call" size={20} color={theme.onPrimary} />
          </View>

          <View style={styles.heroBody}>
            <Text style={[styles.heroTitle, { color: theme.text }]}>
              {stats.missedCallsToday} missed{' '}
              {stats.missedCallsToday === 1 ? 'call' : 'calls'} today
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
              {stats.recoveredToday} recovered by auto text-back
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={styles.statRow}>
          {secondaryStats.map(stat => (
            <TouchableOpacity
              key={stat.key}
              activeOpacity={stat.onPress ? 0.7 : 1}
              onPress={stat.onPress}
              disabled={!stat.onPress}
              style={[
                styles.statCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent activity</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {activity.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                index < activity.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <Ionicons name={ACTIVITY_ICONS[item.kind]} size={18} color={theme.textMuted} />
              <Text style={[styles.activityTitle, { color: theme.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.activityTime, { color: theme.textMuted }]}>
                {relativeTime(item.occurredAt)}
              </Text>
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  heroIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: {
    flex: 1,
    gap: 3,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
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
  activityTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 13,
  },
});

export default DashboardScreen;
