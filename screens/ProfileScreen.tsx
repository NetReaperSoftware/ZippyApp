import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { initialsOf } from '../utils/format';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { user, role, signOut } = useAuth();

  const name = (user?.user_metadata?.name as string | undefined) ?? 'Not signed in';
  const email = user?.email ?? '—';

  const rows = [
    { icon: 'mail-outline', label: 'Email', value: email },
    { icon: 'shield-outline', label: 'Role', value: role },
    { icon: 'business-outline', label: 'Business', value: 'MyZippy Demo Co.' },
  ];

  return (
    <ScreenContainer>
      <AppBar title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
              {initialsOf(name === 'Not signed in' ? 'MZ' : name)}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
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

        <PrimaryButton title="Sign Out" onPress={signOut} variant="outline" />
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
    width: 70,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});

export default ProfileScreen;
