import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useAppointments } from '../hooks';
import { clockTime, dayLabel } from '../utils/format';
import type { CalendarStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<CalendarStackParamList, 'AppointmentDetail'>;
type Route = RouteProp<CalendarStackParamList, 'AppointmentDetail'>;

const AppointmentDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data: appointments } = useAppointments();

  const appointment = appointments.find(a => a.id === params.appointmentId);

  if (!appointment) {
    return (
      <ScreenContainer>
        <AppBar title="Appointment" onBack={() => navigation.goBack()} />
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          This appointment is no longer available.
        </Text>
      </ScreenContainer>
    );
  }

  const rows = [
    { icon: 'person-outline', label: 'Contact', value: appointment.contactName },
    {
      icon: 'time-outline',
      label: 'When',
      value: `${dayLabel(appointment.startsAt)} at ${clockTime(appointment.startsAt)}`,
    },
    { icon: 'hourglass-outline', label: 'Duration', value: `${appointment.durationMinutes} minutes` },
    { icon: 'location-outline', label: 'Location', value: appointment.location },
    { icon: 'checkmark-circle-outline', label: 'Status', value: appointment.status },
  ];

  return (
    <ScreenContainer>
      <AppBar title="Appointment" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{appointment.title}</Text>

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
          <PrimaryButton title="Message contact" onPress={() => {}} />
          <PrimaryButton title="Reschedule" onPress={() => {}} variant="outline" />
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
  title: {
    fontSize: 24,
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
    width: 76,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    textTransform: 'capitalize',
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

export default AppointmentDetailScreen;
