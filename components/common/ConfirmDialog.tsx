import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm action in the error colour for destructive operations. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Themed confirmation dialog.
 *
 * Deliberately not React Native's `Alert`: react-native-web ships `Alert.alert`
 * as an empty no-op, so any Alert-based flow is silently dead in the web demo.
 * `Modal` is properly implemented on both platforms, and this also lets the
 * dialog follow the app theme, which a native Alert never could.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.modalBackground }]}
        onPress={onCancel}>
        {/* Swallow presses inside the card so they don't dismiss the dialog. */}
        <Pressable
          onPress={() => {}}
          style={[
            styles.card,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
          ]}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              accessibilityRole="button"
              style={[styles.button, { borderColor: theme.border }]}>
              <Text style={[styles.buttonLabel, { color: theme.text }]}>{cancelLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              accessibilityRole="button"
              style={[
                styles.button,
                {
                  backgroundColor: destructive ? theme.error : theme.primary,
                  borderColor: destructive ? theme.error : theme.primary,
                },
              ]}>
              <Text
                style={[
                  styles.buttonLabel,
                  { color: destructive ? '#ffffff' : theme.onPrimary },
                ]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ConfirmDialog;
