import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import AppBar from '../components/common/AppBar';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks';
import { relativeTime } from '../utils/format';
import type { DashboardStackParamList } from '../types/Navigation';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Notifications'>;

const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: notifications } = useNotifications();

  return (
    <ScreenContainer>
      <AppBar title="Notifications" onBack={() => navigation.goBack()} />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.borderLight }]} />
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: item.read ? 'transparent' : theme.primary },
              ]}
            />
            <View style={styles.body}>
              <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.text, { color: theme.textSecondary }]}>{item.body}</Text>
            </View>
            <Text style={[styles.time, { color: theme.textMuted }]}>
              {relativeTime(item.receivedAt)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>Nothing new.</Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginLeft: 18,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default NotificationsScreen;
