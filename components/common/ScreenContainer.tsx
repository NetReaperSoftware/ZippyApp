import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

interface ScreenContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Skip the top safe-area inset when the screen sits under a header. */
  edgeToEdgeTop?: boolean;
}

/**
 * Standard screen wrapper: themed background plus safe-area padding.
 */
const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  edgeToEdgeTop = false,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: edgeToEdgeTop ? 0 : insets.top,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;
