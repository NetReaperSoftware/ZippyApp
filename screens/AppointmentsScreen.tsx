import React from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';

type Appointment = {
  id: string;
  time: string;
  title: string;
  location: string;
  status: 'confirmed' | 'pending';
};

// Placeholder data so the list renders while the UI is built out.
const SECTIONS: { title: string; data: Appointment[] }[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        time: '9:00 AM',
        title: 'Intro call — Dana Whitfield',
        location: 'Phone',
        status: 'confirmed',
      },
      {
        id: '2',
        time: '11:30 AM',
        title: 'Site visit — Marcus Lee',
        location: '412 Cedar St',
        status: 'confirmed',
      },
      {
        id: '3',
        time: '3:00 PM',
        title: 'Follow-up — Owen Bright',
        location: 'Video',
        status: 'pending',
      },
    ],
  },
  {
    title: 'Tomorrow',
    data: [
      {
        id: '4',
        time: '10:00 AM',
        title: 'Consultation — Priya Raman',
        location: 'Office',
        status: 'confirmed',
      },
      {
        id: '5',
        time: '2:15 PM',
        title: 'Quote review — Nina Kowalski',
        location: 'Video',
        status: 'pending',
      },
    ],
  },
];

const AppointmentsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Appointments</Text>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => {
          const statusColor = item.status === 'confirmed' ? theme.success : theme.warning;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
              activeOpacity={0.7}>
              <View style={[styles.timeRail, { backgroundColor: statusColor }]} />

              <View style={styles.cardBody}>
                <Text style={[styles.time, { color: theme.textSecondary }]}>{item.time}</Text>
                <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={theme.textMuted} />
                  <Text style={[styles.location, { color: theme.textMuted }]}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <View style={[styles.statusPill, { backgroundColor: `${statusColor}22` }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    overflow: 'hidden',
  },
  timeRail: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default AppointmentsScreen;
