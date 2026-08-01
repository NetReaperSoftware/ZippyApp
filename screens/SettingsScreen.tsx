import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'Settings'>;

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark', 'classic', 'basic'];

const SettingsScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation<Nav>();

  return (
    <ScreenContainer>
      <AppBar title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.section,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
          <View style={styles.modeRow}>
            {THEME_MODES.map(mode => {
              const selected = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  style={[
                    styles.modeChip,
                    {
                      backgroundColor: selected ? theme.primary : 'transparent',
                      borderColor: selected ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.modeLabel,
                      { color: selected ? theme.onPrimary : theme.text },
                    ]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {user?.email ?? 'Not signed in'}
          </Text>
        </View>

        <PrimaryButton title="Sign Out" onPress={signOut} variant="outline" />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modeRow: {
    flexDirection: 'row',
    // Five modes no longer fit on one line on narrower devices.
    flexWrap: 'wrap',
    gap: 8,
  },
  modeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 16,
  },
});

export default SettingsScreen;
