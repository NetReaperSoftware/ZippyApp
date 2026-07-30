import React, { useMemo, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, isSameDay, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import MonthGrid, { dateKey, type DayCounts } from '../components/calendar/MonthGrid';
import AppointmentCard from '../components/calendar/AppointmentCard';
import { useTheme } from '../contexts/ThemeContext';
import { useAppointments } from '../hooks';
import { dayLabel } from '../utils/format';
import type { CalendarStackParamList } from '../types/Navigation';
import type { Appointment } from '../types/Models';

type Nav = NativeStackNavigationProp<CalendarStackParamList, 'Calendar'>;
type ViewMode = 'month' | 'list';

const VIEW_MODES: { key: ViewMode; label: string; icon: string }[] = [
  { key: 'month', label: 'Month', icon: 'calendar-outline' },
  { key: 'list', label: 'List', icon: 'list-outline' },
];

const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: appointments } = useAppointments();

  const [mode, setMode] = useState<ViewMode>('month');
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const sorted = useMemo(
    () => [...appointments].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [appointments],
  );

  /** Appointment count per day, driving the dots under each date cell. */
  const counts = useMemo(() => {
    const map: DayCounts = {};
    for (const appt of sorted) {
      const key = dateKey(parseISO(appt.startsAt));
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [sorted]);

  const selectedDayAppointments = useMemo(
    () => sorted.filter(a => isSameDay(parseISO(a.startsAt), selectedDate)),
    [sorted, selectedDate],
  );

  const sections = useMemo(() => {
    const byDay = new Map<string, Appointment[]>();
    for (const appt of sorted) {
      const key = dayLabel(appt.startsAt);
      const bucket = byDay.get(key);
      if (bucket) {
        bucket.push(appt);
      } else {
        byDay.set(key, [appt]);
      }
    }
    return [...byDay.entries()].map(([title, data]) => ({ title, data }));
  }, [sorted]);

  const openDetail = (id: string) =>
    navigation.navigate('AppointmentDetail', { appointmentId: id });

  const segmented = (
    <View style={[styles.segmented, { backgroundColor: theme.surfaceElevated }]}>
      {VIEW_MODES.map(item => {
        const active = mode === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => setMode(item.key)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && { backgroundColor: theme.primary }]}>
            <Ionicons
              name={item.icon}
              size={15}
              color={active ? theme.onPrimary : theme.textSecondary}
            />
            <Text
              style={[
                styles.segmentLabel,
                { color: active ? theme.onPrimary : theme.textSecondary },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer>
      <AppBar
        title="Calendar"
        right={
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="New appointment"
            hitSlop={8}>
            <Ionicons name="add" size={26} color={theme.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.segmentedWrap}>{segmented}</View>

      {mode === 'month' ? (
        <ScrollView contentContainerStyle={styles.monthScroll}>
          <MonthGrid
            month={month}
            onMonthChange={setMonth}
            selectedDate={selectedDate}
            onSelectDate={date => {
              setSelectedDate(date);
              // Tapping a trailing/leading cell should follow it into that month.
              setMonth(date);
            }}
            counts={counts}
          />

          <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

          <View style={styles.agenda}>
            <Text style={[styles.agendaTitle, { color: theme.text }]}>
              {format(selectedDate, 'EEEE, d MMMM')}
            </Text>

            {selectedDayAppointments.length === 0 ? (
              <Text style={[styles.empty, { color: theme.textMuted }]}>
                Nothing scheduled this day.
              </Text>
            ) : (
              selectedDayAppointments.map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onPress={() => openDetail(appt.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      ) : (
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
            <AppointmentCard appointment={item} onPress={() => openDetail(item.id)} />
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.textMuted }]}>Nothing booked yet.</Text>
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  segmentedWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  monthScroll: {
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 4,
  },
  agenda: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
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
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
});

export default CalendarScreen;
