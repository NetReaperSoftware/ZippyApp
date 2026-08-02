import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardStats } from '../hooks';
import type { DashboardStackParamList, MainTabParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Overview'>;

/**
 * At-a-glance numbers: the missed-call banner plus the four running totals.
 * Split out of the Dashboard so that screen can lead with the feature list.
 */
const OverviewScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const tabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { data: stats } = useDashboardStats();

  const tiles = [
    {
      key: 'contacts',
      label: 'Contacts',
      value: stats.contacts,
      icon: 'person-outline',
      go: () => navigation.navigate('Leads'),
    },
    {
      key: 'appointments',
      label: 'Appointments',
      value: stats.appointments,
      icon: 'calendar-outline',
      go: () => tabNavigation.navigate('CalendarTab', { screen: 'Calendar' }),
    },
    {
      key: 'messages',
      label: 'Messages',
      value: stats.messages,
      icon: 'chatbubble-outline',
      go: () => tabNavigation.navigate('InboxTab', { screen: 'Inbox' }),
    },
    {
      key: 'aiReplies',
      label: 'AI Replies',
      value: stats.aiReplies,
      icon: 'sparkles-outline',
      go: () => tabNavigation.navigate('ZippyTab', { screen: 'ZippyAssistant' }),
    },
  ];

  return (
    <ScreenContainer>
      <AppBar title="Overview" showBack />

      <ScrollView contentContainerStyle={styles.content}>
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

        <View style={styles.tileGrid}>
          {tiles.map(tile => (
            <TouchableOpacity
              key={tile.key}
              activeOpacity={0.7}
              onPress={tile.go}
              style={[
                styles.tile,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <View style={styles.tileTop}>
                <Ionicons name={tile.icon} size={16} color={theme.primary} />
                <Text style={[styles.tileLabel, { color: theme.textSecondary }]}>
                  {tile.label}
                </Text>
              </View>
              <Text style={[styles.tileValue, { color: theme.text }]}>{tile.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
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
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '46%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    gap: 6,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tileLabel: {
    fontSize: 12.5,
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default OverviewScreen;
