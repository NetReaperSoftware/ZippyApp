import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'More'>;

type Row = {
  key: keyof MoreStackParamList;
  label: string;
  icon: string;
};

const BUSINESS_ROWS: Row[] = [
  { key: 'Leads', label: 'Contacts', icon: 'people-outline' },
  { key: 'SocialPost', label: 'Social Hub', icon: 'share-social-outline' },
  { key: 'WebsiteRequest', label: 'AI Website', icon: 'globe-outline' },
  { key: 'Broadcasts', label: 'Broadcasts', icon: 'megaphone-outline' },
  { key: 'AIConfig', label: 'AI Configurations', icon: 'options-outline' },
];

const ACCOUNT_ROWS: Row[] = [
  { key: 'Profile', label: 'Profile', icon: 'person-outline' },
  { key: 'Settings', label: 'Settings', icon: 'settings-outline' },
];

const ADMIN_ROWS: Row[] = [
  { key: 'AdminDashboard', label: 'Admin Dashboard', icon: 'stats-chart-outline' },
  { key: 'Reps', label: 'Zippy Reps', icon: 'ribbon-outline' },
];

const MoreScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { role } = useAuth();

  const groups: { title: string; rows: Row[] }[] = [
    { title: 'Business', rows: BUSINESS_ROWS },
    { title: 'Account', rows: ACCOUNT_ROWS },
  ];

  if (role === 'admin' || role === 'rep') {
    groups.push({ title: 'Admin', rows: ADMIN_ROWS });
  }

  return (
    <ScreenContainer>
      <AppBar title="More" />

      <ScrollView contentContainerStyle={styles.content}>
        {groups.map(group => (
          <View key={group.title} style={styles.group}>
            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
              {group.title}
            </Text>

            <View
              style={[
                styles.card,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              {group.rows.map((row, index) => (
                <TouchableOpacity
                  key={row.key}
                  activeOpacity={0.6}
                  // Every row in these groups is a param-less route.
                  onPress={() => navigation.navigate(row.key as 'Leads')}
                  style={[
                    styles.row,
                    index < group.rows.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.borderLight,
                    },
                  ]}>
                  <Ionicons name={row.icon} size={20} color={theme.textSecondary} />
                  <Text style={[styles.rowLabel, { color: theme.text }]}>{row.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
  },
  group: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
});

export default MoreScreen;
