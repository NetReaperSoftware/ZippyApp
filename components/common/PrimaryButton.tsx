import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid',
}) => {
  const { theme } = useTheme();
  const isInactive = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: isOutline ? 'transparent' : theme.primary,
          borderColor: theme.primary,
          opacity: isInactive ? 0.6 : 1,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? theme.primary : '#ffffff'} />
      ) : (
        <Text style={[styles.label, { color: isOutline ? theme.primary : '#ffffff' }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
