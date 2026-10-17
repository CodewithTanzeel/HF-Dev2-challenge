import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button component', () => {
  it('renders with title and handles press', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('handles disabled state', async () => {
    const { getByText } = await render(<Button title="Disabled" disabled={true} />);
    expect(getByText('Disabled')).toBeTruthy();
  });

  it('handles null title gracefully', async () => {
    const { getByText } = await render(<Button title={null} />);
    expect(getByText('Button')).toBeTruthy(); // default fallback
  });

  it('handles null onPress (does not throw)', async () => {
    const { getByText } = await render(<Button title="No action" />);
    expect(() => fireEvent.press(getByText('No action'))).not.toThrow();
  });
});
