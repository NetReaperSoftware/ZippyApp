import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useReps } from '../hooks';
import { currency, initialsOf } from '../utils/format';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'RepDetail'>;
type Route = RouteProp<MoreStackParamList, 'RepDetail'>;

const RepDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data: reps } = useReps();

  const rep = reps.find(r => r.id === params.repId);

  if (!rep) {
    return (
      <ScreenContainer>
        <AppBar title="Rep" onBack={() => navigation.goBack()} />
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          This rep is no longer available.
        </Text>
      </ScreenContainer>
    );
  }

  const funnel = [
    { label: 'Clicks', value: rep.clicks },
    { label: 'Leads', value: rep.leads },
    { label: 'Appointments', value: rep.appointments },
    { label: 'Sales', value: rep.sales },
  ];

  return (
    <ScreenContainer>
      <AppBar title={rep.name} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
              {initialsOf(rep.name)}
            </Text>
          </View>
          <Text style={[styles.link, { color: theme.primary }]}>
            myzippy.app/{rep.referralSlug}
          </Text>
          <Text style={[styles.commission, { color: theme.text }]}>
            {currency(rep.commission)} earned
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {funnel.map((step, index) => (
            <View
              key={step.label}
              style={[
                styles.row,
                index < funnel.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{step.label}</Text>
              <Text style={[styles.rowValue, { color: theme.text }]}>{step.value}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton title="Copy referral link" onPress={() => {}} variant="outline" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
  },
  identity: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
  commission: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 15,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default RepDetailScreen;
