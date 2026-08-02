import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addMinutes, format, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useTheme } from '../contexts/ThemeContext';
import { useAppointments } from '../hooks';
import { clockTime, initialsOf } from '../utils/format';
import type { CalendarStackParamList } from '../types/Navigation';
import type { AppointmentStatus } from '../types/Models';

type Nav = NativeStackNavigationProp<CalendarStackParamList, 'AppointmentDetail'>;
type Route = RouteProp<CalendarStackParamList, 'AppointmentDetail'>;

const AppointmentDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data: appointments } = useAppointments();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editNotice, setEditNotice] = useState(false);

  const appointment = appointments.find(a => a.id === params.appointmentId);

  if (!appointment) {
    return (
      <ScreenContainer>
        <AppBar title="Appointment" showBack />
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          This appointment is no longer available.
        </Text>
      </ScreenContainer>
    );
  }

  const start = parseISO(appointment.startsAt);
  const end = addMinutes(start, appointment.durationMinutes);

  const statusColor = (status: AppointmentStatus) =>
    status === 'confirmed' ? theme.success : status === 'pending' ? theme.warning : theme.error;
  const color = statusColor(appointment.status);

  const detailRows = [
    { icon: 'location-outline', label: 'Location', value: appointment.location },
    {
      icon: 'hourglass-outline',
      label: 'Duration',
      value: `${appointment.durationMinutes} minutes`,
    },
    {
      icon: 'repeat-outline',
      label: 'Repeats',
      value: 'Does not repeat',
    },
    {
      icon: 'notifications-outline',
      label: 'Reminder',
      value: '1 hour before',
    },
  ];

  return (
    <ScreenContainer>
      <AppBar
        title="Appointment"
        showBack
        // Two controls on the right, so both slots widen to keep the title centred.
        slotWidth={84}
        right={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setEditNotice(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit appointment"
              hitSlop={8}>
              <Ionicons name="create-outline" size={23} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setConfirmDelete(true)}
              accessibilityRole="button"
              accessibilityLabel="Delete appointment"
              hitSlop={8}>
              <Ionicons name="trash-outline" size={22} color={theme.error} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <View style={[styles.statusPill, { backgroundColor: `${color}22` }]}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text style={[styles.statusText, { color }]}>{appointment.status}</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{appointment.title}</Text>
        </View>

        {/* When block — the thing you look for first on a booking. */}
        <View
          style={[
            styles.whenCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <View style={[styles.whenIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="calendar" size={20} color={theme.onPrimary} />
          </View>
          <View style={styles.whenBody}>
            <Text style={[styles.whenDate, { color: theme.text }]}>
              {format(start, 'EEEE, d MMMM yyyy')}
            </Text>
            <Text style={[styles.whenTime, { color: theme.textSecondary }]}>
              {clockTime(appointment.startsAt)} – {clockTime(end.toISOString())}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Contact</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.contactCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
              {initialsOf(appointment.contactName)}
            </Text>
          </View>
          <Text style={[styles.contactName, { color: theme.text }]} numberOfLines={1}>
            {appointment.contactName}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Details</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {detailRows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.row,
                index < detailRows.length - 1 && {
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
          <PrimaryButton title="Message contact" onPress={() => {}} />
          <PrimaryButton title="Reschedule" onPress={() => setEditNotice(true)} variant="outline" />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete appointment?"
        message={`${appointment.title} with ${appointment.contactName} will be removed from your calendar.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          navigation.goBack();
        }}
      />

      <ConfirmDialog
        visible={editNotice}
        title="Editing coming soon"
        message="Appointment editing isn't wired up in this demo yet."
        confirmLabel="Got it"
        cancelLabel="Close"
        onCancel={() => setEditNotice(false)}
        onConfirm={() => setEditNotice(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
  },
  heading: {
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  whenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
  },
  whenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whenBody: {
    flex: 1,
    gap: 3,
  },
  whenDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  whenTime: {
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
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
  contactName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
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
    width: 76,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default AppointmentDetailScreen;
