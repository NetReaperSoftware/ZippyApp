import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

/** Number of appointments per `yyyy-MM-dd`, used to render the day markers. */
export type DayCounts = Record<string, number>;

interface MonthGridProps {
  /** Month currently displayed; only the month/year are significant. */
  month: Date;
  onMonthChange: (next: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  counts: DayCounts;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
/** Cap the dots so a busy day doesn't overflow its cell. */
const MAX_DOTS = 3;

export const dateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const MonthGrid: React.FC<MonthGridProps> = ({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  counts,
}) => {
  const { theme } = useTheme();

  // Always six rows' worth of cells so the grid height doesn't jump between
  // months, which would shift the agenda below it.
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [days]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onMonthChange(subMonths(month, 1))}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {format(month, 'MMMM yyyy')}
        </Text>

        <TouchableOpacity
          onPress={() => onMonthChange(addMonths(month, 1))}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          hitSlop={10}>
          <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((label, index) => (
          <Text
            key={`${label}-${index}`}
            style={[styles.weekday, { color: theme.textMuted }]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map(day => {
            const inMonth = isSameMonth(day, month);
            const selected = isSameDay(day, selectedDate);
            const today = isToday(day);
            const count = counts[dateKey(day)] ?? 0;

            const labelColor = selected
              ? theme.onPrimary
              : inMonth
              ? theme.text
              : theme.textMuted;

            return (
              <TouchableOpacity
                key={day.toISOString()}
                onPress={() => onSelectDate(day)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${format(day, 'EEEE d MMMM')}, ${count} appointments`}
                style={styles.cell}>
                <View
                  style={[
                    styles.dayCircle,
                    selected && { backgroundColor: theme.primary },
                    // Today gets a ring rather than a fill so it stays visible
                    // when another day is selected.
                    !selected && today && { borderWidth: 1.5, borderColor: theme.primary },
                  ]}>
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: labelColor },
                      (selected || today) && styles.dayLabelStrong,
                    ]}>
                    {format(day, 'd')}
                  </Text>
                </View>

                <View style={styles.dotRow}>
                  {Array.from({ length: Math.min(count, MAX_DOTS) }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: selected ? theme.primary : theme.textMuted,
                        },
                      ]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  week: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 15,
  },
  dayLabelStrong: {
    fontWeight: '700',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default MonthGrid;
