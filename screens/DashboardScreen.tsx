import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardStats } from '../hooks';
import type { DashboardStackParamList, MainTabParamList } from '../types/Navigation';
import zippyHero from '../assets/images/zippy-hero.png';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  // Some features live in sibling tabs, so a tab-level handle is needed too.
  const tabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { data: stats } = useDashboardStats();

  const features = [
    {
      key: 'assistant',
      label: 'AI Assistant',
      detail: 'Smart tools to grow your business',
      icon: 'sparkles',
      go: () => tabNavigation.navigate('ZippyTab', { screen: 'ZippyAssistant' }),
    },
    {
      key: 'chatgpt',
      label: 'ChatGPT',
      detail: 'Your AI Content & support',
      icon: 'color-wand',
      go: () => tabNavigation.navigate('ZippyTab', { screen: 'ChatGPT' }),
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
    // These push onto the Dashboard's own stack rather than jumping to the More
    // tab, so Back returns here.
    {
      key: 'social',
      label: 'Social Hub',
      detail: 'Connect across all platforms',
      icon: 'share-social',
      go: () => navigation.navigate('SocialPost'),
    },
    {
      key: 'contacts',
      label: 'Contacts',
      detail: 'Customers & lead management',
      icon: 'people',
      go: () => navigation.navigate('Leads'),
    },
    {
      key: 'website',
      label: 'AI Website',
      detail: 'AI powered website & hosting',
      icon: 'globe',
      go: () => navigation.navigate('WebsiteRequest'),
    },
    {
      key: 'broadcasts',
      label: 'Broadcasts',
      detail: 'SMS, email & voice blasts',
      icon: 'megaphone',
      go: () => navigation.navigate('Broadcasts'),
    },
    {
      key: 'aiconfig',
      label: 'AI Configurations',
      detail: 'Run language & behavior setup',
      icon: 'options',
      go: () => navigation.navigate('AIConfig'),
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
        <View style={styles.heroImageWrap}>
          <Image
            source={zippyHero}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Zippy holding a phone showing the MyZippy app"
          />
        </View>

        {/* Numbers live behind this rather than on the Dashboard, so the feature
            list stays the focus here. */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Overview')}
          style={[
            styles.overview,
            { backgroundColor: theme.cardBackground, borderColor: theme.primary },
          ]}>
          <View style={[styles.overviewIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="stats-chart" size={19} color={theme.onPrimary} />
          </View>

          <View style={styles.overviewBody}>
            <Text style={[styles.overviewTitle, { color: theme.text }]}>Overview</Text>
            <Text style={[styles.overviewSubtitle, { color: theme.textSecondary }]}>
              {stats.missedCallsToday} missed today · {stats.contacts} contacts ·{' '}
              {stats.appointments} booked
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

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
  heroImageWrap: {
    alignItems: 'center',
    // Negative top margin lets the artwork sit tight under the app bar without
    // the transparent PNG's padding opening a visible gap.
    marginTop: -6,
  },
  heroImage: {
    width: '78%',
    height: 210,
  },
  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  overviewIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewBody: {
    flex: 1,
    gap: 3,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  overviewSubtitle: {
    fontSize: 12.5,
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
