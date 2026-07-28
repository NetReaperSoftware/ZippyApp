import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name ?? user?.email ?? 'there';

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hi, {displayName}</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Home</Text>
          <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
            Replace this screen with the first real feature. Screens live in `screens/`,
            shared UI in `components/`, data access in `services/`.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default HomeScreen;
