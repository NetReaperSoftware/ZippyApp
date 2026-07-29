import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useLeads } from '../hooks';
import {
  CHANNEL_LABELS,
  LEAD_STAGE_LABELS,
  currency,
  initialsOf,
  relativeTime,
} from '../utils/format';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'LeadDetail'>;
type Route = RouteProp<MoreStackParamList, 'LeadDetail'>;

const LeadDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data: leads } = useLeads();

  const lead = leads.find(l => l.id === params.leadId);

  if (!lead) {
    return (
      <ScreenContainer>
        <AppBar title="Lead" onBack={() => navigation.goBack()} />
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          This lead is no longer available.
        </Text>
      </ScreenContainer>
    );
  }

  const rows = [
    { icon: 'call-outline', label: 'Phone', value: lead.phone ?? '—' },
    { icon: 'mail-outline', label: 'Email', value: lead.email ?? '—' },
    { icon: 'funnel-outline', label: 'Stage', value: LEAD_STAGE_LABELS[lead.stage] },
    { icon: 'enter-outline', label: 'Source', value: CHANNEL_LABELS[lead.source] },
    { icon: 'time-outline', label: 'Added', value: `${relativeTime(lead.createdAt)} ago` },
    {
      icon: 'cash-outline',
      label: 'Value',
      value: lead.estimatedValue !== null ? currency(lead.estimatedValue) : '—',
    },
  ];

  return (
    <ScreenContainer>
      <AppBar title="Lead" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
              {initialsOf(lead.name)}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{lead.name}</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.row,
                index < rows.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <Ionicons name={row.icon} size={18} color={theme.textMuted} />
              <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.rowValue, { color: theme.text }]} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton title="Message" onPress={() => {}} />
          <PrimaryButton title="Book appointment" onPress={() => {}} variant="outline" />
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
  identity: {
    alignItems: 'center',
    gap: 12,
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
  name: {
    fontSize: 22,
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
    gap: 12,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 14,
    width: 64,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  actions: {
    gap: 10,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default LeadDetailScreen;
