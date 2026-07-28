import React from 'react';
import {Text} from 'react-native';
import {render, screen, waitFor} from '@testing-library/react-native';
import {ThemeProvider, useTheme} from '../../contexts/ThemeContext';

function Probe(): React.JSX.Element {
  const {theme, themeMode} = useTheme();
  return <Text testID="probe">{`${themeMode}:${theme.primary}`}</Text>;
}

describe('ThemeContext', () => {
  it('defaults to system mode and exposes a palette', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveTextContent('system:#4285F4');
    });
  });

  it('throws when used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
