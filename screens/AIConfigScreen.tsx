import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';

const TONES = ['Friendly', 'Professional', 'Direct'];

const TOGGLES = [
  {
    key: 'textback',
    label: 'Auto text-back',
    detail: 'Reply instantly when a call is missed',
    value: true,
  },
  {
    key: 'booking',
    label: 'Offer booking',
    detail: 'Let Zippy propose appointment times',
    value: true,
  },
  {
    key: 'afterhours',
    label: 'After-hours only',
    detail: 'Only reply outside business hours',
    value: false,
  },
  {
    key: 'handoff',
    label: 'Escalate to me',
    detail: 'Notify you when a lead asks for a human',
    value: true,
  },
];

const AIConfigScreen: React.FC = () => {
  const { theme } = useTheme();
  const [tone, setTone] = useState('Friendly');
  const [greeting, setGreeting] = useState(
    "Sorry we missed your call! How can we help?",
  );
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(TOGGLES.map(t => [t.key, t.value])),
  );

  return (
    <ScreenContainer>
      <AppBar title="AI Configuration" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Tone of voice</Text>
        <View style={styles.row}>
          {TONES.map(t => {
            const active = tone === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTone(t)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.primary : 'transparent',
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipLabel,
                    { color: active ? theme.onPrimary : theme.textSecondary },
                  ]}>
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Missed-call greeting
        </Text>
        <TextInput
          value={greeting}
          onChangeText={setGreeting}
          multiline
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Behavior</Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {TOGGLES.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.toggleRow,
                index < TOGGLES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <View style={styles.toggleBody}>
                <Text style={[styles.toggleLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.toggleDetail, { color: theme.textSecondary }]}>
                  {item.detail}
                </Text>
              </View>
              <Switch
                value={toggles[item.key]}
                onValueChange={next =>
                  setToggles(prev => ({ ...prev, [item.key]: next }))
                }
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.surface}
              />
            </View>
          ))}
        </View>

        <PrimaryButton title="Save configuration" onPress={() => {}} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  toggleBody: {
    flex: 1,
    gap: 3,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleDetail: {
    fontSize: 13,
  },
});

export default AIConfigScreen;
