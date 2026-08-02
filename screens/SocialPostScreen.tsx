import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useSocialPosts } from '../hooks';

import type { SocialPlatform } from '../types/Models';

const PLATFORMS: { key: SocialPlatform; label: string; icon: string }[] = [
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
  { key: 'google_business', label: 'Google', icon: 'business-outline' },
];

const SocialPostScreen: React.FC = () => {
  const { theme } = useTheme();
  const { data: posts } = useSocialPosts();
  const [platform, setPlatform] = useState<SocialPlatform>('facebook');
  const [prompt, setPrompt] = useState('');

  const latest = posts[0];

  return (
    <ScreenContainer>
      <AppBar title="Social Posts" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Platform</Text>
        <View style={styles.platformRow}>
          {PLATFORMS.map(p => {
            const selected = platform === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => setPlatform(p.key)}
                style={[
                  styles.platform,
                  {
                    backgroundColor: selected ? theme.primary : theme.cardBackground,
                    borderColor: selected ? theme.primary : theme.border,
                  },
                ]}>
                <Ionicons
                  name={p.icon}
                  size={20}
                  color={selected ? theme.onPrimary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.platformLabel,
                    { color: selected ? theme.onPrimary : theme.textSecondary },
                  ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>What's it about?</Text>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="e.g. Spring promo for new customers"
          placeholderTextColor={theme.textMuted}
          multiline
          style={[
            styles.promptInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
        />

        <PrimaryButton title="Generate with Zippy AI" onPress={() => {}} />

        {latest && (
          <>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Latest draft</Text>
            <View
              style={[
                styles.card,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}>
              <Text style={[styles.postBody, { color: theme.text }]}>{latest.body}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.cardAction}>
                  <Ionicons name="copy-outline" size={16} color={theme.primary} />
                  <Text style={[styles.cardActionText, { color: theme.primary }]}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardAction}>
                  <Ionicons name="share-outline" size={16} color={theme.primary} />
                  <Text style={[styles.cardActionText, { color: theme.primary }]}>Export</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
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
  platformRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  platformLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  promptInput: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 20,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SocialPostScreen;
