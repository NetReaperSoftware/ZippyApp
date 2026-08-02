import React, { useMemo, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useLeads } from '../hooks';
import { CHANNEL_LABELS, LEAD_STAGE_LABELS, initialsOf } from '../utils/format';
import type { FeatureRoutes } from '../types/Navigation';
import type { Lead, LeadStage } from '../types/Models';

type Nav = NativeStackNavigationProp<FeatureRoutes, 'Leads'>;
type StageFilter = 'all' | LeadStage;

const STAGE_FILTERS: StageFilter[] = ['all', 'new', 'contacted', 'booked', 'won', 'lost'];

const stageLabel = (s: StageFilter) => (s === 'all' ? 'All' : LEAD_STAGE_LABELS[s]);

const LeadsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: leads } = useLeads();
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<StageFilter>('all');

  const sections = useMemo(() => {
    const filtered = leads.filter(lead => {
      const matchesQuery = lead.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStage = stage === 'all' || lead.stage === stage;
      return matchesQuery && matchesStage;
    });

    const byLetter = new Map<string, Lead[]>();
    for (const lead of filtered) {
      const letter = lead.name[0].toUpperCase();
      const bucket = byLetter.get(letter);
      if (bucket) {
        bucket.push(lead);
      } else {
        byLetter.set(letter, [lead]);
      }
    }

    return [...byLetter.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({
        title,
        data: data.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [leads, query, stage]);

  return (
    <ScreenContainer>
      <AppBar title="Leads" showBack />

      <View style={styles.header}>
        <View
          style={[
            styles.search,
            { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
          ]}>
          <Ionicons name="search" size={17} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search leads"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {STAGE_FILTERS.map(s => {
            const selected = stage === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setStage(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.primary : 'transparent',
                    borderColor: selected ? theme.primary : theme.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipLabel,
                    { color: selected ? theme.onPrimary : theme.textSecondary },
                  ]}>
                  {stageLabel(s)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('LeadDetail', { leadId: item.id })}>
            <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
                {initialsOf(item.name)}
              </Text>
            </View>

            <View style={styles.rowBody}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.phone ?? item.email ?? '—'} · {CHANNEL_LABELS[item.source]}
              </Text>
            </View>

            <Text style={[styles.stage, { color: theme.textMuted }]}>
              {LEAD_STAGE_LABELS[item.stage]}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>No leads found</Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  detail: {
    fontSize: 13,
  },
  stage: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default LeadsScreen;
