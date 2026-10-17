import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ScanHistory from '../ScanHistory';

jest.mock('expo-sqlite', () => {
    const database = {
        execSync: jest.fn(),
        runSync: jest.fn(),
        getAllAsync: jest.fn().mockResolvedValue([]),
    };

    return {
        openDatabaseSync: jest.fn(() => database),
        __database: database,
    };
});

const sqliteMock = require('expo-sqlite');

describe('ScanHistory', () => {
    it('initializes the database and handles an empty scan list', async () => {
        const screen = await render(<ScanHistory />);

        await waitFor(() => expect(sqliteMock.__database.getAllAsync).toHaveBeenCalledWith('SELECT * FROM scans ORDER BY created_at DESC'));
        expect(screen.getByText(/No scans yet/i)).toBeTruthy();
    });

    it('shows a database error instead of rejecting during startup', async () => {
        sqliteMock.__database.getAllAsync.mockRejectedValueOnce(new Error('database unavailable'));
        const screen = await render(<ScanHistory />);

        await waitFor(() => expect(screen.getByText(/Unable to load scan history/i)).toBeTruthy());
    });
});
