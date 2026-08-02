import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useReps } from '../hooks';
import { currency } from '../utils/format';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'AdminDashboard'>;

const AdminDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: reps } = useReps();

  const totals = useMemo(
    () =>
      reps.reduce(
        (acc, rep) => ({
          clicks: acc.clicks + rep.clicks,
          leads: acc.leads + rep.leads,
          sales: acc.sales + rep.sales,
          commission: acc.commission + rep.commission,
        }),
        { clicks: 0, leads: 0, sales: 0, commission: 0 },
      ),
    [reps],
  );

  const stats = [
    { key: 'clicks', label: 'Referral clicks', value: String(totals.clicks) },
    { key: 'leads', label: 'Leads', value: String(totals.leads) },
    { key: 'sales', label: 'Sales', value: String(totals.sales) },
    { key: 'commission', label: 'Commission', value: currency(totals.commission) },
  ];

  return (
    <ScreenContainer>
      <AppBar title="Admin" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {stats.map(stat => (
            <View
              key={stat.key}
              style={[
                styles.statCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Reps')}
          style={[
            styles.linkCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <Ionicons name="ribbon-outline" size={20} color={theme.primary} />
          <Text style={[styles.linkLabel, { color: theme.text }]}>Manage Zippy Reps</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  grid: {
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
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  linkLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;
