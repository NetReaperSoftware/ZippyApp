import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useReps } from '../hooks';
import { currency, initialsOf } from '../utils/format';
import type { MoreStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<MoreStackParamList, 'Reps'>;

const RepsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: reps } = useReps();

  return (
    <ScreenContainer>
      <AppBar
        title="Zippy Reps"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Add rep" hitSlop={8}>
            <Ionicons name="add" size={26} color={theme.text} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={reps}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RepDetail', { repId: item.id })}
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
                {initialsOf(item.name)}
              </Text>
            </View>

            <View style={styles.body}>
              <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.slug, { color: theme.textMuted }]}>
                myzippy.app/{item.referralSlug}
              </Text>
            </View>

            <View style={styles.metrics}>
              <Text style={[styles.commission, { color: theme.text }]}>
                {currency(item.commission)}
              </Text>
              <Text style={[styles.sales, { color: theme.textSecondary }]}>
                {item.sales} sales
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>No reps yet.</Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
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
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  slug: {
    fontSize: 12,
  },
  metrics: {
    alignItems: 'flex-end',
    gap: 2,
  },
  commission: {
    fontSize: 15,
    fontWeight: '700',
  },
  sales: {
    fontSize: 12,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default RepsScreen;
