import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

interface AppBarProps {
  title: string;
  /** Renders a back chevron on the left; ignored when `left` is provided. */
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
}

/**
 * Fixed top bar: optional left control, centred title, optional right control.
 *
 * Both side slots are a fixed width so the title stays optically centred
 * regardless of what the icons are — don't swap them for intrinsic sizing.
 */
const AppBar: React.FC<AppBarProps> = ({ title, onBack, left, right }) => {
  const { theme } = useTheme();

  const leftContent =
    left ??
    (onBack ? (
      <TouchableOpacity
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}>
        <Ionicons name="chevron-back" size={26} color={theme.text} />
      </TouchableOpacity>
    ) : null);

  return (
    <View style={[styles.bar, { borderBottomColor: theme.borderLight }]}>
      <View style={[styles.slot, styles.slotLeft]}>{leftContent}</View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.slot, styles.slotRight]}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 52,
    borderBottomWidth: 1,
  },
  slot: {
    width: 44,
    justifyContent: 'center',
  },
  slotLeft: {
    alignItems: 'flex-start',
  },
  slotRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default AppBar;
