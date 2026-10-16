import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CameraCapture from '../CameraCapture';

describe('CameraCapture (scan feature)', () => {
  it('renders camera view and capture button', () => {
    const { getByTestId, getByText } = render(<CameraCapture />);
    expect(getByTestId('camera-view')).toBeTruthy();
    expect(getByText(/Capture/)).toBeTruthy();
  });

  it('updates photo state when capture button pressed', () => {
    const { getByText, queryByTestId } = render(<CameraCapture />);
    fireEvent.press(getByText(/Capture/));
    expect(queryByTestId('preview')).toBeTruthy();
  });

  it('shows preview when photo exists', () => {
    const { getByTestId, queryByText } = render(<CameraCapture />);
    fireEvent.press(getByTestId('capture-btn'));
    expect(queryByText(/Ingredients:/)).toBeTruthy();
  });

  it('handles button press without crash', () => {
    const { getByTestId } = render(<CameraCapture />);
    expect(() => fireEvent.press(getByTestId('capture-btn'))).not.toThrow();
  });
});
