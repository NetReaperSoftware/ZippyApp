import React, { useMemo, useState } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenContainer from '../components/common/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';

type Contact = {
  id: string;
  name: string;
  detail: string;
};

// Placeholder data so the list renders while the UI is built out.
const CONTACTS: Contact[] = [
  { id: '1', name: 'Sofia Alvarez', detail: '(555) 0148 · Lead' },
  { id: '2', name: 'Owen Bright', detail: 'owen@brightco.com · Client' },
  { id: '3', name: 'Marcus Lee', detail: '(555) 0192 · Client' },
  { id: '4', name: 'Nina Kowalski', detail: 'nina@kowalski.io · Lead' },
  { id: '5', name: 'Priya Raman', detail: '(555) 0110 · Client' },
  { id: '6', name: 'Dana Whitfield', detail: 'dana@whitfield.co · Lead' },
];

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const ContactsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const filtered = CONTACTS.filter(contact =>
      contact.name.toLowerCase().includes(query.trim().toLowerCase()),
    );

    const byLetter = new Map<string, Contact[]>();
    for (const contact of filtered) {
      const letter = contact.name[0].toUpperCase();
      const bucket = byLetter.get(letter);
      if (bucket) {
        bucket.push(contact);
      } else {
        byLetter.set(letter, [contact]);
      }
    }

    return [...byLetter.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, data]) => ({
        title: letter,
        data: data.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [query]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Contacts</Text>

        <View
          style={[
            styles.search,
            { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
          ]}>
          <Ionicons name="search" size={17} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search contacts"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.6}>
            <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.avatarText, { color: theme.onPrimary }]}>
                {initialsOf(item.name)}
              </Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.detail}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>No contacts found</Text>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
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
  rowBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  detail: {
    fontSize: 13,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default ContactsScreen;
