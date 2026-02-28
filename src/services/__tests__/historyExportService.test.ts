import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { historyExportService } from '../historyExportService';

// Mock Expo modules
jest.mock('expo-print', () => ({
    printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file://test-pdf-uri' }),
    printAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-sharing', () => ({
    isAvailableAsync: jest.fn().mockResolvedValue(true),
    shareAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-file-system', () => ({
    cacheDirectory: 'file://cache/',
    writeAsStringAsync: jest.fn().mockResolvedValue(null),
    EncodingType: { UTF8: 'utf8' },
}));

// Mock console.error to keep test output clean
jest.spyOn(console, 'error').mockImplementation(() => { });

describe('historyExportService', () => {
    const mockDoses = [
        {
            id: '1',
            medicationId: 'med1',
            medicationName: 'Aspirin',
            scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'taken',
            notes: 'Felt fine'
        },
        {
            id: '2',
            medicationId: 'med1',
            medicationName: 'Aspirin',
            scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'missed'
        }
    ] as any;

    const userName = 'Test User';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateHTML', () => {
        it('should generate HTML containing the user name', () => {
            const html = historyExportService.generateHTML(mockDoses, userName);
            expect(html).toContain(userName);
            expect(html).toContain('Medication Adherence Report');
        });

        it('should calculate correct adherence percentage', () => {
            const html = historyExportService.generateHTML(mockDoses, userName);
            // 2 total doses, 1 taken = 50%
            expect(html).toContain('50%');
        });

        it('should include medication breakdown if options provided', () => {
            const options = {
                medications: [{ id: 'med1', name: 'Aspirin', dosage: '100mg' }]
            };
            const html = historyExportService.generateHTML(mockDoses, userName, options);
            expect(html).toContain('Medication Breakdown');
            expect(html).toContain('Aspirin');
            expect(html).toContain('100mg');
        });
    });

    describe('exportToPDF', () => {
        it('should call Print and Sharing modules', async () => {
            const uri = await historyExportService.exportToPDF(mockDoses, userName);

            expect(Print.printToFileAsync).toHaveBeenCalled();
            expect(Sharing.isAvailableAsync).toHaveBeenCalled();
            expect(Sharing.shareAsync).toHaveBeenCalledWith('file://test-pdf-uri', expect.any(Object));
            expect(uri).toBe('file://test-pdf-uri');
        });

        it('should throw error if Print fails', async () => {
            (Print.printToFileAsync as jest.Mock).mockRejectedValueOnce(new Error('Print failed'));

            await expect(historyExportService.exportToPDF(mockDoses, userName))
                .rejects.toThrow('Failed to generate PDF report');
        });
    });

    describe('exportToCSV', () => {
        it('should write CSV file and share it', async () => {
            await historyExportService.exportToCSV(mockDoses);

            expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
                expect.stringContaining('pillara_history_'),
                expect.stringContaining('"Aspirin","2026-'),
                expect.any(Object)
            );
            expect(Sharing.shareAsync).toHaveBeenCalled();
        });

        it('should throw error if FileSystem fails', async () => {
            (FileSystem.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('FS failed'));

            await expect(historyExportService.exportToCSV(mockDoses))
                .rejects.toThrow('Failed to generate CSV report');
        });
    });

    describe('printReport', () => {
        it('should call Print.printAsync', async () => {
            await historyExportService.printReport(mockDoses, userName);
            expect(Print.printAsync).toHaveBeenCalledWith({ html: expect.any(String) });
        });
    });
});
