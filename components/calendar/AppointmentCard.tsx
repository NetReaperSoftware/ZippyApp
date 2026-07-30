import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { clockTime } from '../../utils/format';
import type { Appointment, AppointmentStatus } from '../../types/Models';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
}

/** Shared between the month view's day agenda and the flat list view. */
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onPress }) => {
  const { theme } = useTheme();

  const statusColor = (status: AppointmentStatus) =>
    status === 'confirmed' ? theme.success : status === 'pending' ? theme.warning : theme.error;

  const color = statusColor(appointment.status);
  const cancelled = appointment.status === 'cancelled';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}>
      <View style={[styles.rail, { backgroundColor: color }]} />

      <View style={styles.body}>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {clockTime(appointment.startsAt)} · {appointment.durationMinutes}m
        </Text>
        <Text
          style={[
            styles.title,
            { color: theme.text },
            cancelled && styles.strikethrough,
          ]}
          numberOfLines={1}>
          {appointment.title} — {appointment.contactName}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={theme.textMuted} />
          <Text style={[styles.location, { color: theme.textMuted }]}>
            {appointment.location}
          </Text>
        </View>
      </View>

      <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
        <Text style={[styles.pillText, { color }]}>{appointment.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  strikethrough: {
    textDecorationLine: 'line-through',
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
});

export default AppointmentCard;
