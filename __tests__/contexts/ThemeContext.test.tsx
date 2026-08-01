import React from 'react';
import {Text} from 'react-native';
import {render, screen, waitFor} from '@testing-library/react-native';
import {DEFAULT_THEME_MODE, ThemeProvider, useTheme} from '../../contexts/ThemeContext';

function Probe(): React.JSX.Element {
  const {theme, themeMode} = useTheme();
  return <Text testID="probe">{`${themeMode}:${theme.primary}`}</Text>;
}

describe('ThemeContext', () => {
  it('defaults to Basic mode and exposes its palette', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    // Asserted literally rather than derived from the theme, so an accidental
    // change to the Basic palette fails here instead of passing silently.
    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveTextContent('basic:#a8ef00');
    });
    expect(DEFAULT_THEME_MODE).toBe('basic');
  });

  it('throws when used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
