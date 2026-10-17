import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CameraCapture from '../CameraCapture';

jest.mock('../processScan', () => ({
  processScan: jest.fn(),
}));

jest.setTimeout(15000);

jest.mock('expo-camera', () => {
  const React = require('react');
  const { Text: MockText } = require('react-native');
  const mockTakePictureAsync = jest.fn();
  const permission = { status: 'granted', granted: true, canAskAgain: true };
  const mockRequestPermission = jest.fn().mockResolvedValue(permission);
  const MockCameraView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      takePictureAsync: mockTakePictureAsync,
    }));
    return React.createElement(MockText, { testID: 'mock-camera' }, 'Camera');
  });
  MockCameraView.takePictureAsync = mockTakePictureAsync;
  return {
    CameraView: MockCameraView,
    useCameraPermissions: jest.fn(() => [permission, mockRequestPermission]),
    __permission: permission,
    __requestPermission: mockRequestPermission,
    PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
  };
});

const cameraMock = require('expo-camera');
const processScanMock = require('../processScan').processScan;

describe('CameraCapture (scan feature)', () => {
  beforeEach(() => {
    cameraMock.__permission.status = 'granted';
    cameraMock.__permission.granted = true;
    cameraMock.__requestPermission.mockResolvedValue(cameraMock.__permission);
    cameraMock.CameraView.takePictureAsync.mockResolvedValue({ uri: 'file:///scan.jpg' });
    processScanMock.mockResolvedValue({
      state: 'complete',
      ocrText: 'Ingredients: water',
      classification: {
        status: 'Halal',
        reasoning: 'All recognized ingredients are classified as Halal.',
      },
      scanId: 1,
    });
  });

  it('captures a photo, shows the result, and resets', async () => {
    const { getByTestId, queryByText, queryByTestId } = await render(<CameraCapture />);

    await act(async () => {
      fireEvent.press(getByTestId('capture-btn'));
    });

    await waitFor(() => expect(queryByTestId('preview')).toBeTruthy());
    expect(queryByText(/Ingredients:/)).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('scan-again-btn'));
    });

    await waitFor(() => expect(queryByTestId('camera-view')).toBeTruthy());
  });

  it('renders recovery UI when permission is denied', async () => {
    cameraMock.__permission.status = 'denied';
    cameraMock.__permission.granted = false;
    const { getByText } = await render(<CameraCapture />);
    await waitFor(() => expect(getByText(/camera permission/i)).toBeTruthy());
  });

  it('renders camera when permission is granted', async () => {
    cameraMock.__permission.status = 'granted';
    cameraMock.__permission.granted = true;
    const { getByTestId } = await render(<CameraCapture />);
    await waitFor(() => expect(getByTestId('camera-view')).toBeTruthy());
  });

  it('requests permission on mount and handles granted response', async () => {
    const mockRequest = cameraMock.__requestPermission;
    cameraMock.__permission.status = null;
    cameraMock.__permission.granted = false;
    mockRequest.mockResolvedValueOnce({ status: 'granted', granted: true, canAskAgain: true });
    const { getByTestId } = await render(<CameraCapture />);
    await waitFor(() => expect(mockRequest).toHaveBeenCalled());
  });

  it('shows a capture error without crashing', async () => {
    cameraMock.CameraView.takePictureAsync.mockRejectedValueOnce(new Error('camera failed'));
    const { getByTestId, findByText } = await render(<CameraCapture />);

    await act(async () => {
      fireEvent.press(getByTestId('capture-btn'));
    });

    expect(await findByText(/camera failed/i)).toBeTruthy();
  });
});
