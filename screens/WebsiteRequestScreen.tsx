import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useWebsiteRequests } from '../hooks';
import { relativeTime } from '../utils/format';
import type { FeatureRoutes } from '../types/Navigation';
import type { WebsiteRequest } from '../types/Models';

type Nav = NativeStackNavigationProp<FeatureRoutes, 'WebsiteRequest'>;

const STATUS_LABELS: Record<WebsiteRequest['status'], string> = {
  submitted: 'Submitted',
  in_progress: 'In progress',
  complete: 'Complete',
};

const WebsiteRequestScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: requests } = useWebsiteRequests();
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  const statusColor = (status: WebsiteRequest['status']) =>
    status === 'complete'
      ? theme.success
      : status === 'in_progress'
      ? theme.warning
      : theme.textMuted;

  return (
    <ScreenContainer>
      <AppBar title="Website Requests" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>New request</Text>

        <TextInput
          value={summary}
          onChangeText={setSummary}
          placeholder="Short summary"
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

        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="What needs changing?"
          placeholderTextColor={theme.textMuted}
          multiline
          style={[
            styles.input,
            styles.multiline,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
        />

        <PrimaryButton title="Submit request" onPress={() => {}} />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Your requests</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          {requests.map((request, index) => (
            <View
              key={request.id}
              style={[
                styles.row,
                index < requests.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.borderLight,
                },
              ]}>
              <View style={styles.rowBody}>
                <Text style={[styles.summary, { color: theme.text }]} numberOfLines={1}>
                  {request.summary}
                </Text>
                <Text style={[styles.meta, { color: theme.textMuted }]}>
                  {relativeTime(request.submittedAt)} ago
                </Text>
              </View>
              <Text style={[styles.status, { color: statusColor(request.status) }]}>
                {STATUS_LABELS[request.status]}
              </Text>
            </View>
          ))}
        </View>
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  summary: {
    fontSize: 15,
    fontWeight: '500',
  },
  meta: {
    fontSize: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WebsiteRequestScreen;
