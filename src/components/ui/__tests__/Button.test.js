import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button component', () => {
  it('renders with title and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    const { getByText } = render(<Button title="Disabled" disabled={true} />);
    expect(getByText('Disabled')).toBeTruthy();
  });

  it('handles null title gracefully', () => {
    const { getByText } = render(<Button title={null} />);
    expect(getByText('Button')).toBeTruthy(); // default fallback
  });

  it('handles null onPress (does not throw)', () => {
    const { getByText } = render(<Button title="No action" />);
    expect(() => fireEvent.press(getByText('No action'))).not.toThrow();
  });
});
