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

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  // Most features live in sibling tabs, so a tab-level handle is needed too.
  const tabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { data: stats } = useDashboardStats();

  const tiles = [
    { key: 'contacts', label: 'Contacts', value: stats.contacts, icon: 'person-outline' },
    {
      key: 'appointments',
      label: 'Appointments',
      value: stats.appointments,
      icon: 'calendar-outline',
    },
    { key: 'messages', label: 'Messages', value: stats.messages, icon: 'chatbubble-outline' },
    { key: 'aiReplies', label: 'AI Replies', value: stats.aiReplies, icon: 'sparkles-outline' },
  ];

  const features = [
    {
      key: 'assistant',
      label: 'AI Assistant',
      detail: 'Smart tools to grow your business',
      icon: 'sparkles',
      go: () => tabNavigation.navigate('ZippyTab', { screen: 'ZippyAssistant' }),
    },
    {
      key: 'textback',
      label: 'AI Text Back',
      detail: 'AI replies to missed calls & texts',
      icon: 'chatbubble-ellipses',
      go: () => navigation.navigate('MissedCalls'),
    },
    {
      key: 'appointments',
      label: 'Appointments',
      detail: 'Booking & schedule management',
      icon: 'calendar',
      go: () => tabNavigation.navigate('CalendarTab', { screen: 'Calendar' }),
    },
    {
      key: 'social',
      label: 'Social Hub',
      detail: 'Connect across all platforms',
      icon: 'share-social',
      go: () => tabNavigation.navigate('MoreTab', { screen: 'SocialPost' }),
    },
    {
      key: 'contacts',
      label: 'Contacts',
      detail: 'Customers & lead management',
      icon: 'people',
      go: () => tabNavigation.navigate('MoreTab', { screen: 'Leads' }),
    },
    {
      key: 'website',
      label: 'AI Website',
      detail: 'AI powered website & hosting',
      icon: 'globe',
      go: () => tabNavigation.navigate('MoreTab', { screen: 'WebsiteRequest' }),
    },
    {
      key: 'broadcasts',
      label: 'Broadcasts',
      detail: 'SMS, email & voice blasts',
      icon: 'megaphone',
      go: () => tabNavigation.navigate('MoreTab', { screen: 'Broadcasts' }),
    },
    {
      key: 'aiconfig',
      label: 'AI Configurations',
      detail: 'Run language & behavior setup',
      icon: 'options',
      go: () => tabNavigation.navigate('MoreTab', { screen: 'AIConfig' }),
    },
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
        {/* Hero: the product's core promise stays above everything else. */}
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
            <View
              key={tile.key}
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
            </View>
          ))}
        </View>

        <View style={styles.featureList}>
          {features.map(feature => (
            <TouchableOpacity
              key={feature.key}
              activeOpacity={0.7}
              onPress={feature.go}
              style={[
                styles.featureRow,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}1f` }]}>
                <Ionicons name={feature.icon} size={18} color={theme.primary} />
              </View>

              <View style={styles.featureBody}>
                <Text style={[styles.featureLabel, { color: theme.text }]}>
                  {feature.label}
                </Text>
                <Text
                  style={[styles.featureDetail, { color: theme.textSecondary }]}
                  numberOfLines={1}>
                  {feature.detail}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
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
    gap: 14,
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
  featureList: {
    gap: 9,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: {
    flex: 1,
    gap: 2,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  featureDetail: {
    fontSize: 12.5,
  },
});

export default DashboardScreen;
