import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useAppointments } from '../hooks';
import { clockTime, dayLabel } from '../utils/format';
import type { CalendarStackParamList } from '../types/Navigation';
import type { Appointment, AppointmentStatus } from '../types/Models';

type Nav = NativeStackNavigationProp<CalendarStackParamList, 'Calendar'>;

const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: appointments } = useAppointments();

  const sections = useMemo(() => {
    const byDay = new Map<string, Appointment[]>();
    for (const appt of [...appointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt))) {
      const key = dayLabel(appt.startsAt);
      const bucket = byDay.get(key);
      if (bucket) {
        bucket.push(appt);
      } else {
        byDay.set(key, [appt]);
      }
    }
    return [...byDay.entries()].map(([title, data]) => ({ title, data }));
  }, [appointments]);

  const statusColor = (status: AppointmentStatus) =>
    status === 'confirmed' ? theme.success : status === 'pending' ? theme.warning : theme.error;

  return (
    <ScreenContainer>
      <AppBar
        title="Calendar"
        right={
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="New appointment" hitSlop={8}>
            <Ionicons name="add" size={26} color={theme.text} />
          </TouchableOpacity>
        }
      />

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
        renderItem={({ item }) => {
          const color = statusColor(item.status);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
              style={[
                styles.card,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <View style={[styles.rail, { backgroundColor: color }]} />

              <View style={styles.body}>
                <Text style={[styles.time, { color: theme.textSecondary }]}>
                  {clockTime(item.startsAt)} · {item.durationMinutes}m
                </Text>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                  {item.title} — {item.contactName}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color={theme.textMuted} />
                  <Text style={[styles.location, { color: theme.textMuted }]}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
                <Text style={[styles.pillText, { color }]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>
            Nothing booked yet.
          </Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
  rail: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
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
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default CalendarScreen;
