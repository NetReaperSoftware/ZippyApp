import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../types/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordReset'>;

const PasswordResetScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter the email address on your account.');
      return;
    }

    setSubmitting(true);
    const { error } = await resetPassword(email.trim());
    setSubmitting(false);

    if (error) {
      Alert.alert('Reset failed', error.message ?? 'Please try again.');
      return;
    }

    Alert.alert('Email sent', 'Follow the link in your inbox to set a new password.');
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Reset password</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          We'll email you a link to set a new password.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
        />

        <PrimaryButton title="Send Reset Link" onPress={handleReset} loading={submitting} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default PasswordResetScreen;
